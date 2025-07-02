import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from './ui/Button';
import { LoadingSpinner } from './ui/Loading';
import { useYouTubeOAuth } from '../hooks/useYouTubeOAuth';

export const YouTubeOAuthSection: React.FC = () => {
  const { status, connect, disconnect, syncSubscriptions } = useYouTubeOAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await connect();
      if (!success) {
        toast.error('Failed to get YouTube authorization URL');
      }
    } catch (error) {
      console.error('Failed to connect to YouTube:', error);
      toast.error('Failed to connect to YouTube');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await syncSubscriptions();
      if (result.success) {
        toast.success(result.message || 'Subscriptions synced successfully!');
      } else {
        toast.error(result.message || 'Failed to sync YouTube subscriptions');
      }
    } catch (error) {
      console.error('Failed to sync YouTube subscriptions:', error);
      toast.error('Failed to sync YouTube subscriptions');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      const success = await disconnect();
      if (success) {
        toast.success('YouTube account disconnected successfully');
      } else {
        toast.error('Failed to disconnect YouTube account');
      }
    } catch (error) {
      console.error('Failed to disconnect YouTube:', error);
      toast.error('Failed to disconnect YouTube account');
    } finally {
      setIsDisconnecting(false);
    }
  };

  if (status.isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">YouTube Integration</h3>
        <div className="flex justify-center py-4">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (status.error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">YouTube Integration</h3>
        <div className="text-red-600 text-sm">{status.error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">YouTube Integration</h3>
      
      {status.connected ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">
              Connected to: <span className="font-medium">{status.channelTitle}</span>
            </span>
          </div>
          
          <p className="text-sm text-gray-500">
            Your YouTube subscriptions are automatically synced and added as content sources.
          </p>
          
          <div className="flex space-x-3">
            <Button
              onClick={handleSync}
              disabled={isSyncing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSyncing ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Syncing...</span>
                </>
              ) : (
                'Sync Subscriptions'
              )}
            </Button>
            
            <Button
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              variant="secondary"
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              {isDisconnecting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Disconnecting...</span>
                </>
              ) : (
                'Disconnect'
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Not connected</span>
          </div>
          
          <p className="text-sm text-gray-500">
            Connect your YouTube account to automatically import your subscriptions as content sources.
          </p>
          
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isConnecting ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Connecting...</span>
              </>
            ) : (
              'Connect YouTube Account'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
