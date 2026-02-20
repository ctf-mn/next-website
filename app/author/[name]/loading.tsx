import { PageLoadingShell } from "@/components/site/page-loading-shell";
import { Skeleton, TableSkeleton } from "@/components/site/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AuthorProfileLoading() {
  return (
    <PageLoadingShell>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-56" />
        </CardHeader>
        <CardContent>
          <TableSkeleton
            columns={[
              { headWidth: "w-16", cellWidth: "w-32" },
              { headWidth: "w-14", cellWidth: "w-20" },
              { headWidth: "w-10", cellWidth: "w-24" },
              { headWidth: "w-12", headClassName: "text-right", cellWidth: "w-8", cellClassName: "text-right" },
              { headWidth: "w-10", headClassName: "text-right", cellWidth: "w-10", cellClassName: "text-right" },
            ]}
            rows={5}
          />
        </CardContent>
      </Card>
    </PageLoadingShell>
  );
}
