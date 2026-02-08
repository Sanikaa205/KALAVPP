"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CustomerCommissionsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin h-8 w-8 border-4 border-stone-200 border-t-stone-900 rounded-full" />
    </div>
  );
}
