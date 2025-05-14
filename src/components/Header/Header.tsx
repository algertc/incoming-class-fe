import React from 'react'
import { 
  Group, 
  Button, 
  Box, 
  rem,
  Container,
  Burger,
  Menu,
  Divider
} from '@mantine/core'
import { Link } from 'react-router'
import { useDisclosure } from '@mantine/hooks'
import NavLink from './HeaderNavLink';
import Logo from './Logo';





const Header:React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  
  return (
    <Container px={72} size={"100%"}>
      <Group justify="space-between" style={{ height: '100%' }}>
        <Group>
          <Logo />
          <Group ml="xl" display={{ base: 'none', sm: 'flex' }} gap={rem(5)}>
            <NavLink to="/" label="Home" />
            <NavLink to="/colleges" label="Colleges" />
          </Group>
        </Group>
        
        <Group gap={32}>
          <Button 
            variant={"outline"}
            color="dark" 
            radius="md" 
            size="lg" 
            component={Link} 
            to="/login"
            display={{ base: 'none', sm: 'block' }}
            style={{
              fontWeight: 500,
              fontSize:"20px",
              '&:hover': {
                background: 'rgba(0,0,0,0.05)',
                color: 'dark'
              }
            }}
          >
            Login
          </Button>
          <Button 
            variant="filled" 
            color="blue" 
            radius="md" 
            size="lg" 
            component={Link} 
            to="/signup"
            display={{ base: 'none', sm: 'block' }}
            style={{
              background: 'linear-gradient(90deg, #546ff8 0%, #3c51c9 100%)',
              boxShadow: '0 4px 10px rgba(84, 111, 248, 0.25)',
              border: 'none',
              fontWeight: 500
            }}
          >
            Sign Up
          </Button>
          
          <Burger opened={opened} onClick={toggle} display={{ sm: 'none' }} />
          
          <Box display={{ sm: 'none' }}>
            <Menu shadow="md" width={200} opened={opened}>
              <Menu.Dropdown>
                <Menu.Item component={Link} to="/">Home</Menu.Item>
                <Menu.Item component={Link} to="/colleges">Colleges</Menu.Item>
                <Divider />
                <Menu.Item component={Link} to="/login">Login</Menu.Item>
                <Menu.Item component={Link} to="/signup">Sign Up</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </Group>
      </Group>
    </Container>
  );
};

export default Header; 