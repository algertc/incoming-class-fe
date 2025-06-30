import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../../store/auth.store";
import ROUTES from "../../../constants/routes";
import LoadingScreen from "../../common/components/LoadingScreen";

/**
 * HOC that redirects authenticated users away from auth pages
 * If user is logged in, redirect to dashboard or profile completion based on status
 */
export const withAuthRedirect = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithAuthRedirectComponent(props: P) {
    const navigate = useNavigate();
    const { user, isLoading } = useAuthStore();

    useEffect(() => {
      if (user && !isLoading) {
        // Check if user should be redirected
        const shouldRedirectToApp =
          user.isSubscribed || user.isProfileCompleted || user.postPaymentDone;

        if (shouldRedirectToApp) {
          navigate(ROUTES.DASHBOARD);
        } else {
          // User needs to complete profile - redirect to profile completion
          navigate(ROUTES.PROFILE_COMPLETION);
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
