# YouTube OAuth Integration - Frontend Implementation

This document describes the frontend implementation of YouTube OAuth integration for automatic subscription sync.

## Features Implemented

### 1. YouTube OAuth Flow
- **Authorization URL Generation**: Gets OAuth URL from backend
- **Callback Handling**: Processes OAuth callback with authorization code
- **Error Handling**: Manages OAuth errors and user cancellations

### 2. Connection Management
- **Connection Status**: Check if YouTube account is connected
- **Connect Account**: Initiate OAuth flow to connect YouTube account
- **Disconnect Account**: Remove YouTube connection
- **Manual Sync**: Trigger manual subscription sync

### 3. UI Components

#### YouTubeOAuthSection Component
Located: `src/components/YouTubeOAuthSection.tsx`

Features:
- Display connection status (connected/not connected)
- Show connected channel name
- Connect/disconnect buttons
- Manual sync functionality
- Loading states and error handling

#### YouTubeCallbackPage Component
Located: `src/pages/YouTubeCallbackPage.tsx`

Features:
- Handle OAuth callback from YouTube
- Process authorization code
- Display loading state during processing
- Redirect to settings with success/error feedback

#### YouTubeConnectionBanner Component
Located: `src/components/YouTubeConnectionBanner.tsx`

Features:
- Show success banner when YouTube is connected
- Quick sync functionality
- Can be used on dashboard or other pages

### 4. Custom Hook

#### useYouTubeOAuth Hook
Located: `src/hooks/useYouTubeOAuth.ts`

Features:
- Manage YouTube connection state
- Handle all OAuth operations
- URL parameter detection for post-OAuth actions
- Query invalidation for data refresh

### 5. API Integration

#### Updated API Service
Located: `src/services/api.ts`

New endpoints:
- `getYouTubeAuthUrl()` - Get authorization URL
- `handleYouTubeCallback(code)` - Process OAuth callback
- `getYouTubeConnectionStatus()` - Check connection status
- `syncYouTubeSubscriptions()` - Manual sync subscriptions
- `disconnectYouTube()` - Disconnect account

### 6. Type Definitions

#### New Types Added
Located: `src/types/index.ts`

- `YouTubeConnection` - User's YouTube connection details
- `YouTubeAuthUrlResponse` - Auth URL API response
- `YouTubeCallbackResponse` - Callback API response
- `YouTubeConnectionStatusResponse` - Status API response
- `YouTubeSyncResponse` - Sync API response
- `YouTubeDisconnectResponse` - Disconnect API response

## Usage Guide

### For Users

1. **Navigate to Settings**: Go to `/settings` page
2. **Connect YouTube**: Click "Connect YouTube Account" button
3. **OAuth Flow**: Complete authorization on YouTube
4. **Return to App**: Automatically redirected back to settings
5. **Manage Connection**: Use sync/disconnect buttons as needed

### For Developers

#### Adding YouTube OAuth to a New Page

```tsx
import { YouTubeOAuthSection } from '../components/YouTubeOAuthSection';

// In your component
<YouTubeOAuthSection />
```

#### Using the Hook

```tsx
import { useYouTubeOAuth } from '../hooks/useYouTubeOAuth';

function MyComponent() {
  const { status, connect, disconnect, syncSubscriptions } = useYouTubeOAuth();
  
  return (
    <div>
      {status.connected ? (
        <p>Connected to: {status.channelTitle}</p>
      ) : (
        <button onClick={connect}>Connect YouTube</button>
      )}
    </div>
  );
}
```

#### Adding Success Banner

```tsx
import { YouTubeConnectionBanner } from '../components/YouTubeConnectionBanner';
import { useYouTubeOAuth } from '../hooks/useYouTubeOAuth';

function Dashboard() {
  const { status, syncSubscriptions } = useYouTubeOAuth();
  
  return (
    <div>
      {status.connected && (
        <YouTubeConnectionBanner
          channelTitle={status.channelTitle}
          onSync={syncSubscriptions}
        />
      )}
      {/* Rest of dashboard */}
    </div>
  );
}
```

## Backend Requirements

The frontend expects these backend endpoints:

1. `GET /api/oauth/youtube/auth-url` - Returns authorization URL
2. `POST /api/oauth/youtube/callback` - Handles OAuth callback
3. `GET /api/oauth/youtube/status` - Returns connection status
4. `POST /api/oauth/youtube/sync-subscriptions` - Manual sync
5. `DELETE /api/oauth/youtube/disconnect` - Disconnect account

## Configuration

### Environment Variables (Backend)
```env
YOUTUBE_CLIENT_ID=your_client_id_here
YOUTUBE_CLIENT_SECRET=your_client_secret_here
YOUTUBE_REDIRECT_URI=http://localhost:3000/auth/youtube/callback
YOUTUBE_API_KEY=your_api_key_here
```

### OAuth Redirect URI
The frontend expects the callback at: `/auth/youtube/callback`

## Security Considerations

1. **CSRF Protection**: Backend should validate state parameter
2. **Token Storage**: Access tokens stored securely on backend only
3. **Error Handling**: No sensitive information exposed in error messages
4. **Scope Limitation**: Only request necessary YouTube API scopes

## Error Handling

The implementation handles these error scenarios:

1. **OAuth Cancellation**: User cancels authorization
2. **Network Errors**: API request failures
3. **Invalid Codes**: Backend rejects authorization code
4. **Connection Issues**: YouTube API unavailable
5. **Token Expiry**: Handles expired refresh tokens

## Testing

To test the implementation:

1. Ensure backend is running with YouTube OAuth configured
2. Start frontend development server
3. Navigate to settings page
4. Test connect/disconnect/sync flows
5. Verify error handling with invalid scenarios

## Future Enhancements

Potential improvements:

1. **Popup OAuth**: Use popup instead of redirect for better UX
2. **Auto-sync Indicators**: Show when background sync is happening
3. **Subscription Management**: Allow users to manage individual subscriptions
4. **Sync History**: Show history of sync operations
5. **Bulk Operations**: Connect multiple YouTube accounts
