import React from 'react';
import { AppShell, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router';
import { Header } from '../../../components/layout/Header/Header';
import { withAuth } from '../../../components/auth/withAuth';

export const AuthenticatedLayout: React.FC = () => {
  const [opened] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <Header />
      <Container size="xl">
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </Container>
    </AppShell>
  );
};

// Apply the withAuth HOC to ensure only authenticated users can access
const WrappedAuthenticatedLayout = withAuth(AuthenticatedLayout);
export default WrappedAuthenticatedLayout; 