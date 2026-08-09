import { Inbox, AlertTriangle, SearchX } from "lucide-react";

export function EmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description = "Once data comes in, it'll show up here.",
  action = null,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04]">
        <Icon size={24} className="text-white/40" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-white/40">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function NoResultsState({ onReset }) {
  return (
    <EmptyState
      icon={SearchX}
      title="No matching complaints"
      description="Try adjusting your search term or filters to find what you're looking for."
      action={
        onReset && (
          <button onClick={onReset} className="btn-secondary">
            Clear filters
          </button>
        )
      }
    />
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this data. Please check your connection and try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-severity-critical/20 bg-severity-critical/[0.04] px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-severity-critical/10">
        <AlertTriangle size={24} className="text-severity-critical" />
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-white/40">{description}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-5">
          Try again
        </button>
      )}
    </div>
  );
}
