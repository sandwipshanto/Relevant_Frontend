import React from 'react';
import { Heart, Bookmark, X, ExternalLink, Clock, User, Tag, Play } from 'lucide-react';
import { Button } from './Button';
import type { ContentWithUserData } from '../../types';

interface ContentCardProps {
    content: ContentWithUserData;
    onLike: (contentId: string, liked: boolean) => void;
    onSave: (contentId: string, saved: boolean) => void;
    onDismiss?: (contentId: string) => void;
    onView: (content: ContentWithUserData) => void;
    showDismiss?: boolean;
    compact?: boolean;
}

export const ContentCard: React.FC<ContentCardProps> = ({
    content,
    onLike,
    onSave,
    onDismiss,
    onView,
    showDismiss = true,
    compact = false
}) => {
    // Validate content structure to prevent rendering issues
    if (!content || typeof content !== 'object' || !content._id || !content.title) {
        console.warn('Invalid content structure passed to ContentCard:', content);
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">Invalid content data</p>
            </div>
        );
    }
    const formatDuration = (seconds: number) => {
        if (typeof seconds !== 'number' || isNaN(seconds)) {
            return '0:00';
        }
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
        }
        return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    const thumbnailSize = compact ? 'w-32 h-20' : 'w-48 h-32';
    const titleSize = compact ? 'text-base' : 'text-lg';
    const padding = compact ? 'p-4' : 'p-6';

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`flex ${compact ? 'gap-3' : ''}`}>
                {/* Thumbnail */}
                <div className={`flex-shrink-0 ${thumbnailSize} relative`}>
                    <img
                        src={content.thumbnail}
                        alt={content.title}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        onClick={() => onView(content)}
                    />

                    {/* Duration */}
                    {content.duration && typeof content.duration === 'number' && (
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
                            {formatDuration(content.duration)}
                        </div>
                    )}

                    {/* Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer bg-black bg-opacity-20">
                        <Play className="h-8 w-8 text-white" fill="white" />
                    </div>

                    {/* Status Badges */}
                    <div className="absolute top-1 left-1 flex flex-col gap-1">
                        {content.userContent?.viewed && (
                            <div className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded">
                                Viewed
                            </div>
                        )}
                        {content.userContent?.saved && (
                            <div className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                                Saved
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className={`flex-1 ${padding}`}>
                    <div className="flex justify-between items-start mb-2">
                        <h3
                            className={`${titleSize} font-semibold text-gray-900 cursor-pointer hover:text-blue-600 line-clamp-2 leading-snug`}
                            onClick={() => onView(content)}
                        >
                            {content.title}
                        </h3>
                        {showDismiss && onDismiss && (
                            <Button
                                onClick={() => onDismiss(content._id)}
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span className="truncate">
                                {content.sourceChannel?.name || 'Unknown Source'}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {content.publishedAt ? formatDate(content.publishedAt) : 'Unknown Date'}
                        </div>
                        {content.userContent?.relevanceScore && typeof content.userContent.relevanceScore === 'number' && (
                            <div className="flex items-center gap-1">
                                <Tag className="h-4 w-4" />
                                <span className="font-medium">
                                    {Math.round(content.userContent.relevanceScore * 100)}% match
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <p className={`text-gray-700 mb-4 ${compact ? 'line-clamp-2' : 'line-clamp-3'}`}>
                        {(content.userContent?.personalizedSummary && typeof content.userContent.personalizedSummary === 'string') ?
                            content.userContent.personalizedSummary :
                            (content.summary && typeof content.summary === 'string') ?
                                content.summary :
                                (content.description && typeof content.description === 'string') ?
                                    content.description :
                                    'No description available'
                        }
                    </p>

                    {/* Highlights */}
                    {!compact && content.userContent?.personalizedHighlights && content.userContent.personalizedHighlights.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Key Highlights:</h4>
                            <ul className="space-y-1 text-sm text-gray-600">
                                {content.userContent.personalizedHighlights
                                    .filter(highlight => typeof highlight === 'string') // Ensure only strings are rendered
                                    .slice(0, 2)
                                    .map((highlight, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                                            <span className="line-clamp-1">{highlight}</span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    {/* Matched Interests */}
                    {content.userContent?.matchedInterests && content.userContent.matchedInterests.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {content.userContent.matchedInterests
                                .filter(interest => typeof interest === 'string') // Ensure only strings are rendered
                                .slice(0, compact ? 2 : 3)
                                .map((interest, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                    >
                                        {interest}
                                    </span>
                                ))}
                            {content.userContent.matchedInterests.filter(interest => typeof interest === 'string').length > (compact ? 2 : 3) && (
                                <span className="text-xs text-gray-500 px-2 py-0.5">
                                    +{content.userContent.matchedInterests.filter(interest => typeof interest === 'string').length - (compact ? 2 : 3)} more
                                </span>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => onLike(content._id, !content.userContent?.liked)}
                            variant="ghost"
                            size="sm"
                            className={`${content.userContent?.liked ? 'text-red-600' : 'text-gray-600'} hover:bg-red-50`}
                        >
                            <Heart className={`h-4 w-4 mr-1 ${content.userContent?.liked ? 'fill-current' : ''}`} />
                            {content.userContent?.liked ? 'Liked' : 'Like'}
                        </Button>

                        <Button
                            onClick={() => onSave(content._id, !content.userContent?.saved)}
                            variant="ghost"
                            size="sm"
                            className={`${content.userContent?.saved ? 'text-blue-600' : 'text-gray-600'} hover:bg-blue-50`}
                        >
                            <Bookmark className={`h-4 w-4 mr-1 ${content.userContent?.saved ? 'fill-current' : ''}`} />
                            {content.userContent?.saved ? 'Saved' : 'Save'}
                        </Button>

                        <Button
                            onClick={() => onView(content)}
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:bg-gray-50"
                        >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Open
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
