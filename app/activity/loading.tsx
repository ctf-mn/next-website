import { PageLoadingShell } from "@/components/site/page-loading-shell";
import { Skeleton, TableSkeleton } from "@/components/site/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ActivityLoading() {
  return (
    <PageLoadingShell>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <TableSkeleton
            columns={[
              { headWidth: "w-10", headClassName: "w-44", cellWidth: "w-28" },
              { headWidth: "w-10", headClassName: "w-40", cellWidth: "w-20" },
              { headWidth: "w-16", cellWidth: "w-40" },
              { headWidth: "w-12", headClassName: "text-center", cellWidth: "w-16", cellClassName: "text-center" },
            ]}
          />
        </CardContent>
      </Card>
    </PageLoadingShell>
  );
}
