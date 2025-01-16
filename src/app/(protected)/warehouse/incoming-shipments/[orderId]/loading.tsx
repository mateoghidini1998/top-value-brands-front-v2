import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-[120px]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-[120px]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                <Skeleton className="h-4 w-[100px]" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-6 w-[120px]" />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="rounded-md border">
        <div className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
