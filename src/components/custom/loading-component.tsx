import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingComponent() {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="bg-dark-3 animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-[100px] w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-[120px]" />
            </CardContent>
          </div>
          <div className="bg-dark-3 animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-[100px] w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-[120px]" />
            </CardContent>
          </div>
          <div className="bg-dark-3 animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-[100px] w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-[120px]" />
            </CardContent>
          </div>
          <div className="bg-dark-3 animate-pulse">
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-[100px] w-24" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-[120px]" />
            </CardContent>
          </div>
        </div>
      </div>
      <div>
        <div className="py-4">
          <div className="space-y-3">
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
            <Skeleton className="h-[40px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
