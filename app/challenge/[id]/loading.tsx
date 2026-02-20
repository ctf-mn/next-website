import { PageLoadingShell } from "@/components/site/page-loading-shell";
import { Skeleton, TableSkeleton } from "@/components/site/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ChallengeDetailLoading() {
  return (
    <PageLoadingShell>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-2" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-2" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-2" />
              <Skeleton className="h-4 w-14" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-9/12" />
            </div>

            <div className="flex flex-col gap-3 md:flex-row">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-36" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-40" />
          </CardHeader>
          <CardContent>
            <TableSkeleton
              columns={[
                { headWidth: "w-16", cellWidth: "w-32" },
                { headWidth: "w-10", cellWidth: "w-24" },
              ]}
              rows={3}
            />
          </CardContent>
        </Card>
      </div>
    </PageLoadingShell>
  );
}
