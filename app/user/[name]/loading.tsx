import { PageLoadingShell } from "@/components/site/page-loading-shell";
import { Skeleton, TableSkeleton } from "@/components/site/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function UserProfileLoading() {
  return (
    <PageLoadingShell>
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-6 w-44" />
          </div>
        </CardHeader>
        <CardContent>
          <TableSkeleton
            columns={[
              { headWidth: "w-10", headClassName: "w-44", cellWidth: "w-28" },
              { headWidth: "w-16", cellWidth: "w-40" },
              { headWidth: "w-10", headClassName: "text-right", cellWidth: "w-8", cellClassName: "text-right" },
              { headWidth: "w-12", headClassName: "text-center", cellWidth: "w-16", cellClassName: "text-center" },
            ]}
            rows={5}
          />
        </CardContent>
      </Card>
    </PageLoadingShell>
  );
}
