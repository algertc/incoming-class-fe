import React from 'react';
import { AppShell, useMantineTheme } from '@mantine/core';
import { Outlet } from 'react-router';
import { Header } from '../../../components/layout/Header/Header';
import { withAuth } from '../../../components/auth/withAuth';

export const AuthenticatedLayout: React.FC = () => {

  const theme = useMantineTheme();

  return (
    <AppShell
      header={{ height: 60 }}      
      padding={{ base: 16, sm: 32, md: 72 }}
      bg={theme.colors.dark[8]}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

// Apply the withAuth HOC to ensure only authenticated users can access
const WrappedAuthenticatedLayout = withAuth(AuthenticatedLayout);
export default WrappedAuthenticatedLayout; 