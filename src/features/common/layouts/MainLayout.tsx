import React, { useEffect } from 'react';
import { AppShell } from '@mantine/core';
import { Outlet, useNavigate } from 'react-router';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { useAuthStore } from '../../../store/auth.store';
import { ProfileStage } from '../../../models/user.model';
import ROUTES from '../../../constants/routes';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();

  // If user is logged in, check if they need to complete profile
  // If they do, redirect to profile completion
  // If they don't, redirect to dashboard
  useEffect(() => {
    if (user && !isLoading) {
      if (user.profileStage !== undefined && user.profileStage !== ProfileStage.PAYMENT) {
        navigate(ROUTES.PROFILE_COMPLETION);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    }
  }, [user, isLoading, navigate]);

  return (
    <AppShell
      header={{ height: { base: 70, sm: 80, md: 90 } }}
      bg="black"
      styles={{
        header: {
          background: 'linear-gradient(135deg, #000000 0%, #1a0030 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout; 