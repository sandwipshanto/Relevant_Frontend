import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, RefreshCw, X, Info, Clock, Zap, Grid, List } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { RelevanceFilter } from '../components/ui/RelevanceFilter';
import { LoadingSpinner } from '../components/ui/Loading';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FlexibleContentCard } from '../components/FlexibleContentCard';
import type { ContentWithUserData, FeedQueryParams, RelevanceFilter as RelevanceFilterType, RelevanceStats } from '../types';

export const FeedPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [feedParams, setFeedParams] = useState<FeedQueryParams>({
        page: 1,
        limit: 12,
        minRelevance: 0.3
    });
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [allContent, setAllContent] = useState<ContentWithUserData[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [relevanceStats, setRelevanceStats] = useState<RelevanceStats | undefined>();

    const queryClient = useQueryClient();

    // Feed query with infinite scrolling support
    const {
        data: feedData,
        isLoading: feedLoading,
        error: feedError,
        refetch: refetchFeed
    } = useQuery({
        queryKey: ['contentFeed', feedParams],
        queryFn: () => apiService.getContentFeed(feedParams),
        enabled: !isSearchMode,
        staleTime: 30000
    });

    // Search query
    const {
        data: searchData,
        isLoading: searchLoading,
        refetch: refetchSearch
    } = useQuery({
        queryKey: ['searchContent', searchQuery, feedParams.page],
        queryFn: () => apiService.searchContent(searchQuery, feedParams.page || 1, feedParams.limit || 12),
        enabled: isSearchMode && searchQuery.length > 0,
        staleTime: 30000
    });

    // Relevance filtering query
    const {
        data: relevanceData,
        isLoading: relevanceLoading,
        refetch: refetchRelevance
    } = useQuery({
        queryKey: ['contentByRelevance', feedParams],
        queryFn: () => apiService.getContentByRelevance({
            minRelevance: feedParams.minRelevance || 0,
            maxRelevance: 1.0,
            page: feedParams.page || 1,
            limit: feedParams.limit || 12,
            sortBy: 'relevance'
        }),
        enabled: false, // Only fetch when explicitly called
        staleTime: 30000
    });

    // Infinite scroll logic
    useEffect(() => {
        const currentData = isSearchMode ? searchData : feedData;
        const currentPage = feedParams.page || 1;

        if (currentData && currentPage === 1) {
            const content = isSearchMode ? (currentData as any)?.results || [] : (currentData as any)?.content || [];
            setAllContent(content);
        } else if (currentData && currentPage > 1) {
            const newContent = isSearchMode ? (currentData as any)?.results || [] : (currentData as any)?.content || [];
            setAllContent(prev => [...prev, ...newContent]);
            setIsLoadingMore(false);
        }
    }, [feedData, searchData, feedParams.page, isSearchMode]);

    // Infinite scroll event handler
    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop < document.documentElement.offsetHeight - 1000) {
            return;
        }

        const currentData = isSearchMode ? searchData : feedData;
        const hasMore = (currentData as any)?.pagination?.hasMore;

        if (hasMore && !isLoadingMore && !feedLoading && !searchLoading) {
            setIsLoadingMore(true);
            setFeedParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
        }
    }, [feedData, searchData, isLoadingMore, feedLoading, searchLoading, isSearchMode]);

    // Attach scroll listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Content interactions
    const likeMutation = useMutation({
        mutationFn: ({ contentId, liked }: { contentId: string; liked: boolean }) =>
            apiService.toggleContentLike(contentId, liked),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contentFeed'] });
            queryClient.invalidateQueries({ queryKey: ['searchContent'] });
        }
    });

    const saveMutation = useMutation({
        mutationFn: ({ contentId, saved }: { contentId: string; saved: boolean }) =>
            apiService.toggleContentSave(contentId, saved),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contentFeed'] });
            queryClient.invalidateQueries({ queryKey: ['searchContent'] });
            queryClient.invalidateQueries({ queryKey: ['savedContent'] });
        }
    });

    const dismissMutation = useMutation({
        mutationFn: (contentId: string) => apiService.dismissContent(contentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contentFeed'] });
            toast.success('Content dismissed');
        }
    });

    const viewMutation = useMutation({
        mutationFn: (contentId: string) => apiService.markContentAsViewed(contentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contentFeed'] });
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsSearchMode(true);
            setFeedParams(prev => ({ ...prev, page: 1 }));
            setAllContent([]);
            refetchSearch();
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearchMode(false);
        setFeedParams(prev => ({ ...prev, page: 1 }));
        setAllContent([]);
    };

    const handleContentClick = (content: ContentWithUserData) => {
        if (!content.userContent?.viewed) {
            viewMutation.mutate(content._id);
        }
        window.open(content.url, '_blank');
    };

    const handleRelevanceFilter = (filters: RelevanceFilterType) => {
        setFeedParams(prev => ({
            ...prev,
            page: 1,
            minRelevance: filters.minRelevance,
            maxRelevance: filters.maxRelevance
        }));
        setAllContent([]);

        // Trigger the relevance query
        refetchRelevance().then((result) => {
            if (result.data?.stats) {
                setRelevanceStats(result.data.stats);
            }
        });
    };

    const currentData = isSearchMode ? searchData : feedData;
    const currentLoading = isSearchMode ? searchLoading : feedLoading;

    // Use accumulated content for infinite scroll
    const displayContent = allContent;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center mb-6 gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-bold text-gray-900">
                                {isSearchMode ? `Search Results` : 'Your Feed'}
                            </h1>
                            {isSearchMode && (
                                <span className="text-sm text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                                    "{searchQuery}"
                                </span>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            <div className="hidden sm:flex bg-white rounded-lg p-1 shadow-sm border">
                                <Button
                                    onClick={() => setViewMode('grid')}
                                    variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="px-3"
                                >
                                    <Grid className="h-4 w-4" />
                                </Button>
                                <Button
                                    onClick={() => setViewMode('list')}
                                    variant={viewMode === 'list' ? 'primary' : 'ghost'}
                                    size="sm"
                                    className="px-3"
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>

                            <Button
                                onClick={() => {
                                    setFeedParams(prev => ({ ...prev, page: 1 }));
                                    setAllContent([]);
                                    isSearchMode ? refetchSearch() : refetchFeed();
                                }}
                                disabled={currentLoading}
                                variant="secondary"
                                size="sm"
                                className="bg-white shadow-sm border"
                            >
                                <RefreshCw className={`h-4 w-4 mr-2 ${currentLoading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* Smart Processing Info Banner */}
                    {!isSearchMode && (
                        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    <Zap className="h-5 w-5 text-emerald-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-emerald-900 text-sm mb-1">
                                        ✨ Smart Daily Processing Active
                                    </h3>
                                    <p className="text-emerald-800 text-sm leading-relaxed">
                                        Your content is automatically processed daily at 6 AM UTC with intelligent anti-duplicate protection.
                                        Only new content is analyzed, reducing costs by 85-95% while maintaining quality.
                                    </p>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-emerald-700">
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            <span>Daily at 6 AM UTC</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Info className="h-3 w-3" />
                                            <span>No duplicate analysis</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Bar */}
                    <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <Input
                                    type="text"
                                    placeholder="Search for videos, channels, topics..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-0 bg-gray-50 focus:bg-white transition-colors"
                                />
                            </div>
                            <Button type="submit" disabled={!searchQuery.trim() || currentLoading} className="px-6">
                                Search
                            </Button>
                            {isSearchMode && (
                                <Button type="button" onClick={clearSearch} variant="secondary" className="px-4">
                                    <X className="h-4 w-4 mr-2" />
                                    Clear
                                </Button>
                            )}
                        </form>

                        {/* Advanced Relevance Filter */}
                        <div className="mt-4 pt-4 border-t">
                            <RelevanceFilter
                                onFilterChange={handleRelevanceFilter}
                                stats={relevanceStats}
                                isLoading={relevanceLoading}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                {currentLoading && (feedParams.page || 1) === 1 ? (
                    <LoadingSkeleton count={12} viewMode={viewMode} />
                ) : feedError ? (
                    <div className="text-center py-24">
                        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md mx-auto">
                            <p className="text-red-600 mb-4 text-lg font-medium">Failed to load content</p>
                            <p className="text-gray-500 mb-6">Something went wrong while fetching your feed.</p>
                            <Button onClick={() => refetchFeed()} variant="secondary">
                                Try Again
                            </Button>
                        </div>
                    </div>
                ) : displayContent.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="bg-white rounded-xl shadow-sm border p-8 max-w-md mx-auto">
                            <p className="text-gray-600 mb-4 text-lg font-medium">
                                {isSearchMode ? 'No search results found' : 'No content available'}
                            </p>
                            <p className="text-sm text-gray-500 mb-6">
                                {isSearchMode
                                    ? 'Try searching for different terms or adjust your filters'
                                    : 'Try adjusting your interests or adding YouTube channels in your profile'
                                }
                            </p>
                            {!isSearchMode && (
                                <Button onClick={() => window.location.href = '/profile'} variant="secondary">
                                    Update Interests
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className={`${viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'space-y-4'
                        }`}>
                        {displayContent.map((item: ContentWithUserData, index: number) => {
                            const safeKey = item._id || (item as any).id || `item-${index}`;

                            return (
                                <ErrorBoundary key={safeKey} fallback={
                                    <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                                        <p className="text-yellow-800 text-sm">Failed to render content item #{index}</p>
                                    </div>
                                }>
                                    <FlexibleContentCard
                                        content={item}
                                        onLike={(contentId, liked) => likeMutation.mutate({ contentId, liked })}
                                        onSave={(contentId, saved) => saveMutation.mutate({ contentId, saved })}
                                        onDismiss={(contentId) => dismissMutation.mutate(contentId)}
                                        onView={handleContentClick}
                                        showDismiss={true}
                                    />
                                </ErrorBoundary>
                            );
                        })}
                    </div>
                )}

                {/* Infinite Scroll Loading Indicator */}
                {isLoadingMore && (
                    <div className="flex justify-center py-8">
                        <div className="flex items-center gap-3 text-gray-500">
                            <LoadingSpinner size="sm" />
                            <span>Loading more content...</span>
                        </div>
                    </div>
                )}

                {/* End of content message */}
                {displayContent.length > 0 && !(currentData as any)?.pagination?.hasMore && (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-xl shadow-sm border p-6 max-w-md mx-auto">
                            <p className="text-gray-500">🎉 You've reached the end!</p>
                            <p className="text-sm text-gray-400 mt-2">Check back later for more content</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
