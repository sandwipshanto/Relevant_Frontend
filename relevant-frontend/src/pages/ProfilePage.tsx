import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Youtube, Star, Tag, User, Calendar } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LoadingSpinner } from '../components/ui/Loading';
import { InterestSelector } from '../components/ui/InterestSelector';
import type { HierarchicalInterests, YouTubeSource } from '../types';

interface YouTubeChannelForm {
    channelId: string;
    channelTitle: string;
    channelUrl: string;
}

export const ProfilePage: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();    // State for managing forms
    const [activeTab, setActiveTab] = useState<'profile' | 'interests' | 'youtube'>('profile');
    const [newYouTubeForm, setNewYouTubeForm] = useState<YouTubeChannelForm>({
        channelId: '',
        channelTitle: '',
        channelUrl: ''
    });
    const [showAddInterest, setShowAddInterest] = useState(false);
    const [showAddYouTube, setShowAddYouTube] = useState(false);// Get user profile
    const {
        data: profileData,
        isLoading: profileLoading
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => apiService.getUserProfile()
    });    // Get user stats
    const {
        isLoading: statsLoading
    } = useQuery({
        queryKey: ['userStats'],
        queryFn: () => apiService.getUserStats()
    });

    // Mutations
    const addInterestMutation = useMutation({
        mutationFn: (data: { category: string; priority: number; keywords: string[] }) =>
            apiService.addInterestCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setShowAddInterest(false);
            toast.success('Interest category added');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to add interest');
        }
    });

    const deleteInterestMutation = useMutation({
        mutationFn: (category: string) => apiService.deleteInterestCategory(category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            toast.success('Interest category deleted');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to delete interest');
        }
    });

    const addYouTubeMutation = useMutation({
        mutationFn: (data: { channelId: string; channelTitle: string; channelUrl?: string }) =>
            apiService.addYouTubeChannel(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setShowAddYouTube(false);
            setNewYouTubeForm({ channelId: '', channelTitle: '', channelUrl: '' });
            toast.success('YouTube channel added');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to add YouTube channel');
        }
    });

    const removeYouTubeMutation = useMutation({
        mutationFn: (channelId: string) => apiService.removeYouTubeChannel(channelId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            toast.success('YouTube channel removed');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to remove YouTube channel');
        }
    }); const currentUser = profileData?.user || user;
    const interests = currentUser?.interests as HierarchicalInterests || {};
    const youtubeSources = currentUser?.youtubeSources || [];

    const handleAddYouTube = () => {
        if (newYouTubeForm.channelId && newYouTubeForm.channelTitle) {
            addYouTubeMutation.mutate({
                channelId: newYouTubeForm.channelId,
                channelTitle: newYouTubeForm.channelTitle,
                channelUrl: newYouTubeForm.channelUrl || undefined
            });
        }
    };

    const extractChannelId = (url: string): string => {
        // Extract channel ID from various YouTube URL formats
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
            /(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([a-zA-Z0-9_-]+)/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return url; // Return as-is if no pattern matches
    };

    const handleYouTubeUrlChange = (url: string) => {
        setNewYouTubeForm(prev => ({
            ...prev,
            channelUrl: url,
            channelId: extractChannelId(url)
        }));
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (profileLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
                <p className="text-gray-600">Manage your interests, YouTube channels, and preferences</p>
            </div>

            {/* Tabs */}
            <div className="mb-8">
                <nav className="flex space-x-8">
                    {[
                        { id: 'profile', label: 'Profile Info', icon: User },
                        { id: 'interests', label: 'Interests', icon: Tag },
                        { id: 'youtube', label: 'YouTube Sources', icon: Youtube }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Profile Info Tab */}
            {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* User Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                User Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <p className="text-gray-900">{currentUser?.name || 'Not set'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <p className="text-gray-900">{currentUser?.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                                <p className="text-gray-600 flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(currentUser?.createdAt || '')}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Last Active</label>
                                <p className="text-gray-600">{formatDate(currentUser?.lastActive || '')}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {statsLoading ? (
                                <div className="flex justify-center py-8">
                                    <LoadingSpinner size="md" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {Object.keys(interests).length}
                                        </div>
                                        <div className="text-sm text-gray-600">Interest Categories</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            {youtubeSources.length}
                                        </div>
                                        <div className="text-sm text-gray-600">YouTube Channels</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Interests Tab */}
            {activeTab === 'interests' && (
                <div className="space-y-6">                    {/* Add Interest Form */}
                    {showAddInterest && (
                        <InterestSelector
                            onAdd={(category, priority, keywords) => {
                                addInterestMutation.mutate({ category, priority, keywords });
                            }}
                            onCancel={() => setShowAddInterest(false)}
                            disabled={addInterestMutation.isPending}
                        />
                    )}

                    {/* Interests List */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">Interest Categories</h2>
                        <Button
                            onClick={() => setShowAddInterest(true)}
                            disabled={showAddInterest}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Interest
                        </Button>
                    </div>

                    {Object.keys(interests).length === 0 ? (
                        <div className="text-center py-12">
                            <Tag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No interests configured yet</p>
                            <p className="text-sm text-gray-500">Add your interests to get personalized content recommendations</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(interests).map(([category, data]) => (
                                <Card key={category}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-gray-900">{category}</h3>
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span className="text-sm text-gray-600">{data.priority}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs font-medium text-gray-700 mb-1">Keywords:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {data.keywords
                                                        .filter(keyword => typeof keyword === 'string') // Ensure only strings are rendered
                                                        .slice(0, 3)
                                                        .map((keyword, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                                                            >
                                                                {keyword}
                                                            </span>
                                                        ))}
                                                    {data.keywords.filter(keyword => typeof keyword === 'string').length > 3 && (
                                                        <span className="text-xs text-gray-500">
                                                            +{data.keywords.filter(keyword => typeof keyword === 'string').length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {data.subcategories && Object.keys(data.subcategories).length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-700 mb-1">Subcategories:</p>
                                                    <div className="text-xs text-gray-600">
                                                        {Object.keys(data.subcategories).join(', ')}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteInterestMutation.mutate(category)}
                                                disabled={deleteInterestMutation.isPending}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* YouTube Sources Tab */}
            {activeTab === 'youtube' && (
                <div className="space-y-6">
                    {/* Add YouTube Form */}
                    {showAddYouTube && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Add YouTube Channel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Channel URL</label>
                                    <Input
                                        value={newYouTubeForm.channelUrl}
                                        onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                                        placeholder="https://youtube.com/channel/... or https://youtube.com/c/..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Channel ID</label>
                                    <Input
                                        value={newYouTubeForm.channelId}
                                        onChange={(e) => setNewYouTubeForm(prev => ({ ...prev, channelId: e.target.value }))}
                                        placeholder="Channel ID (auto-filled from URL)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Channel Name</label>
                                    <Input
                                        value={newYouTubeForm.channelTitle}
                                        onChange={(e) => setNewYouTubeForm(prev => ({ ...prev, channelTitle: e.target.value }))}
                                        placeholder="Channel display name"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleAddYouTube}
                                        disabled={!newYouTubeForm.channelId || !newYouTubeForm.channelTitle}
                                    >
                                        Add Channel
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setShowAddYouTube(false);
                                            setNewYouTubeForm({ channelId: '', channelTitle: '', channelUrl: '' });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* YouTube Channels List */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">YouTube Channels</h2>
                        <Button
                            onClick={() => setShowAddYouTube(true)}
                            disabled={showAddYouTube}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Channel
                        </Button>
                    </div>

                    {youtubeSources.length === 0 ? (
                        <div className="text-center py-12">
                            <Youtube className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-600 mb-4">No YouTube channels added yet</p>
                            <p className="text-sm text-gray-500">Add YouTube channels to get content from your favorite creators</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {youtubeSources.map((channel: YouTubeSource) => (
                                <Card key={channel.channelId}>
                                    <CardContent className="pt-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-center gap-2">
                                                <Youtube className="h-5 w-5 text-red-600" />
                                                <h3 className="font-semibold text-gray-900 truncate">{channel.channelTitle}</h3>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeYouTubeMutation.mutate(channel.channelId)}
                                                disabled={removeYouTubeMutation.isPending}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="space-y-2 text-sm text-gray-600">
                                            <div>
                                                <span className="font-medium">Channel ID:</span>
                                                <p className="text-xs font-mono bg-gray-100 p-1 rounded mt-1">{channel.channelId}</p>
                                            </div>
                                            <div>
                                                <span className="font-medium">Added:</span>
                                                <p>{formatDate(channel.addedAt)}</p>
                                            </div>
                                            {channel.channelUrl && (
                                                <div>
                                                    <a
                                                        href={channel.channelUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                                    >
                                                        View Channel →
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
