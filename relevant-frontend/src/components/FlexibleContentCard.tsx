import React from 'react';
import { ContentCard } from './ui/ContentCard';
import type { ContentWithUserData } from '../types';

interface FlexibleContentCardProps {
    content: any; // Accept any content structure
    onLike: (contentId: string, liked: boolean) => void;
    onSave: (contentId: string, saved: boolean) => void;
    onDismiss: (contentId: string) => void;
    onView: (content: any) => void;
    showDismiss: boolean;
}

export const FlexibleContentCard: React.FC<FlexibleContentCardProps> = ({
    content,
    onLike,
    onSave,
    onDismiss,
    onView,
    showDismiss
}) => {
    // Transform the content to match expected structure
    const normalizedContent: ContentWithUserData = {
        // ID field - try multiple possible names
        _id: content._id || content.id || content.contentId || content.videoId || 'unknown',

        // Title field - try multiple possible names
        title: content.title || content.name || content.description || 'Untitled',

        // Description
        description: content.description || content.summary || content.personalizedSummary || '',

        // URL
        url: content.url || content.link || content.videoUrl || '#',

        // Source info
        source: content.source || 'unknown' as any,
        sourceId: content.sourceId || content.channelId || '',
        sourceChannel: content.sourceChannel || {
            id: content.channelId || '',
            name: content.channelName || content.channelTitle || 'Unknown Channel'
        },

        // Media
        thumbnail: content.thumbnail || content.thumbnailUrl || content.image || '',

        // Dates
        publishedAt: content.publishedAt || content.createdAt || new Date().toISOString(),
        createdAt: content.createdAt || new Date().toISOString(),

        // Content details
        duration: content.duration || 0,
        tags: content.tags || [],
        category: content.category || 'general',
        summary: content.summary || content.description || '',
        highlights: content.highlights || [],
        keyPoints: content.keyPoints || [],
        relevantTopics: content.relevantTopics || [],
        processed: content.processed ?? true,

        // User interaction data
        userContent: content.userContent ? {
            _id: content.userContent._id || 'unknown',
            userId: content.userContent.userId || '',
            contentId: content.userContent.contentId || content._id || content.id,
            relevanceScore: content.userContent.relevanceScore || 0,
            matchedInterests: Array.isArray(content.userContent.matchedInterests)
                ? content.userContent.matchedInterests.filter((i: any) => typeof i === 'string')
                : [],
            personalizedSummary: content.userContent.personalizedSummary || '',
            personalizedHighlights: Array.isArray(content.userContent.personalizedHighlights)
                ? content.userContent.personalizedHighlights.filter((h: any) => typeof h === 'string')
                : [],
            viewed: content.userContent.viewed || false,
            viewedAt: content.userContent.viewedAt,
            liked: content.userContent.liked || false,
            saved: content.userContent.saved || false,
            dismissed: content.userContent.dismissed || false,
            createdAt: content.userContent.createdAt || new Date().toISOString()
        } : undefined
    };

    // Log the transformation for debugging
    if (process.env.NODE_ENV === 'development') {
        console.log('Content transformation:', {
            original: content,
            normalized: normalizedContent,
            originalKeys: Object.keys(content),
            transformedKeys: Object.keys(normalizedContent)
        });
    }

    return (
        <ContentCard
            content={normalizedContent}
            onLike={onLike}
            onSave={onSave}
            onDismiss={onDismiss}
            onView={onView}
            showDismiss={showDismiss}
        />
    );
};
