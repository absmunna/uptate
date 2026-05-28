import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export const ChatList = () => {
  const navigate = useNavigate();

  // Reusing posts endpoint for chat list as per plan
  const { data, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: () => fetch('/api/v1/posts').then(res => res.json())
  });

  return (
    <div className="pb-16 w-full max-w-[480px] mx-auto min-h-screen">
      <div className="flex items-center gap-3 px-3 mb-3 pt-3">
        <button onClick={() => navigate("/")}
          className="w-8 h-8 rounded-full flex items-center justify-center border"
          style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
          <ArrowLeft className="w-4 h-4 text-[var(--pm-text)]" />
        </button>
        <h1 className="font-extrabold text-lg text-[var(--pm-text)]">Messages</h1>
      </div>

      {isLoading ? (
        <div className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin mx-auto text-[var(--pm-accent)]"/></div>
      ) : (
        <div className="px-3 space-y-3">
            {data?.slice(0, 5).map((chat: any) => (
                <div key={chat.id} className="p-4 rounded-2xl border flex items-center gap-4"
                    style={{ background: "var(--pm-surface)", borderColor: "var(--pm-border)" }}>
                    <MessageCircle className="w-8 h-8 text-[var(--pm-text-muted)]"/>
                    <div className="flex-1">
                        <p className="text-sm font-bold text-[var(--pm-text)]">{chat.author || 'User'}</p>
                        <p className="text-xs text-[var(--pm-text-muted)] truncate">{chat.content || '...'}</p>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};
