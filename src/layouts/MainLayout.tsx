import React from 'react'
import { 
  AppShell
} from '@mantine/core'
import { Outlet } from 'react-router'
import Header from '../components/Header/Header'

const MainLayout: React.FC = () => {
  return (
    <AppShell
      header={{ height: 90 }}
      bg="#f8f9fc"
    >
      <AppShell.Header 
        bg="linear-gradient(135deg, #000000 0%, #1a0030 100%)"
        style={{ 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
}

export default MainLayout