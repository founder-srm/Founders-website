import { SessionProvider } from '@/components/providers/SessionProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <main className="dashboard-layout">{children}</main>
    </SessionProvider>
  );
}
