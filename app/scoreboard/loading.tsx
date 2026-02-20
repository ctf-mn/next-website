import { PageLoadingShell } from "@/components/site/page-loading-shell";

export default function ScoreboardLoading() {
  return (
    <PageLoadingShell>
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 h-6 w-36 rounded skeleton" />
        <div className="space-y-3">
          <div className="h-8 rounded skeleton" />
          <div className="h-8 rounded skeleton" />
          <div className="h-8 rounded skeleton" />
          <div className="h-8 rounded skeleton" />
          <div className="h-8 rounded skeleton" />
          <div className="h-8 rounded skeleton" />
        </div>
        <div className="mt-4 flex gap-2">
          <div className="h-6 w-8 rounded skeleton" />
          <div className="h-6 w-8 rounded skeleton" />
          <div className="h-6 w-8 rounded skeleton" />
        </div>
      </div>
    </PageLoadingShell>
  );
}
