import React, { useState } from 'react';
import { HelpCircle, MessageSquarePlus, ThumbsUp, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface QuestionAnswer {
  id: string;
  userName: string;
  question: string;
  answer?: string;
  createdAt: string;
  answeredAt?: string;
  votes?: number;
}

interface ProductQASectionProps {
  questionsAnswers: QuestionAnswer[];
  productId: string;
}

export const ProductQASection: React.FC<ProductQASectionProps> = ({ questionsAnswers: initialQA }) => {
  const [qaList, setQaList] = useState<QuestionAnswer[]>(initialQA);
  const [newQuestion, setNewQuestion] = useState('');
  const [showAskForm, setShowAskForm] = useState(false);
  const [votesMap, setVotesMap] = useState<Record<string, number>>({});

  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) {
      toast.error("Please enter a valid question");
      return;
    }

    const newItem: QuestionAnswer = {
      id: `q_${Date.now()}`,
      userName: "You (Active Buyer)",
      question: newQuestion,
      createdAt: "Just now",
      votes: 0,
    };

    setQaList([newItem, ...qaList]);
    setNewQuestion('');
    setShowAskForm(false);
    toast.success("Your question was submitted. The seller has been notified!");
  };

  const handleVote = (id: string) => {
    setVotesMap((prev) => {
      const isVoted = prev[id];
      const nextMap = { ...prev };
      if (isVoted) {
        delete nextMap[id];
        toast.info("Upvote removed");
      } else {
        nextMap[id] = 1;
        toast.success("Question upvoted!");
      }
      return nextMap;
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-[var(--pm-border)] pb-4 flex-wrap gap-3">
        <div>
          <h3 className="font-sans font-medium text-lg text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" /> Buyer ↔ Seller Q&A
          </h3>
          <p className="text-xs text-[var(--pm-text-secondary)] mt-1">Get precise answers straight from official merchants and verified designers.</p>
        </div>
        <Button onClick={() => setShowAskForm(!showAskForm)} className="text-xs font-semibold rounded-xl h-10 px-5 bg-[var(--pm-glass)] hover:bg-[var(--pm-glass)]/80 text-[var(--pm-text)] gap-2 border border-[var(--pm-border)]">
          <MessageSquarePlus className="w-4 h-4" /> Ask a Question
        </Button>
      </div>

      {/* Ask Question Composer Form */}
      {showAskForm && (
        <form onSubmit={handleSubmitQuestion} className="bg-[var(--pm-surface)] border border-[var(--pm-border)] p-4 rounded-2xl flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 text-xs text-cyan-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Global Q&A System Instruction
          </div>
          <p className="text-xs text-[var(--pm-text-secondary)] -mt-2">Ensure your question relates directly to traditional handloom quality, customization sizing, or shipping lead times.</p>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="Ask your query (e.g., Is custom sizing available?)"
            className="h-24 px-4 py-3 bg-[var(--pm-bg)] border border-[var(--pm-border)] rounded-xl text-sm text-[var(--pm-text)] placeholder:text-[var(--pm-text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--pm-accent)] resize-none"
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setShowAskForm(false)} className="rounded-xl h-10 border-[var(--pm-border)]">
              Cancel
            </Button>
            <Button type="submit" size="sm" className="rounded-xl h-10 px-5 bg-[var(--pm-accent)] text-white hover:bg-[var(--pm-accent)]/90">
              Submit Question
            </Button>
          </div>
        </form>
      )}

      {/* QA Feed Stack */}
      <div className="space-y-5">
        {qaList.length === 0 ? (
          <p className="text-center py-6 text-[var(--pm-text-secondary)] text-sm italic">No questions asked yet. Ask the seller about product features, materials, or shipping!</p>
        ) : (
          qaList.map((qa) => {
            const votes = (qa.votes || 0) + (votesMap[qa.id] || 0);
            return (
              <div key={qa.id} className="flex flex-col gap-3 group">
                {/* Question Block */}
                <div className="p-4 bg-[var(--pm-surface)] border border-[var(--pm-border)] rounded-2xl flex items-start gap-4">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 font-bold font-mono">
                    Q
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white">{qa.userName}</span>
                      <span className="text-[10px] text-[var(--pm-text-secondary)]">• {qa.createdAt}</span>
                    </div>
                    <p className="text-sm text-[var(--pm-text-secondary)] mt-1">{qa.question}</p>
                  </div>
                  <button
                    onClick={() => handleVote(qa.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition-all ${
                      votesMap[qa.id]
                        ? 'bg-cyan-400/20 border-cyan-400 text-cyan-400'
                        : 'bg-black/20 border-[var(--pm-border)] text-[var(--pm-text-secondary)] hover:text-white hover:border-zinc-600'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{votes}</span>
                  </button>
                </div>

                {/* Response / Answer Block */}
                {qa.answer ? (
                  <div className="ml-8 md:ml-12 p-4 bg-cyan-950/10 border-l-[3px] border-cyan-400 bg-[var(--pm-surface)]/50 rounded-r-2xl rounded-bl-2xl flex items-start gap-4 shadow-sm">
                    <div className="h-9 w-9 shrink-0 rounded-xl bg-cyan-400 text-black flex items-center justify-center font-bold font-mono">
                      A
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white flex items-center gap-1">Official Seller Reply <MessageSquare className="w-4 h-4 text-cyan-400" /></span>
                        {qa.answeredAt && <span className="text-[10px] text-[var(--pm-text-secondary)]">• {qa.answeredAt}</span>}
                      </div>
                      <p className="text-sm text-[var(--pm-text)] mt-1 font-medium">{qa.answer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="ml-8 md:ml-12 p-4 bg-zinc-900/40 border-l-2 border-zinc-600 rounded-r-2xl rounded-bl-2xl text-xs text-orange-400 flex items-center gap-2">
                    ⏳ Waiting for response from the official merchant partner...
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
