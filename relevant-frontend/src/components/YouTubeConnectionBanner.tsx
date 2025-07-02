import React from 'react';
import { CheckCircle, Youtube } from 'lucide-react';
import { Button } from './ui/Button';

interface YouTubeConnectionBannerProps {
  channelTitle?: string;
  onSync?: () => void;
  isSyncing?: boolean;
}

export const YouTubeConnectionBanner: React.FC<YouTubeConnectionBannerProps> = ({
  channelTitle,
  onSync,
  isSyncing = false,
}) => {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <Youtube className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-green-800">
              YouTube Connected
            </h3>
            <p className="text-sm text-green-700">
              {channelTitle ? `Connected to ${channelTitle}` : 'Your YouTube account is connected'}
              {' • '}Subscriptions will be automatically synced.
            </p>
          </div>
        </div>
        
        {onSync && (
          <Button
            onClick={onSync}
            disabled={isSyncing}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        )}
      </div>
    </div>
  );
};
