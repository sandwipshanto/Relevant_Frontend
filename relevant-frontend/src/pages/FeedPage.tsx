import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, RefreshCw, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Loading';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FlexibleContentCard } from '../components/FlexibleContentCard';
import type { ContentWithUserData, FeedQueryParams } from '../types';

export const FeedPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [feedParams, setFeedParams] = useState<FeedQueryParams>({
        page: 1,
        limit: 10,
        minRelevance: 0.3
    });
    const [isSearchMode, setIsSearchMode] = useState(false);

    const queryClient = useQueryClient();

    // Feed query
    const {
        data: feedData,
        isLoading: feedLoading,
        error: feedError,
        refetch: refetchFeed
    } = useQuery({
        queryKey: ['contentFeed', feedParams],
        queryFn: () => apiService.getContentFeed(feedParams),
        enabled: !isSearchMode
    });

    // Search query
    const {
        data: searchData,
        isLoading: searchLoading,
        refetch: refetchSearch
    } = useQuery({
        queryKey: ['searchContent', searchQuery, feedParams.page],
        queryFn: () => apiService.searchContent(searchQuery, feedParams.page, feedParams.limit),
        enabled: isSearchMode && searchQuery.length > 0
    });

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
            refetchSearch();
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setIsSearchMode(false);
        setFeedParams(prev => ({ ...prev, page: 1 }));
    }; const handleContentClick = (content: ContentWithUserData) => {
        if (!content.userContent?.viewed) {
            viewMutation.mutate(content._id);
        }
        window.open(content.url, '_blank');
    };

    const handleLoadMore = () => {
        setFeedParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
    }; const currentData = isSearchMode ? searchData : feedData;
    const currentLoading = isSearchMode ? searchLoading : feedLoading;

    // Safely extract content array with proper validation
    let content: ContentWithUserData[] = [];
    try {
        if (isSearchMode) {
            content = (currentData as any)?.results || [];
        } else {
            content = (currentData as any)?.content || [];
        }        // Debug logging (reduced verbosity)
        if (process.env.NODE_ENV === 'development') {
            console.log('Feed loading:', {
                contentCount: content.length,
                searchMode: isSearchMode,
                params: feedParams
            });
        }        // Ensure we have an array and validate content structure
        if (!Array.isArray(content)) {
            console.error('Content is not an array:', content);
            content = [];
        }

        // Filter out any invalid items that might cause rendering issues
        const skipFiltering = false;

        if (!skipFiltering) {
            content = content.filter(item => {
                // Only filter out completely broken items that would crash the UI
                // Must be an object (not null, undefined, string, etc.)
                if (!item || typeof item !== 'object') {
                    console.warn('Filtering out non-object item:', item);
                    return false;
                }

                // Must have SOME kind of identifier (very flexible)
                const hasAnyId = !!(
                    item._id ||
                    (item as any).id ||
                    (item as any).contentId ||
                    (item as any).videoId ||
                    (item as any).guid ||
                    (item as any).uuid
                );

                // Must have SOME kind of displayable text (very flexible)
                const hasAnyText = !!(
                    item.title ||
                    (item as any).name ||
                    item.description ||
                    (item as any).summary ||
                    (item as any).content
                );

                // Only filter out if it has NO id AND NO text (completely broken)
                if (!hasAnyId && !hasAnyText) {
                    console.warn('Filtering out item with no ID or displayable text:', {
                        item,
                        hasAnyId,
                        hasAnyText,
                        keys: Object.keys(item)
                    });
                    return false;
                }

                // Keep everything else - let FlexibleContentCard handle the transformation
                return true;
            });
        }

        // Log final content count for debugging
        if (process.env.NODE_ENV === 'development' && content.length === 0) {
            console.warn('No content after filtering - check API response or filtering logic');
        }
    } catch (error) {
        console.error('Error processing content data:', error);
        content = [];
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isSearchMode ? `Search Results for "${searchQuery}"` : 'Content Feed'}
                    </h1>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => {
                                isSearchMode ? refetchSearch() : refetchFeed();
                            }}
                            disabled={currentLoading}
                            variant="secondary"
                            size="sm"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${currentLoading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                            type="text"
                            placeholder="Search content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit" disabled={!searchQuery.trim() || currentLoading}>
                        Search
                    </Button>
                    {isSearchMode && (
                        <Button type="button" onClick={clearSearch} variant="secondary">
                            <X className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    )}
                </form>

                {/* Filters */}
                <div className="flex gap-4 items-center text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <label>Min Relevance:</label>
                        <select
                            value={feedParams.minRelevance}
                            onChange={(e) => setFeedParams(prev => ({ ...prev, minRelevance: parseFloat(e.target.value), page: 1 }))}
                            className="border rounded px-2 py-1"
                        >
                            <option value={0}>Any</option>
                            <option value={0.3}>30%</option>
                            <option value={0.5}>50%</option>
                            <option value={0.7}>70%</option>
                            <option value={0.9}>90%</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {currentLoading && feedParams.page === 1 ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : feedError ? (
                <div className="text-center py-12">
                    <p className="text-red-600 mb-4">Failed to load content</p>
                    <Button onClick={() => refetchFeed()} variant="secondary">
                        Try Again
                    </Button>
                </div>
            ) : content.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">
                        {isSearchMode ? 'No search results found' : 'No content available'}
                    </p>
                    <p className="text-sm text-gray-500">
                        {isSearchMode
                            ? 'Try searching for different terms'
                            : 'Try adjusting your interests or adding YouTube channels in your profile'
                        }
                    </p>
                </div>
            ) : (<div className="space-y-6">
                {content.map((item: ContentWithUserData, index: number) => {
                    // Create a safe key for rendering
                    const safeKey = item._id || (item as any).id || `item-${index}`;

                    return (
                        <ErrorBoundary key={safeKey} fallback={
                            <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                                <p className="text-yellow-800 text-sm">Failed to render content item #{index}</p>
                                {process.env.NODE_ENV === 'development' && (
                                    <details className="mt-2">
                                        <summary className="cursor-pointer text-xs">Show raw data</summary>
                                        <pre className="text-xs mt-1 bg-white p-2 rounded overflow-auto max-h-32">
                                            {JSON.stringify(item, null, 2)}
                                        </pre>
                                    </details>
                                )}
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

                {/* Load More */}
                {(currentData as any)?.pagination?.hasMore && (
                    <div className="text-center py-6">                            <Button
                        onClick={handleLoadMore}
                        disabled={currentLoading}
                        variant="secondary"
                    >
                        {currentLoading ? (
                            <>
                                <LoadingSpinner size="sm" />
                                <span className="ml-2">Loading...</span>
                            </>
                        ) : (
                            'Load More'
                        )}
                    </Button>
                    </div>
                )}
            </div>
            )}
        </div>
    );
};
