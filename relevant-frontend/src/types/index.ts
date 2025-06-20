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
    interests: string[];
    youtubeSources: YouTubeSource[];
    preferences: UserPreferences;
    lastActive: string;
    createdAt: string;
}

export interface YouTubeSource {
    channelId: string;
    channelName: string;
    channelUrl?: string;
    addedAt: string;
}

export interface UserPreferences {
    contentFrequency: 'realtime' | 'daily' | 'weekly';
    maxContentPerDay: number;
    relevanceThreshold: number;
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
    interests: string[];
}

export interface YouTubeChannelForm {
    channelId: string;
    channelName: string;
    channelUrl?: string;
}

export interface PreferencesForm {
    contentFrequency: 'realtime' | 'daily' | 'weekly';
    maxContentPerDay: number;
    relevanceThreshold: number;
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
