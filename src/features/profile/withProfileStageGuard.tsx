import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../store/auth.store';
import { ProfileStage } from '../../models/user.model';
import ROUTES from '../../constants/routes';
import LoadingScreen from '../common/components/LoadingScreen';

/**
 * HOC that guards the profile completion page
 * - Redirects to login if not authenticated
 * - Redirects to dashboard if profile is already complete
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
        // If user has completed profile, redirect to dashboard
        if (!user.profileStage || user.profileStage === ProfileStage.PAYMENT) {
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

    // Only render if user has an incomplete profile
    if (user.profileStage !== ProfileStage.PAYMENT) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };
}; 