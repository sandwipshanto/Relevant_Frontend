import axios from 'axios';
import type { AxiosInstance, AxiosError } from 'axios';
import type {
    AuthResponse,
    User,
    UserStats,
    Content,
    ContentWithUserData,
    UserContent,
    Pagination,
    LoginForm,
    RegisterForm,
    InterestsForm,
    YouTubeChannelForm,
    PreferencesForm,
    FeedQueryParams,
    SavedContentQueryParams
} from '../types';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: 'http://localhost:5000',
            headers: {
                'Content-Type': 'application/json',
            },
        });        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async register(data: RegisterForm): Promise<AuthResponse> {
        const response = await this.api.post('/api/auth/register', data);
        return response.data;
    }

    async login(data: LoginForm): Promise<AuthResponse> {
        const response = await this.api.post('/api/auth/login', data);
        return response.data;
    }

    async getCurrentUser(): Promise<{ success: boolean; user: User }> {
        const response = await this.api.get('/api/auth/me');
        return response.data;
    }

    // User management endpoints
    async getUserProfile(): Promise<{ success: boolean; user: User }> {
        const response = await this.api.get('/api/user/profile');
        return response.data;
    }

    async updateInterests(data: InterestsForm): Promise<{ success: boolean; user: User; msg: string }> {
        const response = await this.api.put('/api/user/interests', data);
        return response.data;
    }

    async addYouTubeChannel(data: YouTubeChannelForm): Promise<{ success: boolean; youtubeSources: any[]; msg: string }> {
        const response = await this.api.post('/api/user/youtube-sources', data);
        return response.data;
    }

    async removeYouTubeChannel(channelId: string): Promise<{ success: boolean; youtubeSources: any[]; msg: string }> {
        const response = await this.api.delete(`/api/user/youtube-sources/${channelId}`);
        return response.data;
    }

    async updatePreferences(data: PreferencesForm): Promise<{ success: boolean; user: User; msg: string }> {
        const response = await this.api.put('/api/user/preferences', data);
        return response.data;
    }

    async getUserStats(): Promise<{ success: boolean; stats: UserStats }> {
        const response = await this.api.get('/api/user/stats');
        return response.data;
    }

    // Content endpoints
    async getContentFeed(params: FeedQueryParams = {}): Promise<{ success: boolean; content: ContentWithUserData[]; pagination: Pagination }> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.minRelevance) queryParams.append('minRelevance', params.minRelevance.toString());

        const response = await this.api.get(`/api/content/feed?${queryParams.toString()}`);
        return response.data;
    }

    async getContent(id: string): Promise<{ success: boolean; content: Content; userContent: UserContent }> {
        const response = await this.api.get(`/api/content/${id}`);
        return response.data;
    }

    async markContentAsViewed(id: string): Promise<{ success: boolean; userContent: UserContent }> {
        const response = await this.api.post(`/api/content/${id}/view`);
        return response.data;
    }

    async toggleContentLike(id: string, liked: boolean): Promise<{ success: boolean; userContent: UserContent }> {
        const response = await this.api.post(`/api/content/${id}/like`, { liked });
        return response.data;
    }

    async toggleContentSave(id: string, saved: boolean): Promise<{ success: boolean; userContent: UserContent }> {
        const response = await this.api.post(`/api/content/${id}/save`, { saved });
        return response.data;
    }

    async dismissContent(id: string): Promise<{ success: boolean; userContent: UserContent }> {
        const response = await this.api.post(`/api/content/${id}/dismiss`);
        return response.data;
    }

    async getSavedContent(params: SavedContentQueryParams = {}): Promise<{ success: boolean; content: ContentWithUserData[]; pagination: Pagination }> {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());

        const response = await this.api.get(`/api/content/saved/list?${queryParams.toString()}`);
        return response.data;
    }

    // Additional content endpoints
    async searchContent(query: string, page: number = 1, limit: number = 10): Promise<{ success: boolean; results: ContentWithUserData[]; pagination: Pagination }> {
        const response = await this.api.get(`/api/content/search/${encodeURIComponent(query)}?page=${page}&limit=${limit}`);
        return response.data;
    }

    async getContentHighlights(id: string): Promise<{ success: boolean; highlights: string[]; segments: any[] }> {
        const response = await this.api.get(`/api/content/${id}/highlights`);
        return response.data;
    }

    async processSubscriptions(): Promise<{ success: boolean; msg: string }> {
        const response = await this.api.post('/api/content/process-subscriptions');
        return response.data;
    }

    // Diagnostic endpoints
    async testConnection(): Promise<{ success: boolean; msg: string }> {
        const response = await this.api.get('/api/health');
        return response.data;
    }

    async debugFeed(): Promise<any> {
        try {
            const response = await this.api.get('/api/content/feed/debug');
            return response.data;
        } catch (error) {
            console.error('Debug feed error:', error);
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
        }
    }

    async processVideo(videoId: string): Promise<{ success: boolean; msg: string }> {
        const response = await this.api.post('/api/content/process-video', { videoId });
        return response.data;
    }

    async getProcessingStatus(): Promise<{ success: boolean; activeJobs: number; queuedJobs: number }> {
        const response = await this.api.get('/api/content/processing/status');
        return response.data;
    }

    // Hierarchical interests endpoints
    async updateHierarchicalInterests(interests: any): Promise<{ success: boolean; user: User; msg: string }> {
        const response = await this.api.put('/api/user/interests/hierarchical', { interests });
        return response.data;
    }

    async addInterestCategory(data: { category: string; priority: number; keywords: string[] }): Promise<{ success: boolean; user: User; msg: string }> {
        const response = await this.api.post('/api/user/interests/category', data);
        return response.data;
    }

    async addInterestSubcategory(data: { category: string; subcategory: string; priority: number; keywords: string[] }): Promise<{ success: boolean; user: User; msg: string }> {
        const response = await this.api.post('/api/user/interests/subcategory', data);
        return response.data;
    }

    async deleteInterestCategory(category: string): Promise<{ success: boolean; user: User; msg: string }> {
        const response = await this.api.delete(`/api/user/interests/category/${encodeURIComponent(category)}`);
        return response.data;
    }

    async deleteInterestSubcategory(category: string, subcategory: string): Promise<{ success: boolean; user: User; msg: string }> {
        const response = await this.api.delete(`/api/user/interests/subcategory/${encodeURIComponent(category)}/${encodeURIComponent(subcategory)}`);
        return response.data;
    }

    // Admin endpoints  
    async getAdminJobStatus(): Promise<{ success: boolean; queueStats: any; cronStatus: any }> {
        const response = await this.api.get('/api/admin/jobs/status');
        return response.data;
    }

    async triggerChannelMonitoring(): Promise<{ success: boolean; msg: string }> {
        const response = await this.api.post('/api/admin/trigger/channel-monitoring');
        return response.data;
    }

    async getAIStats(): Promise<{ success: boolean; stats: any }> {
        const response = await this.api.get('/api/admin/ai/stats');
        return response.data;
    }

    async updateAIConfig(config: any): Promise<{ success: boolean; msg: string; newConfig: any }> {
        const response = await this.api.put('/api/admin/ai/config', config);
        return response.data;
    }
}

export const apiService = new ApiService();
export default apiService;
