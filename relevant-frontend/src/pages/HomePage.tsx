import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, TrendingUp, Clock, Zap, Grid, List } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/Loading';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FlexibleContentCard } from '../components/FlexibleContentCard';
import { VideoPlayer } from '../components/ui/VideoPlayer';
import type { ContentWithUserData, FeedQueryParams } from '../types';

export const HomePage: React.FC = () => {
    const [feedParams, setFeedParams] = useState<FeedQueryParams>({
        page: 1,
        limit: 12,
        minRelevance: 0.4
    });
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [allContent, setAllContent] = useState<ContentWithUserData[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState<ContentWithUserData | null>(null);
    const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false);

    const queryClient = useQueryClient();

    // Personalized feed query
    const {
        data: feedData,
        isLoading: isFeedLoading,
        error: feedError,
        refetch: refetchFeed
    } = useQuery({
        queryKey: ['personalizedFeed', feedParams],
        queryFn: () => apiService.getContentFeed(feedParams),
        enabled: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });

    // Save content mutation
    const saveContentMutation = useMutation({
        mutationFn: (contentId: string) => apiService.toggleContentSave(contentId, true),
        onSuccess: () => {
            toast.success('Content saved successfully!');
            queryClient.invalidateQueries({ queryKey: ['personalizedFeed'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to save content');
        }
    });

    // View content mutation
    const viewContentMutation = useMutation({
        mutationFn: (contentId: string) => apiService.markContentAsViewed(contentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['personalizedFeed'] });
        },
        onError: (error: any) => {
            console.error('Failed to mark content as viewed:', error);
        }
    });

    // Update content when feedData changes
    useEffect(() => {
        if (feedData?.content) {
            if (feedParams.page === 1) {
                setAllContent(feedData.content);
            } else {
                setAllContent(prev => [...prev, ...feedData.content]);
            }
        }
    }, [feedData, feedParams.page]);

    const handleLoadMore = async () => {
        if (feedData?.pagination?.hasMore && !isLoadingMore) {
            setIsLoadingMore(true);
            setFeedParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
            setTimeout(() => setIsLoadingMore(false), 1000);
        }
    };

    const handleRefresh = () => {
        setAllContent([]);
        setFeedParams(prev => ({ ...prev, page: 1 }));
        refetchFeed();
    };

    const handleSaveContent = (contentId: string) => {
        saveContentMutation.mutate(contentId);
    };

    const handleContentClick = (content: ContentWithUserData) => {
        // Mark as viewed if not already viewed
        if (!content.userContent?.viewed) {
            viewContentMutation.mutate(content._id);
        }

        // For video content, show in modal player
        if (content.source === 'youtube' || content.url.includes('youtube.com') || content.url.includes('youtu.be')) {
            setSelectedVideo(content);
            setIsVideoPlayerOpen(true);
        } else {
            // For non-video content, open in new tab
            if (content.url && content.url !== '#') {
                window.open(content.url, '_blank');
            } else {
                toast.error('No URL available');
            }
        }
    };

    const closeVideoPlayer = () => {
        setIsVideoPlayerOpen(false);
        setSelectedVideo(null);
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-16 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-white" />
                                    </div>
                                    Your Feed
                                </h1>
                                <p className="text-slate-600 mt-2">
                                    AI-curated content tailored to your interests
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* View Mode Toggle */}
                                <div className="flex bg-slate-100 rounded-lg p-1">
                                    <Button
                                        variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('grid')}
                                        className="px-3 py-2"
                                    >
                                        <Grid size={16} />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                        size="sm"
                                        onClick={() => setViewMode('list')}
                                        className="px-3 py-2"
                                    >
                                        <List size={16} />
                                    </Button>
                                </div>

                                {/* Refresh Button */}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleRefresh}
                                    disabled={isFeedLoading}
                                    className="flex items-center gap-2"
                                >
                                    <RefreshCw size={16} className={isFeedLoading ? 'animate-spin' : ''} />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        {feedData && (
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <Zap className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-slate-900">{feedData.pagination?.totalItems || 0}</div>
                                            <div className="text-sm text-slate-600">Total Items</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-slate-900">{Math.round((feedParams.minRelevance || 0) * 100)}%</div>
                                            <div className="text-sm text-slate-600">Relevance Filter</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-orange-600" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-slate-900">Live</div>
                                            <div className="text-sm text-slate-600">Updated</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {isFeedLoading && feedParams.page === 1 ? (
                        <LoadingSkeleton count={6} viewMode="grid" />
                    ) : feedError ? (
                        <div className="text-center py-12">
                            <div className="text-slate-500 mb-4">Failed to load your feed</div>
                            <Button onClick={handleRefresh} variant="secondary">
                                Try Again
                            </Button>
                        </div>
                    ) : allContent.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">No content yet</h3>
                            <p className="text-slate-500 mb-6">
                                Connect your accounts and set your interests to get personalized content
                            </p>
                            <Button variant="primary">
                                Set Up Your Feed
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Content Grid/List */}
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                            }>
                                {allContent.map((item) => (
                                    <FlexibleContentCard
                                        key={item._id}
                                        content={item}
                                        onSave={(contentId: string, saved: boolean) => {
                                            if (saved) handleSaveContent(contentId);
                                        }}
                                        onLike={() => { }}
                                        onDismiss={() => { }}
                                        onView={handleContentClick}
                                        showDismiss={false}
                                    />
                                ))}
                            </div>

                            {/* Load More */}
                            {feedData?.pagination?.hasMore && (
                                <div className="text-center mt-12">
                                    <Button
                                        onClick={handleLoadMore}
                                        disabled={isLoadingMore}
                                        variant="secondary"
                                        size="lg"
                                        className="px-8"
                                    >
                                        {isLoadingMore ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span className="ml-2">Loading...</span>
                                            </>
                                        ) : (
                                            'Load More Content'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Video Player Modal */}
                {selectedVideo && (
                    <VideoPlayer
                        content={selectedVideo}
                        isOpen={isVideoPlayerOpen}
                        onClose={closeVideoPlayer}
                    />
                )}
            </div>
        </ErrorBoundary>
    );
};
