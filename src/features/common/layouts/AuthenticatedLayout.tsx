import React from 'react';
import { AppShell, Box } from '@mantine/core';
import { Outlet } from 'react-router';
import { Header } from '../../../components/layout/Header/Header';
import { BottomNavigation } from '../../../components/layout/BottomNavigation/BottomNavigation';
import { withAuth } from '../../../components/auth/withAuth';

export const AuthenticatedLayout: React.FC = () => {

  return (
    <AppShell
      header={{ height: 90 }}  // Match MainLayout header height
      bg={"black"}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        {/* Add bottom padding on mobile to prevent content from being hidden behind bottom navigation */}
        <Box pb={{ base: 80, sm: 0 }}>
          <Outlet />
        </Box>
      </AppShell.Main>

      {/* Bottom Navigation - Only visible on mobile */}
      <Box display={{ base: "block", sm: "none" }}>
        <BottomNavigation />
      </Box>
    </AppShell>
  );
};

// Apply the withAuth HOC to ensure only authenticated users can access
const WrappedAuthenticatedLayout = withAuth(AuthenticatedLayout);
export default WrappedAuthenticatedLayout; 