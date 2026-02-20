import { PageLoadingShell } from "@/components/site/page-loading-shell";

export default function AuthorProfileLoading() {
  return (
    <PageLoadingShell>
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="mb-4 h-6 w-56 rounded skeleton" />
        <div className="space-y-3">
          <div className="h-8 rounded skeleton" />
          <div className="h-8 rounded skeleton" />
          <div className="h-8 rounded skeleton" />
          <div className="h-8 rounded skeleton" />
          <div className="h-8 rounded skeleton" />
        </div>
      </div>
    </PageLoadingShell>
  );
}
