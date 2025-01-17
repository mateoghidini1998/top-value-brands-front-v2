"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <Skeleton key={index} className="aspect-video" />
        ))}
      </div>
      <Skeleton className="min-h-[100vh] flex-1 md:min-h-min" />
    </div>
  );
}
