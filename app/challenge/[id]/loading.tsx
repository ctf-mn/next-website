import { PageLoadingShell } from "@/components/site/page-loading-shell";

export default function ChallengeDetailLoading() {
  return (
    <PageLoadingShell>
      <div className="space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="h-7 w-64 animate-pulse rounded bg-muted" />
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="mb-6 h-4 w-80 animate-pulse rounded bg-muted" />

          <div className="space-y-2">
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 animate-pulse rounded bg-muted" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
            <div className="h-4 w-9/12 animate-pulse rounded bg-muted" />
          </div>

          <div className="mt-6 flex flex-col gap-3 md:flex-row">
            <div className="h-10 flex-1 animate-pulse rounded bg-muted" />
            <div className="h-10 w-36 animate-pulse rounded bg-muted" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4 h-6 w-40 animate-pulse rounded bg-muted" />
          <div className="space-y-3">
            <div className="h-8 animate-pulse rounded bg-muted" />
            <div className="h-8 animate-pulse rounded bg-muted" />
            <div className="h-8 animate-pulse rounded bg-muted" />
          </div>
        </div>
      </div>
    </PageLoadingShell>
  );
}
