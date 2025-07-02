import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import apiService from '../services/api';

interface YouTubeConnectionStatus {
  connected: boolean;
  channelTitle?: string;
  isLoading: boolean;
  error?: string;
}

export const useYouTubeOAuth = () => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<YouTubeConnectionStatus>({
    connected: false,
    isLoading: true,
  });

  const fetchStatus = async () => {
    try {
      setStatus(prev => ({ ...prev, isLoading: true, error: undefined }));
      const response = await apiService.getYouTubeConnectionStatus();
      
      if (response.success) {
        setStatus({
          connected: response.connected,
          channelTitle: response.channelTitle,
          isLoading: false,
        });
      } else {
        setStatus(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to fetch connection status',
        }));
      }
    } catch (error) {
      console.error('Failed to fetch YouTube connection status:', error);
      setStatus(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch connection status',
      }));
    }
  };

  const connect = async (): Promise<boolean> => {
    try {
      const response = await apiService.getYouTubeAuthUrl();
      if (response.success) {
        window.location.href = response.authUrl;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to get YouTube auth URL:', error);
      return false;
    }
  };

  const disconnect = async (): Promise<boolean> => {
    try {
      const response = await apiService.disconnectYouTube();
      if (response.success) {
        setStatus(prev => ({ ...prev, connected: false, channelTitle: undefined }));
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to disconnect YouTube:', error);
      return false;
    }
  };

  const syncSubscriptions = async (): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await apiService.syncYouTubeSubscriptions();
      if (response.success) {
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        return { success: true, message: response.msg };
      }
      return { success: false, message: 'Failed to sync subscriptions' };
    } catch (error) {
      console.error('Failed to sync YouTube subscriptions:', error);
      return { success: false, message: 'Failed to sync subscriptions' };
    }
  };

  // Listen for URL changes to check if user completed OAuth flow
  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('youtube_connected') === 'true') {
        fetchStatus();
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    // Check on mount
    checkUrlParams();

    // Listen for popstate events
    window.addEventListener('popstate', checkUrlParams);
    
    // Also listen for focus in case user completed OAuth in a popup
    const handleFocus = () => {
      setTimeout(checkUrlParams, 1000); // Delay to allow URL to update
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('popstate', checkUrlParams);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  useEffect(() => {
    fetchStatus();
  }, []);

  return {
    status,
    connect,
    disconnect,
    syncSubscriptions,
    refreshStatus: fetchStatus,
  };
};
