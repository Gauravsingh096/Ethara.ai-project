export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-3">
      <div className="h-4 skeleton rounded w-3/4" />
      <div className="h-3 skeleton rounded w-1/2" />
      <div className="h-3 skeleton rounded w-full" />
      <div className="flex gap-2 pt-1">
        <div className="h-6 skeleton rounded-full w-16" />
        <div className="h-6 skeleton rounded-full w-20" />
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="w-8 h-8 skeleton rounded-full" />
      <div className="flex-1 space-y-1">
        <div className="h-3 skeleton rounded w-1/3" />
        <div className="h-3 skeleton rounded w-1/4" />
      </div>
      <div className="h-6 skeleton rounded w-16" />
    </div>
  );
}

export function SkeletonStat() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-2">
      <div className="h-3 skeleton rounded w-1/2" />
      <div className="h-8 skeleton rounded w-1/3" />
    </div>
  );
}
