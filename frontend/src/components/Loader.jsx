import { Loader2 } from "lucide-react";

export function Spinner({ size = 20, className = "" }) {
  return <Loader2 size={size} className={`animate-spin text-accent-indigo ${className}`} />;
}

export function PageLoader({ label = "Loading Civi-X…" }) {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 py-24">
      <Spinner size={28} />
      <p className="text-sm text-white/40">{label}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card-base overflow-hidden p-5">
      <div className="space-y-3">
        <div className="h-4 w-1/3 animate-pulse rounded bg-white/[0.06]" />
        <div className="h-3 w-full animate-pulse rounded bg-white/[0.05]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-white/[0.05]" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.05]" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-white/[0.05]" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="card-base p-5">
      <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.06]" />
      <div className="mt-3 h-8 w-2/3 animate-pulse rounded bg-white/[0.08]" />
    </div>
  );
}
