import React from 'react';
import {
  Group,
  Button,
  Box,
  Container,
  Burger,
  Text,
  Stack,
  useMantineTheme,
  rem
} from '@mantine/core';
import { Link } from 'react-router';
import { useDisclosure } from '@mantine/hooks';
import NavLink from './HeaderNavLink';
import Logo from './Logo';

const Header: React.FC = () => {
  const theme = useMantineTheme();
  const [mobileMenuOpened, { toggle: toggleMobileMenu, close: closeMobileMenu }] = useDisclosure(false);

  return (
    <>
      {/* Main Header */}
      <Box h="100%" w="100%">
        <Container size="100%" h="100%" px={{ base: 16, sm: 32, md: 48 }}>
          <Group justify="space-between" align="center" h="100%">
            {/* Logo */}
            <Box>
              <Logo darkMode />
            </Box>

            {/* Desktop Navigation */}
            <Group gap={rem(8)} visibleFrom="sm">
              <NavLink to="/" label="Home" darkMode displayMode="horizontal" />
              <NavLink to="/feed" label="Feed" darkMode displayMode="horizontal" />
              <NavLink to="/about" label="About" darkMode displayMode="horizontal" />
              <NavLink to="/contact" label="Contact" darkMode displayMode="horizontal" />
            </Group>

            {/* Desktop Auth Buttons */}
            <Group gap={rem(12)} visibleFrom="sm">
              <Button
                variant="outline"
                color="red"
                size="sm"
                component={Link}
                to="/login"
                styles={{
                  root: {
                    borderColor: theme.colors.red[5],
                    color: theme.white,
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: theme.colors.red[4],
                      backgroundColor: 'rgba(229, 56, 59, 0.15)',
                      transform: 'translateY(-2px) scale(1.02)',
                      boxShadow: '0 8px 25px -8px rgba(229, 56, 59, 0.4)',
                    },
                    '&:active': {
                      transform: 'translateY(0) scale(0.98)',
                    }
                  }
                }}
              >
                Login
              </Button>
              <Button
                variant="filled"
                size="sm"
                component={Link}
                to="/signup"
                styles={{
                  root: {
                    background: 'linear-gradient(45deg, #4361ee, #4361ee)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                      transition: 'left 0.5s ease',
                    },
                    '&:hover': {
                      background: 'linear-gradient(45deg, #3a0ca3, #4361ee)',
                      transform: 'translateY(-2px) scale(1.02)',
                      boxShadow: '0 8px 25px -8px rgba(67, 97, 238, 0.5)',
                    },
                    '&:hover::before': {
                      left: '100%',
                    },
                    '&:active': {
                      transform: 'translateY(0) scale(0.98)',
                    }
                  }
                }}
              >
                Sign Up
              </Button>
            </Group>

            {/* Mobile Hamburger */}
            <Box hiddenFrom="sm">
              <Burger
                opened={mobileMenuOpened}
                onClick={toggleMobileMenu}
                color={theme.white}
                size="sm"
                aria-label="Toggle navigation menu"
              />
            </Box>
          </Group>
        </Container>
      </Box>

      {/* Mobile Navigation Overlay - Full Screen */}
      {mobileMenuOpened && (
        <Box
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 1000000,
            background: 'linear-gradient(135deg, #000000 0%, #1a0030 100%)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          hiddenFrom="sm"
        >
          {/* Mobile Header with Logo */}
          <Box
            style={{
              width: '100%',
              height: rem(90),
              background: 'linear-gradient(135deg, #000000 0%, #1a0030 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `0 ${rem(20)}`,
              flexShrink: 0,
              zIndex: 1000001,
            }}
          >
            {/* Logo in Mobile Menu */}
            <Box>
              <Logo darkMode />
            </Box>

            {/* Close Button */}
            <Box
              style={{
                cursor: 'pointer',
                padding: rem(8),
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: rem(40),
                height: rem(40),
                transition: 'background-color 0.2s ease',
              }}
              onClick={closeMobileMenu}
            >
              <Text c="white" size="lg" fw={700}>
                ✕
              </Text>
            </Box>
          </Box>

          {/* Mobile Navigation Content - Full Screen */}
          <Box
            style={{
              flex: 1,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: `${rem(40)} ${rem(20)}`,
              background: 'linear-gradient(135deg, #000000 0%, #1a0030 100%)',
            }}
          >
            <Stack gap="xl" align="center" w="100%" maw={400}>
              {/* Navigation Links */}
              <Stack gap="lg" align="center" w="100%">
                <Box w="100%" onClick={closeMobileMenu}>
                  <NavLink to="/" label="Home" darkMode displayMode="vertical" />
                </Box>
                <Box w="100%" onClick={closeMobileMenu}>
                  <NavLink to="/feed" label="Feed" darkMode displayMode="vertical" />
                </Box>
                <Box w="100%" onClick={closeMobileMenu}>
                  <NavLink to="/about" label="About" darkMode displayMode="vertical" />
                </Box>
                <Box w="100%" onClick={closeMobileMenu}>
                  <NavLink to="/contact" label="Contact" darkMode displayMode="vertical" />
                </Box>
              </Stack>

              {/* Mobile Auth Buttons */}
              <Stack gap="md" w="100%" mt="xl">
                <Button
                  fullWidth
                  variant="outline"
                  color="red"
                  size="lg"
                  component={Link}
                  to="/login"
                  onClick={closeMobileMenu}
                  styles={{
                    root: {
                      borderColor: theme.colors.red[5],
                      color: theme.white,
                      backgroundColor: 'transparent',
                      height: rem(50),
                      fontSize: rem(16),
                      fontWeight: 600,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: '0',
                        height: '0',
                        background: 'rgba(229, 56, 59, 0.2)',
                        borderRadius: '50%',
                        transform: 'translate(-50%, -50%)',
                        transition: 'width 0.4s ease, height 0.4s ease',
                      },
                      '&:hover': {
                        borderColor: theme.colors.red[4],
                        backgroundColor: 'rgba(229, 56, 59, 0.15)',
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 12px 30px -10px rgba(229, 56, 59, 0.4)',
                      },
                      '&:hover::after': {
                        width: '300px',
                        height: '300px',
                      },
                      '&:active': {
                        transform: 'translateY(-1px) scale(0.98)',
                      }
                    }
                  }}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  variant="filled"
                  size="lg"
                  component={Link}
                  to="/signup"
                  onClick={closeMobileMenu}
                  styles={{
                    root: {
                      background: 'linear-gradient(45deg, #4361ee, #4361ee)',
                      height: rem(50),
                      fontSize: rem(16),
                      fontWeight: 600,
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        transition: 'left 0.6s ease',
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                        transform: 'scale(0)',
                        transition: 'transform 0.4s ease',
                      },
                      '&:hover': {
                        background: 'linear-gradient(45deg, #3a0ca3, #4361ee)',
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 12px 30px -10px rgba(67, 97, 238, 0.5)',
                      },
                      '&:hover::before': {
                        left: '100%',
                      },
                      '&:hover::after': {
                        transform: 'scale(1)',
                      },
                      '&:active': {
                        transform: 'translateY(-1px) scale(0.98)',
                      }
                    }
                  }}
                >
                  Sign Up
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Header; 