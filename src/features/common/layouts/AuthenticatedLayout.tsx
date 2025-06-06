import React from 'react';
import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router';
import { Header } from '../../../components/layout/Header/Header';
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
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

// Apply the withAuth HOC to ensure only authenticated users can access
const WrappedAuthenticatedLayout = withAuth(AuthenticatedLayout);
export default WrappedAuthenticatedLayout; 