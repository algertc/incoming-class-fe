import React from 'react'
import { 
  AppShell, 
  Container
} from '@mantine/core'
import { Outlet } from 'react-router'
import Header from '../components/Header/Header'

const MainLayout:React.FC = () => {
  return (
    <AppShell
      header={{ height: 82 }}
      bg="#f8f9fc"
    >
      <AppShell.Header 
     bg={"white"}
      p="md"
      style={{ 
          borderBottom: '2px solid rgba(0,0,0,0.05)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Header />
      </AppShell.Header>

      <AppShell.Main pt="xl">
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}

export default MainLayout