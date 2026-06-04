export default function EventCardSkeleton() {
  return (
    <div className="bg-bcc-card rounded-3xl overflow-hidden border border-white/5 shadow-lg w-full flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 w-full bg-white/5 relative">
        <div className="absolute top-4 right-4 flex gap-2">
          <div className="h-6 w-20 bg-white/10 rounded-full" />
          <div className="h-6 w-16 bg-white/10 rounded-full" />
        </div>
      </div>
      
      {/* Content Skeleton */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Title */}
        <div className="h-6 w-3/4 bg-white/5 rounded-md mb-2" />
        <div className="h-6 w-1/2 bg-white/5 rounded-md mb-4" />
        
        {/* Description */}
        <div className="space-y-2 mb-6">
          <div className="h-3 w-full bg-white/5 rounded-md" />
          <div className="h-3 w-full bg-white/5 rounded-md" />
          <div className="h-3 w-4/5 bg-white/5 rounded-md" />
        </div>
        
        {/* Date and Location */}
        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-white/10 rounded-full" />
            <div className="h-3 w-32 bg-white/5 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-white/10 rounded-full" />
            <div className="h-3 w-40 bg-white/5 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
