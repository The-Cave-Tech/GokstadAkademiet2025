"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

export default function ActivitiesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to projects page by default
    router.replace("/aktiviteter/projects");
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <LoadingSpinner className="w-16 h-16" />
    </div>
  );
}
