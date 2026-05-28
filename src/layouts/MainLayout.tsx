import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)]">
      {/* 
        Rule 6: Portal UI Structure
        - StoryBar (topmost)
        - PortalIconBar (sticky categories)
      */}
      <header className="fixed top-0 w-full z-40">
        {/* Placeholder for StoryBar & PortalIconBar */}
        <div className="h-16 bg-[var(--pm-surface)]/80 backdrop-blur-md border-b border-[var(--pm-border)]">
          {/* StoryBar content here */}
        </div>
        <div className="h-14 bg-[var(--pm-surface)]/80 backdrop-blur-md border-b border-[var(--pm-border)]">
          {/* PortalIconBar content here */}
        </div>
      </header>

      <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        {children}
      </main>

      {/* Bottom Nav Placeholder */}
      <footer className="fixed bottom-0 w-full h-16 bg-[var(--pm-surface)] border-t border-[var(--pm-border)] z-40">
        {/* Navigation here */}
      </footer>
    </div>
  );
};
