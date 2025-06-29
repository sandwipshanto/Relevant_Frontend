import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Loading';
import { ContentCard } from '../components/ui/ContentCard';
import { ErrorBoundary } from '../components/ErrorBoundary';
import type { ContentWithUserData, SavedContentQueryParams } from '../types';

export const SavedContentPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState(''); const [params] = useState<SavedContentQueryParams>({
        page: 1,
        limit: 10
    });

    const queryClient = useQueryClient();

    // Saved content query
    const {
        data: savedData,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['savedContent', params],
        queryFn: () => apiService.getSavedContent(params)
    });

    // Content interactions
    const unsaveMutation = useMutation({
        mutationFn: (contentId: string) => apiService.toggleContentSave(contentId, false),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedContent'] });
            queryClient.invalidateQueries({ queryKey: ['contentFeed'] });
            toast.success('Content removed from saved');
        }
    });

    const likeMutation = useMutation({
        mutationFn: ({ contentId, liked }: { contentId: string; liked: boolean }) =>
            apiService.toggleContentLike(contentId, liked),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedContent'] });
            queryClient.invalidateQueries({ queryKey: ['contentFeed'] });
        }
    });

    const viewMutation = useMutation({
        mutationFn: (contentId: string) => apiService.markContentAsViewed(contentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedContent'] });
        }
    }); const handleContentClick = (content: ContentWithUserData) => {
        if (!content.userContent?.viewed) {
            viewMutation.mutate(content._id);
        }
        window.open(content.url, '_blank');
    };

    // Safely extract and filter content with validation
    let baseContent: ContentWithUserData[] = [];
    try {
        baseContent = savedData?.content || [];

        // Ensure we have an array and validate content structure
        if (!Array.isArray(baseContent)) {
            console.error('Saved content is not an array:', baseContent);
            baseContent = [];
        }

        // Filter out any invalid items that might cause rendering issues
        baseContent = baseContent.filter(item =>
            item &&
            typeof item === 'object' &&
            item._id &&
            item.title &&
            typeof item.title === 'string' &&
            item.sourceChannel &&
            typeof item.sourceChannel.name === 'string'
        );
    } catch (error) {
        console.error('Error processing saved content data:', error);
        baseContent = [];
    }

    const filteredContent = baseContent.filter(item =>
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sourceChannel.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Content</h1>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        type="text"
                        placeholder="Search saved content..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <p className="text-gray-600">
                    {savedData?.content?.length || 0} saved articles and videos
                </p>
            </div>

            {/* Content */}
            {isLoading && params.page === 1 ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner size="lg" />
                </div>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-red-600 mb-4">Failed to load saved content</p>
                    <Button onClick={() => refetch()} variant="secondary">
                        Try Again
                    </Button>
                </div>
            ) : filteredContent.length === 0 ? (
                <div className="text-center py-12">
                    <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                        {searchQuery ? 'No saved content matches your search' : 'No saved content yet'}
                    </p>
                    <p className="text-sm text-gray-500">
                        {searchQuery
                            ? 'Try searching for different terms'
                            : 'Save interesting articles and videos from your feed to access them later'
                        }
                    </p>
                </div>
            ) : (<div className="space-y-6">
                {filteredContent.map((item: ContentWithUserData) => (
                    <ErrorBoundary key={item._id} fallback={
                        <div className="p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                            <p className="text-yellow-800 text-sm">Failed to render this saved content item</p>
                        </div>
                    }>
                        <ContentCard
                            content={item}
                            onLike={(contentId, liked) => likeMutation.mutate({ contentId, liked })}
                            onSave={(contentId) => unsaveMutation.mutate(contentId)} // Always unsave for saved content
                            onView={handleContentClick}
                            showDismiss={false}
                        />
                    </ErrorBoundary>
                ))}                    {/* Load More */}
                {savedData?.pagination?.hasMore && (
                    <div className="text-center py-6">
                        <Button
                            onClick={() => {/* Load more functionality can be added later */ }}
                            disabled={isLoading}
                            variant="secondary"
                        >
                            {isLoading ? (
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
