import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto py-10">
      <Skeleton className="w-[250px] h-[36px] mb-8" />
      <Skeleton className="w-[150px] h-[40px] mb-6" />
      <div className="space-y-4">
        <Skeleton className="w-full h-[40px]" />
        <Skeleton className="w-full h-[400px]" />
      </div>
    </div>
  );
}
