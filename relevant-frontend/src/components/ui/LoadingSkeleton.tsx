import React from 'react';

interface LoadingSkeletonProps {
    count?: number;
    viewMode?: 'grid' | 'list';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    count = 8,
    viewMode = 'grid'
}) => {
    return (
        <div className={`${viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
            }`}>
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    {/* Thumbnail Skeleton */}
                    <div className="aspect-video bg-gray-200"></div>

                    {/* Content Skeleton */}
                    <div className="p-4">
                        {/* Title */}
                        <div className="h-5 bg-gray-200 rounded-md mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded-md mb-3 w-3/4"></div>

                        {/* Channel & Meta */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="h-4 w-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 mb-4">
                            <div className="h-3 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>

                        {/* Tags */}
                        <div className="flex gap-2 mb-4">
                            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                            <div className="h-6 bg-gray-200 rounded-full w-12"></div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                            <div className="flex gap-2">
                                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                            </div>
                            <div className="h-8 w-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default LoadingSkeleton;
