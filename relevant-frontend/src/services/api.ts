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
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers['x-auth-token'] = token;
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
}

export const apiService = new ApiService();
export default apiService;
