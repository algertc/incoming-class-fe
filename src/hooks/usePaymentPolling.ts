import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/auth.store';
import ROUTES from '../constants/routes';
import type { User } from '../models/user.model';

interface UsePaymentPollingOptions {
  /** Whether to start polling immediately */
  autoStart?: boolean;
  /** Polling interval in milliseconds (default: 3000) */
  interval?: number;
  /** Timeout in milliseconds after which polling stops (default: 10 minutes) */
  timeout?: number;
  /** Custom redirect URL (default: ROUTES.DASHBOARD) */
  redirectUrl?: string;
  /** Custom condition to check if payment is complete */
  isPaymentComplete?: (user: User) => boolean;
}

export const usePaymentPolling = (options: UsePaymentPollingOptions = {}) => {
  const {
    autoStart = false,
    interval = 3000,
    timeout = 10 * 60 * 1000, // 10 minutes
    redirectUrl = ROUTES.DASHBOARD,
    isPaymentComplete = (user) => 
      user?.isSubscribed || user?.isProfileCompleted || user?.postPaymentDone
  } = options;

  const navigate = useNavigate();
  const { fetchUser } = useAuthStore();
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef<number | null>(null);
  const timeoutRef = useRef<number | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Auto-start polling if enabled
  useEffect(() => {
    if (autoStart) {
      startPolling();
    }
  }, [autoStart]);

  const startPolling = () => {
    // Clear any existing intervals
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsPolling(true);
    console.log("🔄 Starting payment status polling...");

    pollingIntervalRef.current = window.setInterval(async () => {
      try {
        console.log("📡 Polling payment status...");
        await fetchUser();
        
        // Check if payment is complete
        const updatedUser = useAuthStore.getState().user;
        if (updatedUser && isPaymentComplete(updatedUser)) {
          console.log("✅ Payment completed! Redirecting...");
          stopPolling();
          navigate(redirectUrl);
        }
      } catch (error) {
        console.error("❌ Error polling payment status:", error);
      }
    }, interval);

    // Set timeout to stop polling after specified time
    timeoutRef.current = window.setTimeout(() => {
      console.log("⏰ Payment polling timeout - stopping after timeout period");
      stopPolling();
    }, timeout);
  };

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPolling(false);
  };

  return {
    isPolling,
    startPolling,
    stopPolling,
  };
}; 