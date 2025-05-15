import React from 'react'
import { 
  Group, 
  Button, 
  Box, 
  rem,
  Container,
  Burger,
  Menu,
  Divider,
  Flex
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
        <Flex align={"center"}>
          <Logo />
        
        </Flex>
        <Group ml="xl" display={{ base: 'none', sm: 'flex' }} gap={rem(5)}>
            <NavLink to="/" label="Home" />
            <NavLink to="/colleges" label="Colleges" />
          </Group>
        <Group align={"flex-start"} gap={32}>
          <Button 
            variant={"outline"}
            color="red" 
            radius="md" 
            size="xl" 
            fz={"24px"}
            component={Link} 
            to="/login"
            display={{ base: 'none', sm: 'block' }}
            style={{
              fontWeight: 700,
          
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
            fz={"24px"}
            fw={900}
            radius="md" 
            size="xl" 
            component={Link} 
            to="/signup"
            display={{ base: 'none', sm: 'block' }}
            bg={"yellow.5"}
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