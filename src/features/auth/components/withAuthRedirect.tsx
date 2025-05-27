import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../store/auth.store';
import { ProfileStage } from '../../../models/user.model';
import ROUTES from '../../../constants/routes';
import LoadingScreen from '../../common/components/LoadingScreen';

/**
 * HOC that redirects authenticated users away from auth pages
 * If user is logged in, redirect to dashboard
 * If user needs to complete profile, redirect to profile completion
 */
export const withAuthRedirect = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithAuthRedirectComponent(props: P) {
    const navigate = useNavigate();
    const { user, isLoading } = useAuthStore();

    useEffect(() => {
      if (user && !isLoading) {
        // If user has a profileStage that's not completed, redirect to profile completion
        if (user.profileStage !== undefined && user.profileStage !== ProfileStage.PAYMENT) {
          navigate(ROUTES.PROFILE_COMPLETION);
        } else {
          // Otherwise, redirect to dashboard
          navigate(ROUTES.DASHBOARD);
        }
      }
    }, [user, isLoading, navigate]);

    // Only render the component if user is not authenticated
    if (isLoading) {
      return <LoadingScreen message="Checking authentication..." />;
    }

    if (!user) {
      return <WrappedComponent {...props} />;
    }

    return null; // Don't render anything while redirecting
  };
}; 