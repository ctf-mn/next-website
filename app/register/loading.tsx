export default function RegisterLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted px-4 py-8">
      <div className="w-full max-w-md rounded-lg border bg-card p-6">
        <div className="mb-6 h-7 w-28 rounded skeleton" />
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 w-24 rounded skeleton" />
            <div className="h-10 rounded skeleton" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-16 rounded skeleton" />
            <div className="h-10 rounded skeleton" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 rounded skeleton" />
            <div className="h-10 rounded skeleton" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded skeleton" />
            <div className="h-10 rounded skeleton" />
          </div>
          <div className="h-10 rounded skeleton" />
          <div className="h-4 w-44 rounded skeleton" />
        </div>
      </div>
    </div>
  );
}
