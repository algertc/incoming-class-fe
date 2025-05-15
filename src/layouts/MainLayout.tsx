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
      header={{ height: 96 }}
      bg="#f8f9fc"
    >
      <AppShell.Header 
     bg={"white"}
      pt={"18"}
      pb={"12"}
      style={{ 
            boxShadow:"rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px; borderBottom: '1px solid rgba(0,0,0,0.05)'",
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