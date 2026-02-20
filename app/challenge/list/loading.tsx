import { PageLoadingShell } from "@/components/site/page-loading-shell";
import { Skeleton, TableSkeleton } from "@/components/site/page-skeletons";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ChallengeListLoading() {
  return (
    <PageLoadingShell>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-36" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <div>
                <Skeleton className="mb-2 h-4 w-16" />
                <Skeleton className="h-10" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-12" />
                <Skeleton className="h-10" />
              </div>
              <div>
                <Skeleton className="mb-2 h-4 w-12" />
                <Skeleton className="h-10" />
              </div>
            </div>
            <Skeleton className="mt-3 h-4 w-32" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <TableSkeleton
              columns={[
                { headWidth: "w-3", headClassName: "w-16", cellWidth: "w-4" },
                { headWidth: "w-16", cellWidth: "w-40" },
                { headWidth: "w-14", cellWidth: "w-20" },
                { headWidth: "w-12", cellWidth: "w-24" },
                { headWidth: "w-12", headClassName: "text-right", cellWidth: "w-8", cellClassName: "text-right" },
                { headWidth: "w-10", headClassName: "text-right", cellWidth: "w-10", cellClassName: "text-right" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </PageLoadingShell>
  );
}
