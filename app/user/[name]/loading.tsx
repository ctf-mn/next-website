import { PageLoadingShell } from "@/components/site/page-loading-shell";

export default function UserProfileLoading() {
  return (
    <PageLoadingShell>
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="h-6 w-52 animate-pulse rounded bg-muted" />
          <div className="h-6 w-44 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-3">
          <div className="h-8 animate-pulse rounded bg-muted" />
          <div className="h-8 animate-pulse rounded bg-muted" />
          <div className="h-8 animate-pulse rounded bg-muted" />
          <div className="h-8 animate-pulse rounded bg-muted" />
          <div className="h-8 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </PageLoadingShell>
  );
}
