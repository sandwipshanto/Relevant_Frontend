import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
    User, Settings, Bell, Shield, Youtube, BookOpen, TrendingUp, 
    Calendar, Edit3, X, Eye, Heart
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { YouTubeOAuthSection } from '../components/features/YouTubeOAuthSection';

export const YouPage: React.FC = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);

    // User stats query
    const {
        data: userStats,
        isLoading: isStatsLoading
    } = useQuery({
        queryKey: ['userStats'],
        queryFn: () => apiService.getUserStats(),
        enabled: !!user
    });

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
            value: 0, // This would need to be tracked separately
            icon: Eye,
            color: 'blue'
        },
        { 
            label: 'Items Saved', 
            value: 0, // This would need to be tracked separately
            icon: Heart,
            color: 'red'
        },
        { 
            label: 'Interests', 
            value: userStats?.stats?.totalInterests || 0, 
            icon: BookOpen,
            color: 'green'
        },
        { 
            label: 'YouTube Sources', 
            value: userStats?.stats?.totalYoutubeSources || 0, 
            icon: Calendar,
            color: 'purple'
        }
    ];

    const renderProfileTab = () => (
        <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-slate-200/50">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {user?.name || 'Your Profile'}
                            </h2>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                                className="text-slate-600 hover:text-slate-800"
                            >
                                {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                            </Button>
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
                    
                    return (
                        <Card key={stat.label} className="bg-white/60 backdrop-blur-sm border-slate-200/50">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-slate-900">
                                            {isStatsLoading ? '-' : stat.value}
                                        </div>
                                        <div className="text-sm text-slate-600">{stat.label}</div>
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
                        <TrendingUp className="w-5 h-5" />
                        Recent Activity
                    </h3>
                    <div className="space-y-4">
                        {isStatsLoading ? (
                            <>
                                <LoadingSkeleton count={3} viewMode="list" />
                            </>
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                Activity tracking will appear here as you use the platform
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );

    const renderInterestsTab = () => (
        <div className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                        <BookOpen className="w-5 h-5" />
                        Your Interests
                    </h3>
                    
                    {user?.interests ? (
                        <div className="space-y-6">
                            {typeof user.interests === 'object' && !Array.isArray(user.interests) ? (
                                // Hierarchical interests
                                Object.entries(user.interests).map(([category, data]: [string, any]) => (
                                    <div key={category} className="bg-slate-50/80 rounded-xl p-6 border border-slate-200/30">
                                        <h5 className="font-semibold text-slate-900 capitalize mb-2">
                                            {category.replace(/([A-Z])/g, ' $1').trim()}
                                        </h5>
                                        {data.keywords && data.keywords.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
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
                            <Button variant="primary">
                                Add Your First Interest
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );

    const renderPreferencesTab = () => (
        <div className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/50">
                <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-3">
                        <Bell className="w-5 h-5" />
                        Notifications
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-slate-900">New Content Alerts</div>
                                <div className="text-sm text-slate-600">Get notified when new relevant content is available</div>
                            </div>
                            <Button variant="secondary" size="sm">Enable</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );

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
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                                                activeTab === tab.id
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
