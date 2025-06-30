import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../store/auth.store';
import ROUTES from '../../constants/routes';
import LoadingScreen from '../common/components/LoadingScreen';

/**
 * HOC that guards the profile completion page
 * - Redirects to login if not authenticated
 * - Redirects to '/' if user should not be in profile completion
 */
export const withProfileStageGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithProfileStageGuardComponent(props: P) {
    const navigate = useNavigate();
    const { user, isLoading, error, fetchUser } = useAuthStore();

    useEffect(() => {
      if (!user && !isLoading) {
        // If no user, redirect to login
        fetchUser().catch(() => {
          navigate(ROUTES.LOGIN);
        });
      } else if (user && !isLoading) {
        // Check if user should be redirected to the main app
        const shouldRedirectToApp = 
          user.isSubscribed || 
          user.isProfileCompleted || 
          user.postPaymentDone;

        if (shouldRedirectToApp) {
          navigate(ROUTES.DASHBOARD);
        }
      }
    }, [user, isLoading, fetchUser, navigate]);

    if (isLoading) {
      return <LoadingScreen message="Checking profile status..." />;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!user) {
      return null; // Don't render anything while redirecting
    }

    // Check if user should be redirected (same logic as useEffect)
    const shouldRedirectToApp = 
      user.isSubscribed || 
      user.isProfileCompleted || 
      user.postPaymentDone;

    // Only render profile completion if user should NOT be redirected
    if (!shouldRedirectToApp) {
      return <WrappedComponent {...props} />;
    }

    return null; // Don't render anything while redirecting
  };
}; 