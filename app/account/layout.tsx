"use client";

import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

export default function CustomerAccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <DashboardSidebar role="CUSTOMER" />
      <main className="lg:ml-64">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
