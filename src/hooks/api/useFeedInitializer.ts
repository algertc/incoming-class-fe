import { useEffect, useRef } from 'react';
import { useFeedStore } from '../../store/feed.store';
import { useAuthStore } from '../../store/auth.store';

export const useFeedInitializer = () => {
  const { user } = useAuthStore();
  const hasInitialized = useRef(false);
  const lastUserId = useRef<string | undefined>(user?.id);

  // Initialize feed on component mount or when user changes
  useEffect(() => {
    // Only initialize if:
    // 1. Not already initialized
    // 2. User ID changed (login/logout)
    if (!hasInitialized.current || lastUserId.current !== user?.id) {
      hasInitialized.current = true;
      lastUserId.current = user?.id;
      // Call initializeFeed directly from store to avoid dependency issues
      useFeedStore.getState().initializeFeed();
    }
  }, [user?.id]); // Only depend on user?.id, avoid unstable initializeFeed

  return {
    hasInitialized: hasInitialized.current
  };
}; 