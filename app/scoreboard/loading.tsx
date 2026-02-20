import { PageLoadingShell } from "@/components/site/page-loading-shell";
import { Skeleton, TableSkeleton } from "@/components/site/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ScoreboardLoading() {
  return (
    <PageLoadingShell>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-36" />
        </CardHeader>
        <CardContent className="space-y-4">
          <TableSkeleton
            columns={[
              { headWidth: "w-3", headClassName: "w-16", cellWidth: "w-4" },
              { headWidth: "w-10", cellWidth: "w-24" },
              { headWidth: "w-12", headClassName: "text-right", cellWidth: "w-6", cellClassName: "text-right" },
              { headWidth: "w-10", headClassName: "text-right", cellWidth: "w-10", cellClassName: "text-right" },
            ]}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-6 w-8" />
            <Skeleton className="h-6 w-8" />
          </div>
        </CardContent>
      </Card>
    </PageLoadingShell>
  );
}
