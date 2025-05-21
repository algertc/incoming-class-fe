import React from 'react';
import { AppShell, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router';
import Header from './Header/Header';
import { withAuth } from '../auth/withAuth';

const AuthenticatedLayout: React.FC = () => {
  const [opened, { toggle }] = useDisclosure();

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
      <Header toggle={toggle} />
      <Container size="xl">
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </Container>
    </AppShell>
  );
};

export default withAuth(AuthenticatedLayout); 