import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Bell, Globe, RefreshCw, Activity, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/Loading';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { YouTubeOAuthSection } from '../components/features/YouTubeOAuthSection';
import type { PreferencesForm } from '../types';

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const [preferences, setPreferences] = useState<PreferencesForm>({
        emailNotifications: true,
        contentLanguage: 'en',
        feedFrequency: 'daily'
    });

    const [processingStatus, setProcessingStatus] = useState<any>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    // Get user profile to load current preferences
    const {
        data: profileData,
        isLoading: profileLoading
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: () => apiService.getUserProfile()
    });

    // Get processing status
    const {
        data: statusData,
        refetch: refetchStatus
    } = useQuery({
        queryKey: ['processingStatus'],
        queryFn: () => apiService.getProcessingStatus(),
        refetchInterval: 5000 // Refresh every 5 seconds
    });

    // Load preferences when profile data is available
    useEffect(() => {
        if (profileData?.user?.preferences) {
            const userPrefs = profileData.user.preferences;
            setPreferences({
                emailNotifications: userPrefs.emailNotifications ?? true,
                contentLanguage: userPrefs.contentLanguage ?? 'en',
                feedFrequency: userPrefs.feedFrequency ?? 'daily'
            });
        }
    }, [profileData]);

    // Update processing status
    useEffect(() => {
        if (statusData) {
            console.log('Processing status data:', statusData);
            console.log('ActiveJobs type:', typeof statusData.activeJobs, 'Value:', statusData.activeJobs);
            console.log('QueuedJobs type:', typeof statusData.queuedJobs, 'Value:', statusData.queuedJobs);
            setProcessingStatus(statusData);
        }
    }, [statusData]);

    // Mutations
    const updatePreferencesMutation = useMutation({
        mutationFn: (data: PreferencesForm) => apiService.updatePreferences(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            toast.success('Preferences updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to update preferences');
        }
    });

    const processSubscriptionsMutation = useMutation({
        mutationFn: () => apiService.processSubscriptions(),
        onSuccess: () => {
            toast.success('Processing started! All subscriptions will be analyzed.');
            setIsProcessing(true);
            refetchStatus();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to start full processing');
        }
    });

    const processTodaysContentMutation = useMutation({
        mutationFn: () => apiService.processTodaysContent(),
        onSuccess: () => {
            toast.success('Processing started! New content will be analyzed.');
            setIsProcessing(true);
            refetchStatus();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.msg || 'Failed to start today\'s content processing');
        }
    });

    const handleSavePreferences = () => {
        updatePreferencesMutation.mutate(preferences);
    };

    const handleProcessSubscriptions = () => {
        processSubscriptionsMutation.mutate();
    };

    const handleProcessTodaysContent = () => {
        processTodaysContentMutation.mutate();
    };

    const handlePreferenceChange = (key: keyof PreferencesForm, value: any) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
    };

    // Helper function to safely get numeric values from processing status
    const getJobCount = (value: any): number => {
        if (typeof value === 'number') return value;
        if (Array.isArray(value)) return value.length;
        return 0;
    };

    if (profileLoading) {
        return (
            <div className="flex justify-center items-center min-h-96">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
                <p className="text-gray-600">Manage your account preferences and content processing</p>
            </div>

            <div className="space-y-8">
                {/* User Preferences */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Content Preferences
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Email Notifications */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-gray-500" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Email Notifications</h3>
                                    <p className="text-sm text-gray-600">Receive email updates about new content</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.emailNotifications}
                                    onChange={(e) => handlePreferenceChange('emailNotifications', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Content Language */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Globe className="h-5 w-5 text-gray-500" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Content Language</h3>
                                    <p className="text-sm text-gray-600">Preferred language for content</p>
                                </div>
                            </div>
                            <select
                                value={preferences.contentLanguage}
                                onChange={(e) => handlePreferenceChange('contentLanguage', e.target.value)}
                                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                                <option value="it">Italian</option>
                                <option value="pt">Portuguese</option>
                            </select>
                        </div>

                        {/* Feed Frequency */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <RefreshCw className="h-5 w-5 text-gray-500" />
                                <div>
                                    <h3 className="font-medium text-gray-900">Feed Update Frequency</h3>
                                    <p className="text-sm text-gray-600">How often to check for new content</p>
                                </div>
                            </div>
                            <select
                                value={preferences.feedFrequency}
                                onChange={(e) => handlePreferenceChange('feedFrequency', e.target.value as 'daily' | 'weekly' | 'realtime')}
                                className="border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="realtime">Real-time</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                            </select>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4 border-t">
                            <Button
                                onClick={handleSavePreferences}
                                disabled={updatePreferencesMutation.isPending}
                            >
                                {updatePreferencesMutation.isPending ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        <span className="ml-2">Saving...</span>
                                    </>
                                ) : (
                                    'Save Preferences'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* YouTube Integration */}
                <YouTubeOAuthSection />

                {/* Content Processing Status */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5" />
                            Content Processing
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Processing Status */}
                        <ErrorBoundary fallback={
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-red-600 text-sm">Failed to load processing status</p>
                            </div>
                        }>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="font-medium text-gray-900 mb-3">Current Status</h3>
                                {processingStatus ? (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Active Jobs:</span>
                                            <span className="font-medium">
                                                {getJobCount(processingStatus.activeJobs)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Queued Jobs:</span>
                                            <span className="font-medium">
                                                {getJobCount(processingStatus.queuedJobs)}
                                            </span>
                                        </div>
                                        {processingStatus.lastUpdate && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Last Update:</span>
                                                <span className="font-medium text-xs">
                                                    {typeof processingStatus.lastUpdate === 'string' ?
                                                        new Date(processingStatus.lastUpdate).toLocaleString() :
                                                        'Invalid date'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-gray-600 text-sm">Loading status...</p>
                                )}
                            </div>
                        </ErrorBoundary>

                        {/* Manual Processing */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Content Processing</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Process your YouTube subscriptions to find new relevant content. Choose between daily processing (recommended) or full analysis.
                                </p>

                                {/* Daily Processing (Recommended) */}
                                <div className="space-y-3">
                                    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                                        <div className="flex items-start gap-2 mb-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-green-900 mb-1">Daily Processing (Recommended)</h4>
                                                <p className="text-sm text-green-700 mb-3">
                                                    Process only today's new content. Efficient and cost-effective with anti-duplicate protection.
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleProcessTodaysContent}
                                            disabled={processTodaysContentMutation.isPending || processSubscriptionsMutation.isPending || isProcessing}
                                            variant="secondary"
                                            className="bg-green-600 text-white hover:bg-green-700 border-green-600"
                                        >
                                            {processTodaysContentMutation.isPending ? (
                                                <>
                                                    <LoadingSpinner size="sm" />
                                                    <span className="ml-2">Starting...</span>
                                                </>
                                            ) : isProcessing ? (
                                                <>
                                                    <Activity className="h-4 w-4 mr-2 animate-pulse" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Process Today's Content
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Full Processing */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start gap-2 mb-3">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <div className="h-2 w-2 bg-gray-400 rounded-full"></div>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-1">Full Processing</h4>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    Process all content from subscriptions. Use only when needed (e.g., first setup, debugging).
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            onClick={handleProcessSubscriptions}
                                            disabled={processSubscriptionsMutation.isPending || processTodaysContentMutation.isPending || isProcessing}
                                            variant="secondary"
                                        >
                                            {processSubscriptionsMutation.isPending ? (
                                                <>
                                                    <LoadingSpinner size="sm" />
                                                    <span className="ml-2">Starting...</span>
                                                </>
                                            ) : isProcessing ? (
                                                <>
                                                    <Activity className="h-4 w-4 mr-2 animate-pulse" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                    Full Processing
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Processing Info */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <h4 className="font-medium mb-1">How Content Processing Works</h4>
                                        <ul className="space-y-1 text-blue-700">
                                            <li>• <strong>Daily Processing:</strong> Analyzes only new content published today (prevents duplicates)</li>
                                            <li>• <strong>Smart Filtering:</strong> Uses AI to analyze content relevance efficiently</li>
                                            <li>• <strong>Cost Optimization:</strong> Multi-stage analysis minimizes AI costs by 85-95%</li>
                                            <li>• <strong>Interest Matching:</strong> Filters content based on your interests and keywords</li>
                                            <li>• <strong>Real-time Updates:</strong> Updates your personalized feed with relevant content</li>
                                        </ul>
                                        <p className="mt-2 text-xs text-blue-600">
                                            💡 <strong>Tip:</strong> Use "Daily Processing" for regular updates. It automatically runs at 6 AM UTC daily and only processes new content.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-medium text-gray-700">Email:</span>
                                <p className="text-gray-900">{user?.email}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Name:</span>
                                <p className="text-gray-900">{user?.name || 'Not set'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Member Since:</span>
                                <p className="text-gray-900">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                            </div>
                            <div>
                                <span className="font-medium text-gray-700">Last Active:</span>
                                <p className="text-gray-900">{user?.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Unknown'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
