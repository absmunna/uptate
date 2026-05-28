import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import { AuthenticatedRequest } from '../../middleware/auth';

export interface FeedItem {
  id: string;
  contentType: string;
  title: string;
  content: string;
  mediaUrl: string | null;
  authorId: string;
  author: {
    id: string;
    fullName: string;
    role: string;
  };
  visibility: string;
  isPromoted: boolean;
  metadata: any;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  rankingScore: number;
}

// 1. Projection Layer (maps DB ContentItem to FeedItem read-model projection)
function projectToFeedItem(item: any, sourceWeight: number): FeedItem {
  // If we have aggregated analytics containing structured virality metrics, we factor them in automatically
  const viralityIndexBoost = item.analytics ? item.analytics.viralityIndex * 15 : 0;

  const engagementScore = (item.likeCount * 5) + (item.commentCount * 10) + viralityIndexBoost;
  const hoursSinceCreated = Math.max(
    0.1,
    (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 60 * 60)
  );
  
  // Power/exponential recency decay: Score = (Base Source Weight + Engagement) / DecayFactor
  const recencyDecay = Math.pow(hoursSinceCreated + 2, 1.5);
  const rankBoost = item.isPromoted ? 500 : 0;
  const rankingScore = ((sourceWeight + engagementScore + rankBoost) / recencyDecay);

  return {
    id: item.id,
    contentType: item.contentType,
    title: item.title,
    content: item.content,
    mediaUrl: item.mediaUrl,
    authorId: item.authorId,
    author: {
      id: item.author.id,
      fullName: item.author.fullName,
      role: item.author.role
    },
    visibility: item.visibility,
    isPromoted: item.isPromoted,
    metadata: item.metadata || {},
    likeCount: item.likeCount,
    commentCount: item.commentCount,
    createdAt: item.createdAt,
    rankingScore
  };
}

/**
 * 2. Get Assembly / Personal Feed
 * Aggregates following feed, trending/global feed, categories, filters with security visibility.
 */
export const assembleHomeFeed = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const currentUserId = req.user?.id;
    const { category, limit = '10', cursor } = req.query;
    const limitInt = parseInt(limit as string, 10);

    // Fetch followed targets if user is logged in
    let followedUserIds: string[] = [];
    let followedCategoryNames: string[] = [];

    if (currentUserId) {
      const relationships = await prisma.followRelationship.findMany({
        where: {
          followerId: currentUserId,
          deletedAt: null
        },
        select: {
          targetId: true,
          targetType: true
        }
      });

      followedUserIds = relationships
        .filter((r) => r.targetType === 'USER' || r.targetType === 'BUSINESS')
        .map((r) => r.targetId);

      followedCategoryNames = relationships
        .filter((r) => r.targetType === 'CATEGORY')
        .map((r) => r.targetId);
    }

    // Query builder options
    const queryOptions: any = {
      where: {
        deletedAt: null,
      },
      take: limitInt * 2, // overfetch for client projection ranking & post-query visibility checks
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        author: {
          select: {
            id: true,
            fullName: true,
            role: true
          }
        },
        analytics: true
      }
    };

    // Keep pagination robust with cursor-based limits
    if (cursor) {
      queryOptions.skip = 1;
      queryOptions.cursor = { id: cursor as string };
    }

    // Fetch all fresh raw ContentItems candidate pool
    const rawItems = await prisma.contentItem.findMany(queryOptions);

    const projectedFeedItems: FeedItem[] = [];

    for (const item of rawItems) {
      // 3. Security / Visibility Guards Check
      const isAuthor = currentUserId === item.authorId;
      const isFollower = currentUserId ? followedUserIds.includes(item.authorId) : false;

      if (item.visibility === 'PRIVATE' && !isAuthor) {
        continue; // Skip private content from other users
      }

      if (item.visibility === 'FOLLOWERS_ONLY' && !isAuthor && !isFollower) {
        continue; // Skip followers-only content if not following
      }

      // Determine relational score weights
      let sourceWeight = 50; // Global baseline
      
      if (isFollower) {
        sourceWeight += 200; // Strong affinity boost for followed users/businesses
      }

      // Check category affinity weight
      const targetCategory = (item.metadata as any)?.category;
      if (targetCategory && followedCategoryNames.some(cat => cat.toLowerCase() === targetCategory.toLowerCase())) {
        sourceWeight += 100;
      }

      // Filter by category query if explicitly requested
      if (category && targetCategory && targetCategory.toLowerCase() !== (category as string).toLowerCase()) {
        continue; // Filtered request
      }

      projectedFeedItems.push(projectToFeedItem(item, sourceWeight));
    }

    // Sort according to Basic Rule-Based Score Rank descending
    projectedFeedItems.sort((a, b) => b.rankingScore - a.rankingScore);

    // Splice down to original requested limit
    const paginatedItems = projectedFeedItems.slice(0, limitInt);
    const nextCursor = paginatedItems.length > 0 ? paginatedItems[paginatedItems.length - 1].id : null;

    res.status(200).json({
      status: 'success',
      data: paginatedItems,
      nextCursor
    });

  } catch (error) {
    console.error('[Feed Assembler] Error in assembleHomeFeed', error);
    res.status(500).json({ error: 'Failed to assemble feed timeline projection' });
  }
};
