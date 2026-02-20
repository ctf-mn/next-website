import { PageLoadingShell } from "@/components/site/page-loading-shell";

export default function UserProfileLoading() {
  return (
    <PageLoadingShell>
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="h-6 w-52 rounded skeleton" />
          <div className="h-6 w-44 rounded skeleton" />
        </div>
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
