import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, User, Calendar, TrendingUp, Zap, Clock, DollarSign } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/Loading';
import { apiService } from '../services/api';
import type { UserStats } from '../types';

export const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<UserStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await apiService.getUserStats();
                if (response.success) {
                    setStats(response.stats);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const quickActions = [
        {
            title: 'View Feed',
            description: 'Discover new personalized content',
            href: '/feed',
            icon: BookOpen,
            color: 'bg-blue-500',
        },
        {
            title: 'Manage Profile',
            description: 'Update interests and preferences',
            href: '/profile',
            icon: User,
            color: 'bg-purple-500',
        },
        {
            title: 'Saved Content',
            description: 'Access your saved articles',
            href: '/saved',
            icon: Heart,
            color: 'bg-red-500',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name || 'there'}!
                </h1>
                <p className="mt-2 text-gray-600">
                    Here's what's happening with your personalized content feed.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i}>
                            <CardContent className="p-6">
                                <LoadingSpinner />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <TrendingUp className="h-8 w-8 text-primary-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Interests</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats?.totalInterests || (typeof user?.interests === 'object' && !Array.isArray(user?.interests) ? Object.keys(user.interests).length : Array.isArray(user?.interests) ? user.interests.length : 0)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <BookOpen className="h-8 w-8 text-red-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">YouTube Sources</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats?.totalYoutubeSources || user?.youtubeSources?.length || 0}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Calendar className="h-8 w-8 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Member Since</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats?.memberSince ? new Date(stats.memberSince).toLocaleDateString() : 'Recently'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Heart className="h-8 w-8 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">Last Active</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats?.lastActive ? new Date(stats.lastActive).toLocaleDateString() : 'Today'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quickActions.map((action) => (
                        <Link key={action.title} to={action.href}>
                            <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                <CardContent className="p-6">
                                    <div className="flex items-center">
                                        <div className={`flex-shrink-0 p-3 rounded-lg ${action.color}`}>
                                            <action.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-lg font-medium text-gray-900">{action.title}</h3>
                                            <p className="text-sm text-gray-600">{action.description}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Smart Processing Information */}
            <div className="mb-8">
                <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                    <CardHeader>
                        <CardTitle className="text-green-900 flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Smart Daily Content Processing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-green-800 mb-4">
                            Your content is now processed more efficiently with our anti-duplicate system that runs automatically every day at 6 AM UTC.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                                <div className="flex-shrink-0">
                                    <Clock className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-900 text-sm">Daily Processing</p>
                                    <p className="text-xs text-green-700">Only new content analyzed</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                                <div className="flex-shrink-0">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-900 text-sm">85-95% Cost Reduction</p>
                                    <p className="text-xs text-green-700">Smart AI processing pipeline</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                                <div className="flex-shrink-0">
                                    <Zap className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-green-900 text-sm">No Duplicates</p>
                                    <p className="text-xs text-green-700">Each content analyzed once</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link to="/settings">
                                <Button variant="secondary" className="bg-green-600 text-white hover:bg-green-700 border-green-600">
                                    Manual Processing
                                </Button>
                            </Link>
                            <Link to="/feed">
                                <Button variant="secondary">
                                    View Your Feed
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Getting Started */}
            {(!user?.interests?.length || !user?.youtubeSources?.length) && (
                <Card className="bg-primary-50 border-primary-200">
                    <CardHeader>
                        <CardTitle className="text-primary-900">Get Started</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-primary-800 mb-4">
                            To get the most out of Relevant, make sure to set up your profile:
                        </p>
                        <div className="space-y-2 mb-4">
                            {!user?.interests?.length && (
                                <p className="text-sm text-primary-700">• Add your interests to get personalized content</p>
                            )}
                            {!user?.youtubeSources?.length && (
                                <p className="text-sm text-primary-700">• Connect YouTube channels you follow</p>
                            )}
                        </div>
                        <Link to="/profile">
                            <Button variant="primary">Complete Profile Setup</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
