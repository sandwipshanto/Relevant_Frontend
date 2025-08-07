import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    User, Settings, Bell, Shield, Youtube, BookOpen,
    Calendar, Edit3, X, Eye, Heart, Plus, Trash2, Star, BarChart3,
    Save, Camera, Moon, Sun, Palette, Volume2, VolumeX
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { YouTubeOAuthSection } from '../components/features/YouTubeOAuthSection';
import { InterestSelector } from '../components/ui/InterestSelector';

export const YouPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [showInterestSelector, setShowInterestSelector] = useState(false);

    // Profile editing state
    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    // Preferences state
    const [preferences, setPreferences] = useState({
        notifications: {
            newContent: true,
            weeklyDigest: false,
            recommendations: true,
            socialUpdates: false
        },
        display: {
            theme: 'light',
            viewMode: 'grid',
            compactMode: false
        },
        audio: {
            soundEffects: true
        },
        privacy: {
            dataCollection: true,
            analytics: false,
            publicProfile: false
        }
    });

    const queryClient = useQueryClient();

    // User stats query
    const {
        data: userStats,
        isLoading: isStatsLoading
    } = useQuery({
        queryKey: ['userStats'],
        queryFn: () => apiService.getUserStats(),
        enabled: !!user
    });

    // Content feed for activity tracking
    const {
        data: userContent,
        isLoading: isContentLoading
    } = useQuery({
        queryKey: ['userContent'],
        queryFn: () => apiService.getContentFeed({ limit: 50 }),
        enabled: !!user
    });

    // Saved content query for stats
    const {
        data: savedContent,
        isLoading: isSavedLoading
    } = useQuery({
        queryKey: ['savedContent'],
        queryFn: () => apiService.getSavedContent(),
        enabled: !!user
    });

    // Add interest mutation
    const addInterestMutation = useMutation({
        mutationFn: (data: { category: string; priority: number; keywords: string[] }) =>
            apiService.addInterestCategory(data),
        onSuccess: () => {
            toast.success('Interest added successfully!');
            setShowInterestSelector(false);
            queryClient.invalidateQueries({ queryKey: ['userStats'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to add interest');
        }
    });

    // Delete interest mutation
    const deleteInterestMutation = useMutation({
        mutationFn: (category: string) => apiService.deleteInterestCategory(category),
        onSuccess: () => {
            toast.success('Interest removed successfully!');
            queryClient.invalidateQueries({ queryKey: ['userStats'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to remove interest');
        }
    });

    // Update profile mutation (using a method we'll create)
    const updateProfileMutation = useMutation({
        mutationFn: async (data: { name: string }) => {
            // For now, we'll use preferences endpoint to update profile
            // This would ideally be a separate profile update endpoint
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            return response.json();
        },
        onSuccess: () => {
            toast.success('Profile updated successfully!');
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: () => {
            toast.error('Failed to update profile');
        }
    });

    // Update preferences mutation
    const updatePreferencesMutation = useMutation({
        mutationFn: (data: any) => apiService.updatePreferences(data),
        onSuccess: () => {
            toast.success('Preferences updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update preferences');
        }
    });

    // Calculate activity metrics
    const activityMetrics = {
        totalContent: userContent?.content?.length || 0,
        savedItems: savedContent?.content?.length || 0,
        activeInterests: userStats?.stats?.totalInterests || 0,
        lastActiveDate: userStats?.stats?.lastActive ?
            new Date(userStats.stats.lastActive).toLocaleDateString() :
            'Today'
    };

    const tabs = [
        { id: 'profile', name: 'Profile', icon: User },
        { id: 'interests', name: 'Interests', icon: BookOpen },
        { id: 'preferences', name: 'Preferences', icon: Settings },
        { id: 'privacy', name: 'Privacy', icon: Shield },
        { id: 'connections', name: 'Connections', icon: Youtube },
    ];

    const profileStats = [
        {
            label: 'Content Viewed',
            value: activityMetrics.totalContent,
            icon: Eye,
            color: 'blue',
            description: 'Total articles and videos viewed'
        },
        {
            label: 'Items Saved',
            value: activityMetrics.savedItems,
            icon: Heart,
            color: 'red',
            description: 'Content saved for later reading'
        },
        {
            label: 'Interests',
            value: activityMetrics.activeInterests,
            icon: BookOpen,
            color: 'green',
            description: 'Active interest categories'
        },
        {
            label: 'YouTube Sources',
            value: userStats?.stats?.totalYoutubeSources || 0,
            icon: Calendar,
            color: 'purple',
            description: 'Connected YouTube channels'
        }
    ];

    // Handle adding new interest
    const handleAddInterest = async (category: string, priority: number, keywords: string[]) => {
        addInterestMutation.mutate({ category, priority, keywords });
    };

    // Handle deleting interest
    const handleDeleteInterest = async (category: string) => {
        const confirmed = window.confirm(
            `Are you sure you want to remove "${category.replace(/([A-Z])/g, ' $1').trim()}" from your interests?\n\nThis will affect your content recommendations.`
        );
        if (confirmed) {
            deleteInterestMutation.mutate(category);
        }
    };

    // Handle profile form submission
    const handleProfileSave = () => {
        if (!profileForm.name.trim()) {
            toast.error('Name is required');
            return;
        }
        updateProfileMutation.mutate({ name: profileForm.name.trim() });
    };

    // Handle preference toggle
    const handlePreferenceToggle = (category: string, key: string, value: any) => {
        const newPreferences = {
            ...preferences,
            [category]: {
                ...preferences[category as keyof typeof preferences],
                [key]: value
            }
        };
        setPreferences(newPreferences);
        // Update preferences immediately
        updatePreferencesMutation.mutate(newPreferences);
    };

    const renderProfileTab = () => (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50">
                <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                    <div className="relative group">
                        <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            {isEditing ? (
                                <div className="flex-1 space-y-3">
                                    <Input
                                        value={profileForm.name}
                                        onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                                        placeholder="Your name"
                                        className="text-2xl font-bold border-slate-300 focus:border-slate-500"
                                    />
                                </div>
                            ) : (
                                <h2 className="text-2xl font-bold text-slate-900">
                                    {user?.name || 'Your Profile'}
                                </h2>
                            )}
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={handleProfileSave}
                                            disabled={updateProfileMutation.isPending}
                                            className="flex items-center gap-2"
                                        >
                                            <Save className="w-4 h-4" />
                                            Save
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setProfileForm({
                                                    name: user?.name || '',
                                                    email: user?.email || ''
                                                });
                                            }}
                                            className="text-slate-600 hover:text-slate-800"
                                        >
                                            <X size={16} />
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                        className="text-slate-600 hover:text-slate-800"
                                    >
                                        <Edit3 size={16} />
                                    </Button>
                                )}
                            </div>
                        </div>

                        <p className="text-slate-600 mb-4">{user?.email}</p>

                        <div className="flex flex-wrap gap-2">
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                Active Member
                            </span>
                            <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                                {userStats?.stats?.memberSince ? `Member since ${new Date(userStats.stats.memberSince).getFullYear()}` : 'New Member'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {profileStats.map((stat) => {
                    const Icon = stat.icon;
                    const colorClasses = {
                        blue: 'bg-blue-100 text-blue-600',
                        red: 'bg-red-100 text-red-600',
                        green: 'bg-green-100 text-green-600',
                        purple: 'bg-purple-100 text-purple-600'
                    };

                    const isLoading = isStatsLoading ||
                        (stat.label === 'Content Viewed' && isContentLoading) ||
                        (stat.label === 'Items Saved' && isSavedLoading);

                    return (
                        <Card key={stat.label} className="bg-white/60 backdrop-blur-sm border-slate-200/50 hover:shadow-lg transition-all duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-2xl font-bold text-slate-900">
                                            {isLoading ? (
                                                <div className="h-8 w-12 bg-slate-200 rounded animate-pulse"></div>
                                            ) : (
                                                stat.value.toLocaleString()
                                            )}
                                        </div>
                                        <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                                        <div className="text-xs text-slate-500 mt-1">{stat.description}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                        <BarChart3 className="w-5 h-5" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {isContentLoading ? (
                            <>
                                <LoadingSkeleton count={3} viewMode="list" />
                            </>
                        ) : userContent?.content && userContent.content.length > 0 ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                                        <div className="text-2xl font-bold text-blue-700">{activityMetrics.totalContent}</div>
                                        <div className="text-sm text-blue-600">Articles Discovered</div>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                                        <div className="text-2xl font-bold text-green-700">
                                            {activityMetrics.activeInterests}
                                        </div>
                                        <div className="text-sm text-green-600">Active Interests</div>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                                        <div className="text-2xl font-bold text-purple-700">
                                            {activityMetrics.lastActiveDate}
                                        </div>
                                        <div className="text-sm text-purple-600">Last Active</div>
                                    </div>
                                </div>

                                <h4 className="font-semibold text-slate-700 mb-3">Latest Content</h4>
                                {userContent.content.slice(0, 3).map((content: any, idx: number) => (
                                    <div key={content._id || idx} className="flex items-center gap-4 p-3 bg-slate-50/80 rounded-lg border border-slate-200/50">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-800 line-clamp-1">
                                                {content.title}
                                            </div>
                                            <div className="text-sm text-slate-500">
                                                {content.source} • {content.sourceChannel?.name || 'Unknown'}
                                            </div>
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {content.publishedAt ?
                                                new Date(content.publishedAt).toLocaleDateString() :
                                                'Recent'
                                            }
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                <h4 className="font-semibold text-slate-600 mb-2">No activity yet</h4>
                                <p className="text-sm">
                                    Start exploring content to see your activity here
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderInterestsTab = () => (
        <div className="space-y-8">
            {/* Interests Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2 flex items-center gap-3">
                            <BookOpen className="w-5 h-5" />
                            Your Interests
                        </h3>
                        <p className="text-slate-600">
                            Manage your interests to get better content recommendations
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowInterestSelector(true)}
                        variant="primary"
                        className="flex items-center gap-2"
                        disabled={addInterestMutation.isPending}
                    >
                        <Plus className="w-4 h-4" />
                        Add Interest
                    </Button>
                </div>
            </div>

            {/* Current Interests */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                <CardContent className="p-8">
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold text-slate-900 mb-2">Current Interests</h4>
                        <p className="text-sm text-slate-600">Your active interests that guide content curation</p>
                    </div>

                    {user?.interests ? (
                        <div className="space-y-6">
                            {typeof user.interests === 'object' && !Array.isArray(user.interests) ? (
                                // Hierarchical interests
                                Object.entries(user.interests).map(([category, data]: [string, any]) => (
                                    <div key={category} className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/30">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h5 className="font-semibold text-slate-900 capitalize flex items-center gap-2">
                                                    {category.replace(/([A-Z])/g, ' $1').trim()}
                                                    <span className="bg-slate-200 text-slate-700 text-xs px-2 py-1 rounded-full">
                                                        Priority: {data.priority || 5}
                                                    </span>
                                                </h5>
                                                {data.keywords && data.keywords.length > 0 && (
                                                    <div className="mt-2 flex flex-wrap gap-1">
                                                        {data.keywords.slice(0, 5).map((keyword: string, idx: number) => (
                                                            <span key={idx} className="bg-white/80 text-slate-600 text-xs px-2 py-1 rounded-md border border-slate-200">
                                                                {keyword}
                                                            </span>
                                                        ))}
                                                        {data.keywords.length > 5 && (
                                                            <span className="text-xs text-slate-500">
                                                                +{data.keywords.length - 5} more
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-slate-500 hover:text-red-600"
                                                onClick={() => handleDeleteInterest(category)}
                                                disabled={deleteInterestMutation.isPending}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>

                                        {/* Subcategories */}
                                        {data.subcategories && Object.keys(data.subcategories).length > 0 && (
                                            <div className="mt-4">
                                                <h6 className="text-sm font-medium text-slate-700 mb-2">Subcategories:</h6>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {Object.entries(data.subcategories).map(([subcat, subData]: [string, any]) => (
                                                        <div key={subcat} className="bg-white/60 rounded-lg p-3 border border-slate-200/50">
                                                            <div className="flex items-center justify-between">
                                                                <span className="text-sm font-medium text-slate-800 capitalize">
                                                                    {subcat.replace(/([A-Z])/g, ' $1').trim()}
                                                                </span>
                                                                <div className="flex items-center gap-1">
                                                                    {Array.from({ length: subData.priority || 3 }).map((_, i) => (
                                                                        <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : Array.isArray(user.interests) ? (
                                // Simple array interests
                                <div className="flex flex-wrap gap-2">
                                    {user.interests.map((interest: string, idx: number) => (
                                        <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-slate-600 mb-2">No interests yet</h4>
                            <p className="text-slate-500 mb-6">
                                Add your first interest to start getting personalized content recommendations
                            </p>
                            <Button
                                onClick={() => setShowInterestSelector(true)}
                                variant="primary"
                                className="flex items-center gap-2 mx-auto"
                                disabled={addInterestMutation.isPending}
                            >
                                <Plus className="w-4 h-4" />
                                Add Your First Interest
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Interest Selector Modal */}
            {showInterestSelector && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                        <div className="p-6 border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-semibold text-slate-900">Add New Interest</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowInterestSelector(false)}
                                    disabled={addInterestMutation.isPending}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-6">
                            <InterestSelector
                                onAdd={handleAddInterest}
                                onCancel={() => setShowInterestSelector(false)}
                                disabled={addInterestMutation.isPending}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const renderPreferencesTab = () => {
        // Toggle component
        const Toggle = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) => (
            <button
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${checked ? 'bg-green-600' : 'bg-slate-200'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        );

        return (
            <div className="space-y-6">
                {/* Notifications */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                            <Bell className="w-5 h-5" />
                            Notifications
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">New Content Alerts</div>
                                    <div className="text-sm text-slate-600">Get notified when new relevant content is available</div>
                                </div>
                                <Toggle
                                    checked={preferences.notifications.newContent}
                                    onChange={(value) => handlePreferenceToggle('notifications', 'newContent', value)}
                                    disabled={updatePreferencesMutation.isPending}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">Weekly Digest</div>
                                    <div className="text-sm text-slate-600">Receive a weekly summary of your feed</div>
                                </div>
                                <Toggle
                                    checked={preferences.notifications.weeklyDigest}
                                    onChange={(value) => handlePreferenceToggle('notifications', 'weeklyDigest', value)}
                                    disabled={updatePreferencesMutation.isPending}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">Recommendations</div>
                                    <div className="text-sm text-slate-600">Get personalized content suggestions</div>
                                </div>
                                <Toggle
                                    checked={preferences.notifications.recommendations}
                                    onChange={(value) => handlePreferenceToggle('notifications', 'recommendations', value)}
                                    disabled={updatePreferencesMutation.isPending}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">Social Updates</div>
                                    <div className="text-sm text-slate-600">Updates from connected social accounts</div>
                                </div>
                                <Toggle
                                    checked={preferences.notifications.socialUpdates}
                                    onChange={(value) => handlePreferenceToggle('notifications', 'socialUpdates', value)}
                                    disabled={updatePreferencesMutation.isPending}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Display Preferences */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                            <Palette className="w-5 h-5" />
                            Display
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">Theme</div>
                                    <div className="text-sm text-slate-600">Choose your preferred theme</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePreferenceToggle('display', 'theme', 'light')}
                                        className={`p-2 rounded-lg transition-all ${preferences.display.theme === 'light'
                                                ? 'bg-yellow-100 text-yellow-700 ring-2 ring-yellow-500'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        <Sun className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePreferenceToggle('display', 'theme', 'dark')}
                                        className={`p-2 rounded-lg transition-all ${preferences.display.theme === 'dark'
                                                ? 'bg-slate-800 text-slate-100 ring-2 ring-slate-600'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        <Moon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">Default View Mode</div>
                                    <div className="text-sm text-slate-600">How content is displayed by default</div>
                                </div>
                                <select
                                    value={preferences.display.viewMode}
                                    onChange={(e) => handlePreferenceToggle('display', 'viewMode', e.target.value)}
                                    className="px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 focus:border-slate-500 focus:ring-1 focus:ring-slate-500"
                                >
                                    <option value="grid">Grid View</option>
                                    <option value="list">List View</option>
                                    <option value="compact">Compact View</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">Compact Mode</div>
                                    <div className="text-sm text-slate-600">Show more content with less spacing</div>
                                </div>
                                <Toggle
                                    checked={preferences.display.compactMode}
                                    onChange={(value) => handlePreferenceToggle('display', 'compactMode', value)}
                                    disabled={updatePreferencesMutation.isPending}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Audio/Sound Preferences */}
                <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                    <CardContent className="p-8">
                        <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                            <Volume2 className="w-5 h-5" />
                            Audio
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-slate-900">Sound Effects</div>
                                    <div className="text-sm text-slate-600">Play sounds for notifications and interactions</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handlePreferenceToggle('audio', 'soundEffects', true)}
                                        className={`p-2 rounded-lg transition-all ${preferences.audio?.soundEffects !== false
                                                ? 'bg-green-100 text-green-700 ring-2 ring-green-500'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        <Volume2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handlePreferenceToggle('audio', 'soundEffects', false)}
                                        className={`p-2 rounded-lg transition-all ${preferences.audio?.soundEffects === false
                                                ? 'bg-red-100 text-red-700 ring-2 ring-red-500'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                            }`}
                                    >
                                        <VolumeX className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    };

    const renderPrivacyTab = () => (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                        <Shield className="w-5 h-5" />
                        Privacy Settings
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-slate-900">Data Collection</div>
                                <div className="text-sm text-slate-600">Allow collection of usage data to improve recommendations</div>
                            </div>
                            <Button variant="secondary" size="sm">Manage</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderConnectionsTab = () => (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                        <Youtube className="w-5 h-5" />
                        Connected Accounts
                    </h3>
                    <YouTubeOAuthSection />
                </CardContent>
            </Card>
        </div>
    );

    return (
        <ErrorBoundary>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-stone-50">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-16 z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            You
                        </h1>
                        <p className="text-slate-600 mt-2">
                            Manage your profile, interests, preferences, and account settings
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:w-64 flex-shrink-0">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${activeTab === tab.id
                                                ? 'bg-slate-100 text-slate-700 font-semibold'
                                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-700'
                                                }`}
                                        >
                                            <Icon size={20} />
                                            {tab.name}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="flex-1">
                            {activeTab === 'profile' && renderProfileTab()}
                            {activeTab === 'interests' && renderInterestsTab()}
                            {activeTab === 'preferences' && renderPreferencesTab()}
                            {activeTab === 'privacy' && renderPrivacyTab()}
                            {activeTab === 'connections' && renderConnectionsTab()}
                        </div>
                    </div>
                </div>
            </div>
        </ErrorBoundary>
    );
};
