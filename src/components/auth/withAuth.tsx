import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuthStore } from '../../store/auth.store';
import LoadingScreen from '../../features/common/components/LoadingScreen';
import ROUTES from '../../constants/routes';

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithAuthComponent(props: P) {
    const navigate = useNavigate();
    const { user, isLoading, error, fetchUser } = useAuthStore();

    useEffect(() => {
      if (!user && !isLoading) {
        
        fetchUser().catch(() => {
          navigate('/public');
        });
      }
    }, [user, isLoading, fetchUser, navigate]);

    if (isLoading) {
      return <LoadingScreen message="Checking authentication..." />;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!user) {
      return null;
    }

    if(!user.isProfileCompleted){
      return <Navigate to={ROUTES.PROFILE_COMPLETION} />
    }

    return <WrappedComponent {...props} />;
  };
}; 