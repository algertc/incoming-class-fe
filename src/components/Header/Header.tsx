import React, { useEffect, useRef, useState } from 'react'
import { 
  Group, 
  Button, 
  Box, 
  rem,
  Container,
  Burger,
  Drawer,
  Stack,
  Flex,
  useMantineTheme
} from '@mantine/core'
import { Link } from 'react-router'
import { useDisclosure } from '@mantine/hooks'
import NavLink from './HeaderNavLink';
import Logo from './Logo';
import gsap from 'gsap';

export const Header: React.FC = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const theme = useMantineTheme();
  const [loginHovered, setLoginHovered] = useState(false);
  const [signupHovered, setSignupHovered] = useState(false);
  const [mobileLoginHovered, setMobileLoginHovered] = useState(false);
  const [mobileSignupHovered, setMobileSignupHovered] = useState(false);
  
  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Header animation
    const headerTimeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Animate the header from slightly above its position
    headerTimeline.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    );
    
    // Animate the logo
    headerTimeline.fromTo(
      logoRef.current,
      { y: -15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.3" // Slight overlap with header animation
    );
    
    // Animate the nav links with stagger
    headerTimeline.fromTo(
      navLinksRef.current?.children || [],
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
      "-=0.2"
    );
    
    // Animate the buttons with stagger
    headerTimeline.fromTo(
      buttonsRef.current?.children || [],
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
      "-=0.2"
    );
    
  }, []);
  
  return (
    <Box
      ref={headerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(26,0,48,0.95) 100%)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)"
      }}
    >
      <Container px={{ base: 16, sm: 32, lg: 48 }} size="100%" h={{ base: 70, sm: 80, md: 90 }}>
        <Group justify="space-between" style={{ height: '100%' }}>
          {/* Logo */}
          <Box ref={logoRef}>
            <Logo darkMode />
          </Box>
          
          {/* Desktop Navigation */}
          <Flex ref={navLinksRef} display={{ base: 'none', sm: 'flex' }} gap={rem(5)} direction="row">
            <NavLink to="/" label="Home" darkMode displayMode="horizontal" />
            <NavLink to="/feed" label="Feed" darkMode displayMode="horizontal" />
            <NavLink to="/about" label="About" darkMode displayMode="horizontal" />
            <NavLink to="/contact" label="Contact" darkMode displayMode="horizontal" />
          </Flex>
          
          {/* Desktop Action Buttons */}
          <Group ref={buttonsRef} align="center" gap={rem(16)} display={{ base: 'none', sm: 'flex' }}>
            <Box 
              style={{ 
                position: 'relative', 
                overflow: 'hidden',
                borderRadius: theme.radius.md
              }}
              onMouseEnter={() => setLoginHovered(true)}
              onMouseLeave={() => setLoginHovered(false)}
            >
              <Button 
                variant="outline" 
                color="red" 
                radius="md" 
                size="sm"
                component={Link} 
                to="/login"
                style={{
                  fontWeight: 600,
                  borderColor: loginHovered ? theme.colors.red[7] : theme.colors.red[5],
                  borderWidth: '1.5px',
                  color: loginHovered ? '#fff' : theme.white,
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  transform: loginHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: loginHovered 
                    ? '0 10px 20px -10px rgba(229, 56, 59, 0.5)' 
                    : 'none',
                  position: 'relative',
                  zIndex: 2,
                  backgroundColor: 'transparent'
                }}
              >
                Login
              </Button>
              
              {/* Background animation */}
              <Box
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(45deg, rgba(229, 56, 59, 0.1), rgba(229, 56, 59, 0.2))`,
                  opacity: loginHovered ? 1 : 0,
                  transform: loginHovered ? 'scale(1)' : 'scale(0.9)',
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  zIndex: 0,
                  borderRadius: theme.radius.md,
                  pointerEvents: 'none'
                }}
              />
              
              {/* Shine effect */}
              <Box
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                  transform: loginHovered 
                    ? 'translate(100%, 100%) rotate(45deg)' 
                    : 'translate(-100%, -100%) rotate(45deg)',
                  transition: 'transform 0.8s ease',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              />
            </Box>
            
            <Box 
              style={{ 
                position: 'relative', 
                overflow: 'hidden',
                borderRadius: theme.radius.md
              }}
              onMouseEnter={() => setSignupHovered(true)}
              onMouseLeave={() => setSignupHovered(false)}
            >
              <Button 
                variant="filled" 
                radius="md" 
                size="sm"
                component={Link} 
                to="/signup"
                style={{
                  fontWeight: 600,
                  background: signupHovered 
                    ? 'linear-gradient(45deg, #3a0ca3, #4361ee)' 
                    : 'linear-gradient(45deg, #4361ee, #4361ee)',
                  transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  transform: signupHovered ? 'translateY(-4px)' : 'translateY(0)',
                  boxShadow: signupHovered 
                    ? '0 10px 20px -10px rgba(67, 97, 238, 0.6)' 
                    : 'none',
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                Sign Up
              </Button>
              
              {/* Animated border */}
              {signupHovered && (
                <Box
                  style={{
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(45deg, #4361ee, #3a0ca3, #4361ee)',
                    backgroundSize: '200% 200%',
                    animation: 'borderGradient 2s ease infinite',
                    zIndex: 1,
                    borderRadius: `calc(${theme.radius.md} + 2px)`,
                  }}
                />
              )}
              
              {/* Shine effect */}
              <Box
                style={{
                  position: 'absolute',
                  top: '-50%',
                  left: '-50%',
                  width: '200%',
                  height: '200%',
                  background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                  transform: signupHovered 
                    ? 'translate(100%, 100%) rotate(45deg)' 
                    : 'translate(-100%, -100%) rotate(45deg)',
                  transition: 'transform 0.8s ease',
                  zIndex: 3,
                  pointerEvents: 'none',
                }}
              />
            </Box>
          </Group>
          
          {/* Mobile Burger */}
          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            color={theme.white}
            display={{ sm: 'none' }}
            size="md"
          />
        </Group>
      </Container>
      
      {/* Mobile Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="CollegeConnect"
        hiddenFrom="sm"
        zIndex={1000}
        transitionProps={{ transition: 'slide-right', duration: 300 }}
        styles={{
          title: { fontSize: rem(20), fontWeight: 700, color: theme.white },
          header: { 
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            borderBottom: `1px solid ${theme.colors.dark[6]}`,
            height: 70
          },
          body: { 
            background: 'linear-gradient(135deg, rgba(0,0,0,0.98) 0%, rgba(26,0,48,0.98) 100%)',
            padding: rem(32)
          },
          close: { color: theme.white }
        }}
      >
        <Stack align='center' gap="xl" mt={20}>
          <NavLink to="/" label="Home" darkMode displayMode="vertical" onClick={closeDrawer} />
          <NavLink to="/feed" label="Feed" darkMode displayMode="vertical" onClick={closeDrawer} />
          <NavLink to="/about" label="About" darkMode displayMode="vertical" onClick={closeDrawer} />
          <NavLink to="/contact" label="Contact" darkMode displayMode="vertical" onClick={closeDrawer} />
          
          <Box h={20} />
          
          <Box 
            style={{ 
              position: 'relative', 
              overflow: 'hidden',
              borderRadius: theme.radius.md,
              width: '100%'
            }}
            onMouseEnter={() => setMobileLoginHovered(true)}
            onMouseLeave={() => setMobileLoginHovered(false)}
          >
            <Button 
              fullWidth
              variant="outline" 
              color="red" 
              radius="md" 
              size="md" 
              component={Link} 
              to="/login"
              onClick={closeDrawer}
              style={{
                fontWeight: 600,
                borderColor: mobileLoginHovered ? theme.colors.red[7] : theme.colors.red[5],
                borderWidth: '1.5px',
                color: mobileLoginHovered ? '#fff' : theme.white,
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                transform: mobileLoginHovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: mobileLoginHovered ? '0 8px 15px -8px rgba(229, 56, 59, 0.5)' : 'none',
                position: 'relative',
                zIndex: 2,
                backgroundColor: 'transparent'
              }}
            >
              Login
            </Button>
            
            {/* Background animation */}
            <Box
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `linear-gradient(45deg, rgba(229, 56, 59, 0.1), rgba(229, 56, 59, 0.2))`,
                opacity: mobileLoginHovered ? 1 : 0,
                transform: mobileLoginHovered ? 'scale(1)' : 'scale(0.9)',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                zIndex: 0,
                borderRadius: theme.radius.md,
                pointerEvents: 'none'
              }}
            />
            
            {/* Shine effect */}
            <Box
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                transform: mobileLoginHovered 
                  ? 'translate(100%, 100%) rotate(45deg)' 
                  : 'translate(-100%, -100%) rotate(45deg)',
                transition: 'transform 0.8s ease',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
          </Box>
          
          <Box 
            style={{ 
              position: 'relative', 
              overflow: 'hidden',
              borderRadius: theme.radius.md,
              width: '100%'
            }}
            onMouseEnter={() => setMobileSignupHovered(true)}
            onMouseLeave={() => setMobileSignupHovered(false)}
          >
            <Button 
              fullWidth
              variant="filled" 
              radius="md" 
              size="md" 
              component={Link} 
              to="/signup"
              onClick={closeDrawer}
              style={{
                fontWeight: 600,
                background: mobileSignupHovered 
                  ? 'linear-gradient(45deg, #3a0ca3, #4361ee)' 
                  : 'linear-gradient(45deg, #4361ee, #4361ee)',
                transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
                transform: mobileSignupHovered ? 'translateY(-3px)' : 'translateY(0)',
                boxShadow: mobileSignupHovered ? '0 8px 15px -8px rgba(67, 97, 238, 0.6)' : 'none',
                position: 'relative',
                zIndex: 2,
              }}
            >
              Sign Up
            </Button>
            
            {/* Animated border */}
            {mobileSignupHovered && (
              <Box
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  background: 'linear-gradient(45deg, #4361ee, #3a0ca3, #4361ee)',
                  backgroundSize: '200% 200%',
                  animation: 'borderGradient 2s ease infinite',
                  zIndex: 1,
                  borderRadius: `calc(${theme.radius.md} + 2px)`,
                }}
              />
            )}
            
            {/* Shine effect */}
            <Box
              style={{
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                width: '200%',
                height: '200%',
                background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                transform: mobileSignupHovered 
                  ? 'translate(100%, 100%) rotate(45deg)' 
                  : 'translate(-100%, -100%) rotate(45deg)',
                transition: 'transform 0.8s ease',
                zIndex: 3,
                pointerEvents: 'none',
              }}
            />
          </Box>
        </Stack>
      </Drawer>
      
      <style>
        {`
          @keyframes borderGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </Box>
  );
};

export default Header; 