import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface VideoPlayerProps {
    content: {
        _id: string;
        title: string;
        url: string;
        source: 'youtube' | 'rss' | 'web' | 'article';
        thumbnail?: string;
        sourceChannel?: {
            name: string;
        };
    };
    isOpen: boolean;
    onClose: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ content, isOpen, onClose }) => {
    if (!isOpen) return null;

    const getEmbedUrl = (url: string, source: string) => {
        if (source === 'youtube') {
            // Extract video ID from various YouTube URL formats
            const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
            if (videoIdMatch) {
                return `https://www.youtube.com/embed/${videoIdMatch[1]}?autoplay=1&rel=0`;
            }
        }
        return null;
    };

    const embedUrl = getEmbedUrl(content.url, content.source);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-full overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                            {content.title}
                        </h2>
                        {content.sourceChannel?.name && (
                            <p className="text-sm text-gray-600 truncate">
                                {content.sourceChannel.name}
                            </p>
                        )}
                    </div>
                    <Button
                        onClick={onClose}
                        variant="ghost"
                        size="sm"
                        className="ml-4 p-2"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Video Content */}
                <div className="relative">
                    {embedUrl ? (
                        <div className="aspect-video">
                            <iframe
                                src={embedUrl}
                                title={content.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <div className="aspect-video bg-gray-100 flex flex-col items-center justify-center p-8">
                            {content.thumbnail && (
                                <img
                                    src={content.thumbnail}
                                    alt={content.title}
                                    className="w-48 h-32 object-cover rounded-lg mb-4"
                                />
                            )}
                            <p className="text-gray-600 text-center mb-4">
                                Cannot embed this video. Click below to open in a new tab.
                            </p>
                            <Button
                                onClick={() => window.open(content.url, '_blank')}
                                variant="primary"
                            >
                                Open Video
                            </Button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                        Source: {content.source}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={() => window.open(content.url, '_blank')}
                            variant="secondary"
                            size="sm"
                        >
                            Open in New Tab
                        </Button>
                        <Button
                            onClick={onClose}
                            variant="ghost"
                            size="sm"
                        >
                            Close
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
