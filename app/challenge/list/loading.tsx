import { PageLoadingShell } from "@/components/site/page-loading-shell";

export default function ChallengeListLoading() {
  return (
    <PageLoadingShell>
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 h-6 w-36 animate-pulse rounded bg-muted" />
          <div className="grid gap-3 md:grid-cols-3">
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 animate-pulse rounded bg-muted" />
            <div className="h-10 w-36 animate-pulse rounded bg-muted md:col-span-3" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="space-y-3">
            <div className="h-8 animate-pulse rounded bg-muted" />
            <div className="h-8 animate-pulse rounded bg-muted" />
            <div className="h-8 animate-pulse rounded bg-muted" />
            <div className="h-8 animate-pulse rounded bg-muted" />
            <div className="h-8 animate-pulse rounded bg-muted" />
            <div className="h-8 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}
