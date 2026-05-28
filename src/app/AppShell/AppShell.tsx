import React from 'react';
import { GlobalLayout } from './GlobalLayout';
import { GlobalRouter } from './GlobalRouter';
import { EventSyncProvider } from './EventSyncProvider';
import { RoleBasedShell } from './RoleBasedShell';

import { GlobalErrorBoundary } from './GlobalErrorBoundary';

export const AppShell: React.FC = () => {
  return (
    <GlobalErrorBoundary>
        <EventSyncProvider>
            <RoleBasedShell>
                <GlobalLayout>
                    <GlobalRouter />
                </GlobalLayout>
            </RoleBasedShell>
        </EventSyncProvider>
    </GlobalErrorBoundary>
  );
};
