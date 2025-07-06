import React, { useEffect, useRef } from "react";
import {
  Group,
  Box,
  rem,
  Container,
  useMantineTheme,
  Avatar,
  Menu,
  UnstyledButton,
  Text,
  Burger,
  Stack,
} from "@mantine/core";
import { Link, useNavigate } from "react-router";
import {
  IconUser,
  IconCreditCard,
  IconLogout,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useAuthStore } from "../../../store/auth.store";
import Logo from "../../Header/Logo";
import HeaderNavLink from "../../Header/HeaderNavLink";
import gsap from "gsap";

export const Header: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [mobileMenuOpened, { toggle: toggleMobileMenu, close: closeMobileMenu }] = useDisclosure(false);

  // Refs for animations
  const headerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
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
      "-=0.3"
    );

    // Animate the buttons with stagger
    headerTimeline.fromTo(
      buttonsRef.current?.children || [],
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.1 },
      "-=0.2"
    );
  }, []);

  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  return (
    <>
      <Box
        ref={headerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "linear-gradient(135deg, #000000 0%, #1a0030 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          WebkitBackdropFilter: "blur(10px)",
          backdropFilter: "blur(10px)",
          transform: "translateZ(0)", // Force GPU acceleration on Safari
          WebkitTransform: "translateZ(0)",
          width: "100%",
          overflow: "hidden", // Prevent any overflow
        }}
      >
        <Container 
          px={{ base: 12, sm: 24, md: 72 }} 
          size="100%" 
          h={{ base: 72, sm: 84, md: 108 }}
          style={{
            maxWidth: "100%",
            overflow: "hidden",
            padding: "0 12px", // Consistent padding for mobile
          }}
        >
          <Group 
            justify="space-between" 
            align="center" 
            style={{ 
              height: "100%",
              gap: rem(8),
              flexWrap: "nowrap",
              minWidth: 0, // Allow content to shrink below min-content
            }} 
            wrap="nowrap"
          >
            {/* Logo */}
            <Box 
              ref={logoRef} 
              style={{ 
                flexShrink: 1,
                display: "flex",
                alignItems: "center",
                minWidth: 0, // Allow logo to shrink
              }}
            >
              <Link to="/" style={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                <Logo darkMode mobileSize={28} size={90} />
              </Link>
            </Box>

            {/* Desktop Navigation */}
            <Group 
              gap={rem(8)} 
              visibleFrom="md" 
              style={{
                flexGrow: 1,
                justifyContent: "center",
                minWidth: 0, // Allow nav to shrink
              }}
            >
              <HeaderNavLink to="/home" label="Home" darkMode displayMode="horizontal" />
              <HeaderNavLink to="/" label="Feed" darkMode displayMode="horizontal" />
              <HeaderNavLink to="/about" label="About" darkMode displayMode="horizontal" />
              <HeaderNavLink to="/contact" label="Contact" darkMode displayMode="horizontal" />
            </Group>

            {/* Desktop User Menu & Mobile Controls */}
            <Box 
              ref={buttonsRef} 
              style={{ 
                flexShrink: 0,
                minWidth: "auto",
                display: "flex",
                alignItems: "center",
                marginLeft: "auto", // Push to the right
                gap: rem(8),
              }}
            >
              <Group gap={rem(8)} align="center">
                {/* User Menu - Always visible */}
                <Menu
                  width={200}
                  position="bottom-end"
                  transitionProps={{ transition: "pop-top-right" }}
                >
                  <Menu.Target>
                    <UnstyledButton
                      style={{
                        padding: rem(4),
                        borderRadius: "50%",
                        color: theme.white,
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        border: "2px solid rgba(255, 255, 255, 0.1)",
                        transition: "all 0.2s ease",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        WebkitTapHighlightColor: "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          transform: "translateY(-1px) scale(1.05)",
                          borderColor: "rgba(255, 255, 255, 0.2)",
                        },
                      }}
                    >
                      <Avatar
                        src={user?.profilePicture}
                        alt={fullName}
                        radius="xl"
                        size={"sm"}
                        styles={{
                          root: {
                            border: "none",
                            "@media (max-width: 768px)": {
                              width: rem(24),
                              height: rem(24),
                            },
                            "@media (min-width: 769px)": {
                              width: rem(36),
                              height: rem(36),
                            },
                          },
                          image: {
                            objectFit: "cover",
                          },
                        }}
                      />
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Account</Menu.Label>
                    <Menu.Item
                      leftSection={
                        <IconUser
                          style={{ width: rem(14), height: rem(14) }}
                          stroke={1.5}
                        />
                      }
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                    </Menu.Item>
                    <Menu.Item
                      leftSection={
                        <IconCreditCard
                          style={{ width: rem(14), height: rem(14) }}
                          stroke={1.5}
                        />
                      }
                      onClick={() => navigate("/subscription")}
                    >
                      Subscription
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={
                        <IconLogout
                          style={{ width: rem(14), height: rem(14) }}
                          stroke={1.5}
                        />
                      }
                      onClick={async () => {
                        await logout();
                        navigate("/public");
                      }}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>

                {/* Mobile Hamburger */}
                <Box hiddenFrom="md" style={{ marginLeft: rem(4) }}>
                  <Burger
                    opened={mobileMenuOpened}
                    onClick={toggleMobileMenu}
                    color={theme.white}
                    size="sm"
                    aria-label="Toggle navigation menu"
                    styles={{
                      root: {
                        padding: rem(2),
                      },
                    }}
                  />
                </Box>
              </Group>
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
          hiddenFrom="md"
        >
          {/* Mobile Header with Logo */}
          <Box
            style={{
              width: '100%',
              height: rem(60),
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
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: `${rem(24)} ${rem(16)}`,
              background: 'linear-gradient(135deg, #000000 0%, #1a0030 100%)',
            }}
          >
            <Stack gap="xl" align="center" w="100%" maw={400}>
              {/* Navigation Links */}
              <Stack gap="lg" align="center" w="100%">
                <Box w="100%" onClick={closeMobileMenu}>
                  <HeaderNavLink to="/home" label="Home" darkMode displayMode="vertical" />
                </Box>
                <Box w="100%" onClick={closeMobileMenu}>
                  <HeaderNavLink to="/" label="Feed" darkMode displayMode="vertical" />
                </Box>
                <Box w="100%" onClick={closeMobileMenu}>
                  <HeaderNavLink to="/about" label="About" darkMode displayMode="vertical" />
                </Box>
                <Box w="100%" onClick={closeMobileMenu}>
                  <HeaderNavLink to="/contact" label="Contact" darkMode displayMode="vertical" />
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>
      )}
    </>
  );
};
