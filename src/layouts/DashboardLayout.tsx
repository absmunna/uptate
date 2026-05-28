import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="min-h-screen bg-[var(--pm-bg)] text-[var(--pm-text)] flex">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 bg-[var(--pm-surface)] border-r border-[var(--pm-border)] p-4 flex-col fixed h-screen">
        {sidebar}
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};
