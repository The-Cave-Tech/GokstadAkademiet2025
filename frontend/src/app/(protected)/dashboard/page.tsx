// dashboard/page.tsx
import { Suspense } from "react";
import DashboardProfile from "@/components/features/dashboard/dashboardProfile";
import DashboardMenu from "@/components/features/dashboard/dashboardMenu";

export default function DashboardPage() {
  return (
    <div className="w-full">
      <Suspense
        fallback={<div className="text-center p-8">Loading profile...</div>}
      >
        <DashboardProfile />
      </Suspense>
      <DashboardMenu />
    </div>
  );
}
