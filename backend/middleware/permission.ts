import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    permissions: string[];
  };
}

export const requirePermission = (requiredPermission: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // In production, this data comes from JWT.
    // For this sprint, we assume req.user is populated by AuthGuard.
    const userPermissions = req.user?.permissions || [];
    
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        error: "Forbidden",
        message: `Missing required scope: ${requiredPermission}`,
        timestamp: new Date().toISOString()
      });
    }
    
    next();
  };
};
