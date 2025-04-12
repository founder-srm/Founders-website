'use client';

import { SessionProvider } from '@/components/providers/SessionProvider';
import { AchievementTracker } from '@/components/ui/achievement-tracker';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AchievementTracker>
        <main className="dashboard-layout">{children}</main>
      </AchievementTracker>
    </SessionProvider>
  );
}
