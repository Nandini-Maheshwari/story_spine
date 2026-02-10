export default function BookLoading() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-pulse">
      <div className="flex gap-8">
        <div className="w-[180px] h-[270px] bg-gray-100 rounded-md shrink-0" />
        <div className="flex flex-col justify-center gap-3 flex-1">
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-5 bg-gray-100 rounded w-1/2" />
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-gray-100 rounded-full" />
            <div className="h-6 w-20 bg-gray-100 rounded-full" />
            <div className="h-6 w-14 bg-gray-100 rounded-full" />
          </div>
        </div>
      </div>

      <div className="h-12 bg-gray-50 rounded mt-8 border border-border" />

      <div className="mt-8 space-y-2">
        <div className="h-5 bg-gray-100 rounded w-24" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
      </div>

      <div className="mt-8 space-y-4">
        <div className="h-5 bg-gray-100 rounded w-20" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-full" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
      </div>
    </div>
  );
}
