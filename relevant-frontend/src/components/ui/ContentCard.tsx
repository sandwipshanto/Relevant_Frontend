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
    showDismiss = true
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

        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
        return `${Math.ceil(diffDays / 365)} years ago`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group relative">
            {/* Hover Tooltip for AI Analysis */}
            <div className="absolute inset-x-0 top-full z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
                <div className="bg-white border border-gray-200 rounded-lg shadow-xl p-4 mx-4 mt-2">
                    <div className="space-y-3">
                        {/* Summary */}
                        {content.summary && (
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">Summary</h4>
                                <p className="text-gray-700 text-xs leading-relaxed">{content.summary}</p>
                            </div>
                        )}

                        {/* Key Highlights */}
                        {content.highlights && Array.isArray(content.highlights) && content.highlights.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">Key Highlights</h4>
                                <ul className="space-y-1">
                                    {content.highlights.slice(0, 3).map((highlight, index) => {
                                        if (typeof highlight === 'string') {
                                            return (
                                                <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                                                    <span className="text-blue-500 text-xs">•</span>
                                                    <span>{highlight}</span>
                                                </li>
                                            );
                                        } else if (typeof highlight === 'object' && highlight.text) {
                                            return (
                                                <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                                                    <span className="text-blue-500 text-xs">•</span>
                                                    <span>{highlight.text}</span>
                                                    {highlight.relevance && (
                                                        <span className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded text-xs ml-auto">
                                                            {Math.round(highlight.relevance * 100)}%
                                                        </span>
                                                    )}
                                                </li>
                                            );
                                        }
                                        return null;
                                    })}
                                </ul>
                            </div>
                        )}

                        {/* Key Points */}
                        {content.keyPoints && content.keyPoints.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">Key Points</h4>
                                <div className="flex flex-wrap gap-1">
                                    {content.keyPoints.slice(0, 4).map((point, index) => (
                                        <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                            {point}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Metadata */}
                        <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                            {content.estimatedWatchTime && (
                                <span>⏱️ {content.estimatedWatchTime}</span>
                            )}
                            {content.categories && content.categories.length > 0 && (
                                <span>📂 {content.categories.slice(0, 2).join(', ')}</span>
                            )}
                        </div>

                        {/* Recommendation Reason */}
                        {content.recommendationReason && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                <p className="text-blue-800 text-xs font-medium">💡 {content.recommendationReason}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Thumbnail Container */}
            <div className="relative aspect-video bg-gray-100 overflow-hidden">
                <img
                    src={content.thumbnail || '/api/placeholder/320/180'}
                    alt={content.title}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                    onClick={() => onView(content)}
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = '/api/placeholder/320/180';
                    }}
                />

                {/* Duration Badge */}
                {content.duration && typeof content.duration === 'number' && content.duration > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded font-medium">
                        {formatDuration(content.duration)}
                    </div>
                )}

                {/* Relevance Score Badge */}
                {(content.relevanceScore || content.userContent?.relevanceScore) && (
                    <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                        {Math.round((content.relevanceScore || content.userContent?.relevanceScore || 0) * 100)}%
                    </div>
                )}

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                            className="bg-white bg-opacity-90 rounded-full p-3 cursor-pointer transform scale-90 group-hover:scale-100 transition-transform duration-200"
                            onClick={() => onView(content)}
                        >
                            <Play className="h-6 w-6 text-gray-900" fill="currentColor" />
                        </div>
                    </div>
                </div>

                {/* Status Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {content.userContent?.viewed && (
                        <div className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                            ✓ Watched
                        </div>
                    )}
                    {content.userContent?.saved && (
                        <div className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
                            ★ Saved
                        </div>
                    )}
                    {/* Complexity Badge */}
                    {content.complexity && (
                        <div className={`text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-sm ${content.complexity === 'beginner' ? 'bg-green-500' :
                                content.complexity === 'intermediate' ? 'bg-yellow-500' :
                                    'bg-red-500'
                            }`}>
                            {content.complexity}
                        </div>
                    )}
                </div>

                {/* Dismiss Button */}
                {showDismiss && onDismiss && (
                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDismiss(content._id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-1 h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Content Info */}
            <div className="p-4">
                {/* Title */}
                <h3
                    className="font-semibold text-gray-900 text-base leading-snug mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors duration-200"
                    onClick={() => onView(content)}
                >
                    {content.title}
                </h3>

                {/* Channel & Meta Info */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <User className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate font-medium">
                            {content.sourceChannel?.name || 'Unknown Channel'}
                        </span>
                    </div>
                    {content.userContent?.relevanceScore && typeof content.userContent.relevanceScore === 'number' && (
                        <div className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                            <Tag className="h-3 w-3" />
                            {Math.round(content.userContent.relevanceScore * 100)}%
                        </div>
                    )}
                </div>

                {/* Views and Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                    <Clock className="h-4 w-4" />
                    <span>{content.publishedAt ? formatDate(content.publishedAt) : 'Unknown date'}</span>
                </div>

                {/* Description */}
                <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed mb-3">
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
                {content.userContent?.personalizedHighlights && content.userContent.personalizedHighlights.length > 0 && (
                    <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                            {content.userContent.personalizedHighlights
                                .filter(highlight => typeof highlight === 'string')
                                .slice(0, 2)
                                .map((highlight, index) => (
                                    <div key={index} className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                                        ✨ {highlight.length > 30 ? `${highlight.substring(0, 30)}...` : highlight}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {/* Matched Interests */}
                {content.userContent?.matchedInterests && content.userContent.matchedInterests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {content.userContent.matchedInterests
                            .filter(interest => typeof interest === 'string')
                            .slice(0, 3)
                            .map((interest, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700"
                                >
                                    {interest}
                                </span>
                            ))}
                        {content.userContent.matchedInterests.filter(interest => typeof interest === 'string').length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                                +{content.userContent.matchedInterests.filter(interest => typeof interest === 'string').length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* AI Analysis Categories */}
                {content.categories && content.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {content.categories.slice(0, 3).map((category, index) => (
                            <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                            >
                                📁 {category}
                            </span>
                        ))}
                        {content.categories.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-1">
                                +{content.categories.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => onLike(content._id, !content.userContent?.liked)}
                            variant="ghost"
                            size="sm"
                            className={`${content.userContent?.liked ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-red-50 hover:text-red-600'} transition-colors duration-200`}
                        >
                            <Heart className={`h-4 w-4 mr-1 ${content.userContent?.liked ? 'fill-current' : ''}`} />
                            <span className="text-xs">{content.userContent?.liked ? 'Liked' : 'Like'}</span>
                        </Button>

                        <Button
                            onClick={() => onSave(content._id, !content.userContent?.saved)}
                            variant="ghost"
                            size="sm"
                            className={`${content.userContent?.saved ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'} transition-colors duration-200`}
                        >
                            <Bookmark className={`h-4 w-4 mr-1 ${content.userContent?.saved ? 'fill-current' : ''}`} />
                            <span className="text-xs">{content.userContent?.saved ? 'Saved' : 'Save'}</span>
                        </Button>
                    </div>

                    <Button
                        onClick={() => onView(content)}
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
                    >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        <span className="text-xs">Watch</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};
