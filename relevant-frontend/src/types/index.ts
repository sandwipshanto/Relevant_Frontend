// API Response Types
export interface ApiResponse<T = any> {
    success: boolean;
    msg?: string;
    data?: T;
}

// User Types
export interface User {
    _id: string;
    email: string;
    name: string;
    interests: HierarchicalInterests | string[];
    youtubeSources: YouTubeSource[];
    preferences: UserPreferences;
    lastActive: string;
    createdAt: string;
    youtubeConnection?: YouTubeConnection;
}

export interface YouTubeConnection {
    connected: boolean;
    channelId?: string;
    channelTitle?: string;
    accessToken?: string;
    refreshToken?: string;
    connectedAt?: string;
    lastSyncAt?: string;
}

export interface YouTubeSource {
    channelId: string;
    channelTitle: string;
    channelUrl?: string;
    addedAt: string;
}

export interface UserPreferences {
    emailNotifications: boolean;
    contentLanguage: string;
    feedFrequency: 'daily' | 'weekly' | 'realtime';
    contentFrequency?: 'realtime' | 'daily' | 'weekly';
    maxContentPerDay?: number;
    relevanceThreshold?: number;
}

// Hierarchical Interests Types
export interface HierarchicalInterests {
    [category: string]: {
        priority: number;
        subcategories?: {
            [subcategory: string]: {
                priority: number;
                keywords: string[];
            };
        };
        keywords: string[];
    };
}

export interface InterestCategory {
    category: string;
    priority: number;
    keywords: string[];
}

export interface InterestSubcategory {
    category: string;
    subcategory: string;
    priority: number;
    keywords: string[];
}

export interface UserStats {
    totalInterests: number;
    totalYoutubeSources: number;
    memberSince: string;
    lastActive: string;
}

// Content Types
export interface Content {
    _id: string;
    title: string;
    description: string;
    url: string;
    source: 'youtube' | 'rss' | 'web' | 'article';
    sourceId: string;
    sourceChannel: {
        id: string;
        name: string;
    };
    thumbnail: string;
    publishedAt: string;
    duration: number;
    tags: string[];
    category: string;
    summary: string;
    highlights: string[];
    keyPoints: string[];
    relevantTopics: string[];
    processed: boolean;
    createdAt: string;
}

export interface UserContent {
    _id: string;
    userId: string;
    contentId: string;
    relevanceScore: number;
    matchedInterests: string[];
    personalizedSummary: string;
    personalizedHighlights: string[];
    viewed: boolean;
    viewedAt?: string;
    liked: boolean;
    saved: boolean;
    dismissed: boolean;
    createdAt: string;
}

export interface ContentWithUserData extends Content {
    userContent?: UserContent;
}

export interface Pagination {
    currentPage: number;
    totalItems: number;
    hasMore: boolean;
}

// Additional Content Types
export interface ContentHighlights {
    highlights: string[];
    segments: Array<{
        timestamp: number;
        text: string;
        relevance: number;
    }>;
}

export interface SearchResults {
    results: ContentWithUserData[];
    pagination: Pagination;
    query: string;
}

export interface ProcessingStatus {
    activeJobs: number;
    queuedJobs: number;
    lastUpdate: string;
}

// Form Types
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    email: string;
    password: string;
    name?: string;
}

export interface InterestsForm {
    interests: HierarchicalInterests;
}

export interface YouTubeChannelForm {
    channelId: string;
    channelTitle: string;
    channelUrl?: string;
}

export interface PreferencesForm {
    emailNotifications: boolean;
    contentLanguage: string;
    feedFrequency: 'daily' | 'weekly' | 'realtime';
}

// Auth Types
export interface AuthResponse {
    success: boolean;
    token: string;
    user: User;
}

export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    loading: boolean;
}

// API Query Parameters
export interface FeedQueryParams {
    page?: number;
    limit?: number;
    minRelevance?: number;
}

export interface SavedContentQueryParams {
    page?: number;
    limit?: number;
}

// YouTube OAuth Types
export interface YouTubeAuthUrlResponse {
    success: boolean;
    authUrl: string;
}

export interface YouTubeCallbackResponse {
    success: boolean;
    msg: string;
}

export interface YouTubeConnectionStatusResponse {
    success: boolean;
    connected: boolean;
    channelTitle?: string;
    channelId?: string;
}

export interface YouTubeSyncResponse {
    success: boolean;
    msg: string;
    subscriptionsAdded?: number;
}

export interface YouTubeDisconnectResponse {
    success: boolean;
    msg: string;
}
