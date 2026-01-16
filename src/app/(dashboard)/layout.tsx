'use client';

import { Navigation } from '@/components/layout/Navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-poker-felt-dark to-neutral-950">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
