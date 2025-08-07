import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, TrendingUp, Filter, Hash, Clock, Grid, List, Flame } from 'lucide-react';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { FlexibleContentCard } from '../components/FlexibleContentCard';
import type { FeedQueryParams } from '../types';

export const DiscoverPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [feedParams, setFeedParams] = useState<FeedQueryParams>({
        page: 1,
        limit: 18,
        minRelevance: 0.2 // Lower relevance for discovery
    });

    // Categories for discovery
    const categories = [
        { id: 'all', name: 'All', icon: Grid },
        { id: 'trending', name: 'Trending', icon: TrendingUp },
        { id: 'recent', name: 'Recent', icon: Clock },
        { id: 'popular', name: 'Popular', icon: Flame },
    ];

    // Trending/Popular content query
    const {
        data: discoverData,
        isLoading: isDiscoverLoading,
        error: discoverError,
        refetch: refetchDiscover
    } = useQuery({
        queryKey: ['discover', feedParams, selectedCategory, searchQuery],
        queryFn: () => apiService.getContentFeed({
            ...feedParams,
            // Note: search functionality may need backend support
        }),
        enabled: true,
        staleTime: 2 * 60 * 1000, // 2 minutes for discovery content
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedParams(prev => ({ ...prev, page: 1 }));
        refetchDiscover();
    };

    const handleCategoryChange = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setFeedParams(prev => ({ ...prev, page: 1 }));
    };

    const handleSaveContent = (contentId: string) => {
        // This would trigger a save mutation similar to HomePage
        console.log('Save content:', contentId);
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
                {/* Header Section */}
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-16 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col gap-6">
                            {/* Title and Search */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center">
                                            <Hash className="w-5 h-5 text-white" />
                                        </div>
                                        Discover
                                    </h1>
                                    <p className="text-slate-600 mt-2">
                                        Explore trending content and discover new interests
                                    </p>
                                </div>

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
                            </div>

                            {/* Search Bar */}
                            <form onSubmit={handleSearch} className="flex gap-3">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                                    <Input
                                        type="text"
                                        placeholder="Search for content, topics, or creators..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-12 pr-4 py-3 w-full bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500"
                                    />
                                </div>
                                <Button type="submit" variant="primary" className="px-6 py-3 rounded-xl">
                                    Search
                                </Button>
                            </form>

                            {/* Category Filters */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map((category) => {
                                    const Icon = category.icon;
                                    return (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.id ? 'primary' : 'ghost'}
                                            size="sm"
                                            onClick={() => handleCategoryChange(category.id)}
                                            className="flex items-center gap-2 px-4 py-2 rounded-xl"
                                        >
                                            <Icon size={16} />
                                            {category.name}
                                        </Button>
                                    );
                                })}
                            </div>

                            {/* Results Info */}
                            {discoverData && (
                                <div className="flex items-center justify-between text-sm text-slate-600">
                                    <div>
                                        Found {discoverData.pagination?.totalItems || 0} results
                                        {searchQuery && ` for "${searchQuery}"`}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Filter size={16} />
                                        {selectedCategory !== 'all' && (
                                            <span className="bg-slate-100 px-2 py-1 rounded-lg text-xs font-medium">
                                                {categories.find(c => c.id === selectedCategory)?.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {isDiscoverLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="h-64 rounded-xl">
                                    <LoadingSkeleton />
                                </div>
                            ))}
                        </div>
                    ) : discoverError ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Hash className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">Failed to load content</h3>
                            <p className="text-slate-500 mb-6">
                                There was an error loading discovery content
                            </p>
                            <Button onClick={() => refetchDiscover()} variant="secondary">
                                Try Again
                            </Button>
                        </div>
                    ) : !discoverData?.content?.length ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-700 mb-2">No content found</h3>
                            <p className="text-slate-500 mb-6">
                                {searchQuery ?
                                    `No results found for "${searchQuery}". Try different keywords.` :
                                    'No content available in this category.'
                                }
                            </p>
                            {searchQuery && (
                                <Button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory('all');
                                    }}
                                    variant="secondary"
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Content Grid/List */}
                            <div className={viewMode === 'grid'
                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                                : 'space-y-4'
                            }>
                                {discoverData.content.map((item) => (
                                    <FlexibleContentCard
                                        key={item._id}
                                        content={item}
                                        onSave={(contentId: string, saved: boolean) => {
                                            if (saved) handleSaveContent(contentId);
                                        }}
                                        onLike={() => { }}
                                        onDismiss={() => { }}
                                        onView={() => { }}
                                        showDismiss={false}
                                    />
                                ))}
                            </div>

                            {/* Load More */}
                            {discoverData?.pagination?.hasMore && (
                                <div className="text-center mt-12">
                                    <Button
                                        onClick={() => {
                                            setFeedParams(prev => ({ ...prev, page: (prev.page || 1) + 1 }));
                                        }}
                                        variant="secondary"
                                        size="lg"
                                        className="px-8"
                                    >
                                        Load More Content
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </ErrorBoundary>
    );
};
