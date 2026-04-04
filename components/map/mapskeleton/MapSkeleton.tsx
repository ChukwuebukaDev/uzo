
type MapSkeletonProps = {
    isMapLoaded: boolean;
}
export default function MapSkeleton({ isMapLoaded }: MapSkeletonProps) {

    return(
        <>
          {!isMapLoaded && (
      <div className="absolute inset-0 z-50 overflow-hidden bg-gray-100">
        
        {/* shimmer layer */}
        <div className="absolute inset-0 animate-pulse bg-linear-to-r from-gray-100 via-gray-200 to-gray-100" />

        {/* fake map UI blocks */}
        <div className="absolute top-4 left-4 w-32 h-8 bg-gray-300 rounded-md" />
        <div className="absolute top-16 left-4 w-24 h-8 bg-gray-300 rounded-md" />

        {/* fake zoom controls */}
        <div className="absolute bottom-6 right-4 flex flex-col gap-2">
          <div className="w-10 h-10 bg-gray-300 rounded-md" />
          <div className="w-10 h-10 bg-gray-300 rounded-md" />
        </div>
      </div>
    )}

        </>
    )
}