import { useEffect, useRef, useCallback } from 'react';
import { useFeedStore } from '../../store/feed.store';

export const useFeedInitializer = (isAuthenticated: boolean, userId?: string) => {
  const { initializeFeed } = useFeedStore();
  const hasInitialized = useRef(false);
  const lastUserId = useRef<string | undefined>(userId);

  // Memoize the initialization to prevent multiple calls
  const initializeFeedMemoized = useCallback(() => {
    // Only initialize if:
    // 1. Not already initialized
    // 2. User authentication status changed
    // 3. User ID changed (login/logout)
    if (!hasInitialized.current || lastUserId.current !== userId) {
      hasInitialized.current = true;
      lastUserId.current = userId;
      initializeFeed(isAuthenticated);
    }
  }, [initializeFeed, isAuthenticated, userId]);

  // Initialize feed on component mount or auth change
  useEffect(() => {
    initializeFeedMemoized();
  }, [initializeFeedMemoized]);

  // Reset initialization flag when user changes
  useEffect(() => {
    if (lastUserId.current !== userId) {
      hasInitialized.current = false;
    }
  }, [userId]);

  return {
    initializeFeed: initializeFeedMemoized,
    hasInitialized: hasInitialized.current
  };
}; 