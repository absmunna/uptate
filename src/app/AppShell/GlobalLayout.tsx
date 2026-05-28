import React from 'react';
import { GlobalSidebar } from './GlobalSidebar';
import { GlobalTopBar } from './GlobalTopBar';
import { MobileBottomNav } from './MobileBottomNav';
import { AppLauncher } from './AppLauncher';
import { MobileSidebar } from './MobileSidebar';
import { useAuth } from '@/features/auth/AuthContext';
import { cn } from '@/lib/utils';
import { Zap, X } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

export const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative">
       {/* Desktop Sidebar */}
       <GlobalSidebar />

       {/* Main Content Area */}
       <div className="flex-1 flex flex-col min-w-0">
          <GlobalTopBar onToggleSidebar={() => setIsSidebarOpen(true)} />
          
          <main className={cn(
            "flex-1 w-full max-w-[1280px] mx-auto pb-24 lg:pb-10 transition-all duration-500",
            // Padding adjusting for three-column if needed in specific pages via sub-layouts
          )}>
             {children}
          </main>

          <MobileBottomNav />
          <AppLauncher />
       </div>

       {/* Mobile Sidebar Overlay */}
       <AnimatePresence>
         {isSidebarOpen && (
            <MobileSidebar onClose={() => setIsSidebarOpen(false)} />
         )}
       </AnimatePresence>
    </div>
  );
};
