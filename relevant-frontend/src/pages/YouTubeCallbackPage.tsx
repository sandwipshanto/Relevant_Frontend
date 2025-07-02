import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import apiService from '../services/api';
import { LoadingSpinner } from '../components/ui/Loading';

export const YouTubeCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        toast.error('YouTube authorization was cancelled or failed');
        navigate('/settings');
        return;
      }

      if (!code) {
        toast.error('No authorization code received');
        navigate('/settings');
        return;
      }

      try {
        const response = await apiService.handleYouTubeCallback(code);
        if (response.success) {
          toast.success('YouTube account connected successfully!');
          // Redirect with success parameter to trigger status refresh
          navigate('/settings?youtube_connected=true');
        } else {
          toast.error('Failed to connect YouTube account');
          navigate('/settings');
        }
      } catch (error) {
        console.error('YouTube callback error:', error);
        toast.error('Failed to connect YouTube account');
        navigate('/settings');
      } finally {
        setIsProcessing(false);
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-lg text-gray-600">
          {isProcessing ? 'Connecting your YouTube account...' : 'Redirecting...'}
        </p>
      </div>
    </div>
  );
};
