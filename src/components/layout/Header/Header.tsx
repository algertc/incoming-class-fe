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
  Drawer,
  Stack,
  Button,
  Divider,
} from "@mantine/core";
import { Link, useNavigate } from "react-router";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconLogout,
  IconUser,
  IconCreditCard,
  IconHome,
  IconSettings,
} from "@tabler/icons-react";
import { useAuthStore } from "../../../store/auth.store";
import { showSuccess } from "../../../utils";
import Logo from "../../Header/Logo";
import gsap from "gsap";

export const Header: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

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
      "-=0.3"
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

  const handleLogout = async (): Promise<void> => {
    closeDrawer();
    await logout();
    showSuccess("Logged out successfully");
    navigate("/login");
  };

  const fullName = user ? `${user.firstName} ${user.lastName}` : "";

  return (
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
        backdropFilter: "blur(10px)",
      }}
    >
      <Container px={{ base: 16, sm: 32, md: 72 }} size="100%" h={90}>
        <Group justify="space-between" style={{ height: "100%" }}>
          {/* Logo */}
          <Box ref={logoRef}>
            <Link to="/app">
              <Logo darkMode />
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Group
            ml="xl"
            ref={navLinksRef}
            display={{ base: "none", sm: "flex" }}
            gap={rem(5)}
          >
            {/* <NavLink to="/app" label="Feed" darkMode /> */}
          </Group>

          {/* Desktop User Menu - Only shown on desktop */}
          <Group
            ref={buttonsRef}
            align="center"
            gap={24}
            display={{ base: "none", sm: "flex" }}
          >
            <Menu
              width={280}
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
            >
              <Menu.Target>
                <UnstyledButton
                  style={{
                    padding: `${rem(8)} ${rem(16)}`,
                    borderRadius: theme.radius.md,
                    color: theme.white,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Group gap={12}>
                    <Avatar
                      src={user?.profilePicture}
                      alt={fullName}
                      radius="xl"
                      size={36}
                      styles={{
                        root: {
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                        },
                      }}
                    />
                    <div>
                      <Text fw={600} size="sm" lh={1.2}>
                        {fullName}
                      </Text>
                      <Text size="xs" c="dimmed" lh={1}>
                        {user?.email}
                      </Text>
                    </div>
                    <IconChevronDown
                      style={{ width: rem(14), height: rem(14) }}
                      stroke={1.5}
                    />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item
                  leftSection={
                    <IconUser
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  onClick={() => navigate("/app/profile")}
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  leftSection={
                    <IconCreditCard
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  onClick={() => navigate("/app/subscription")}
                >
                  Subscription
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item
                  leftSection={
                    <IconLogout
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  onClick={handleLogout}
                  c="red.6"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>

          {/* Mobile Burger Menu */}
          <Group
            align="center"
            display={{ base: "flex", sm: "none" }}
            gap={12}
          >
            <Avatar
              src={user?.profilePicture}
              alt={fullName}
              radius="xl"
              size={32}
              styles={{
                root: {
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                },
              }}
            />
            <Burger
              opened={drawerOpened}
              onClick={toggleDrawer}
              color={theme.white}
              size="md"
            />
          </Group>
        </Group>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        hiddenFrom="sm"
        zIndex={10000}
        transitionProps={{ transition: 'slide-right', duration: 300 }}
        withinPortal={true}
        lockScroll={true}
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
        <Stack align="center" gap="xl" mt={20}>
          {/* User Info */}
          <Box style={{ textAlign: 'center', marginBottom: rem(20) }}>
            <Avatar
              src={user?.profilePicture}
              alt={fullName}
              radius="xl"
              size={60}
              mx="auto"
              mb="md"
              styles={{
                root: {
                  border: "3px solid rgba(255, 255, 255, 0.2)",
                },
              }}
            />
            <Text fw={600} size="lg" c="white" mb={4}>
              {fullName}
            </Text>
            <Text size="sm" c="dimmed">
              {user?.email}
            </Text>
          </Box>

          <Divider w="100%" color="rgba(255, 255, 255, 0.1)" />

          {/* Navigation Options */}
          <Button
            fullWidth
            variant="subtle"
            leftSection={<IconHome size={20} />}
            size="lg"
            onClick={() => {
              navigate("/app");
              closeDrawer();
            }}
            style={{
              justifyContent: "flex-start",
              color: theme.white,
              fontSize: rem(16),
              fontWeight: 500,
              height: rem(50),
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Feed
          </Button>

          <Button
            fullWidth
            variant="subtle"
            leftSection={<IconUser size={20} />}
            size="lg"
            onClick={() => {
              navigate("/app/profile");
              closeDrawer();
            }}
            style={{
              justifyContent: "flex-start",
              color: theme.white,
              fontSize: rem(16),
              fontWeight: 500,
              height: rem(50),
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Profile
          </Button>

          <Button
            fullWidth
            variant="subtle"
            leftSection={<IconCreditCard size={20} />}
            size="lg"
            onClick={() => {
              navigate("/app/subscription");
              closeDrawer();
            }}
            style={{
              justifyContent: "flex-start",
              color: theme.white,
              fontSize: rem(16),
              fontWeight: 500,
              height: rem(50),
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Subscription
          </Button>

          <Button
            fullWidth
            variant="subtle"
            leftSection={<IconSettings size={20} />}
            size="lg"
            onClick={() => {
              navigate("/app/settings");
              closeDrawer();
            }}
            style={{
              justifyContent: "flex-start",
              color: theme.white,
              fontSize: rem(16),
              fontWeight: 500,
              height: rem(50),
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            Settings
          </Button>

          <Divider w="100%" color="rgba(255, 255, 255, 0.1)" />

          <Button
            fullWidth
            variant="outline"
            leftSection={<IconLogout size={20} />}
            size="lg"
            color="red"
            onClick={handleLogout}
            style={{
              justifyContent: "flex-start",
              fontSize: rem(16),
              fontWeight: 500,
              height: rem(50),
              borderColor: theme.colors.red[5],
              color: theme.colors.red[5],
              "&:hover": {
                backgroundColor: "rgba(229, 56, 59, 0.1)",
                borderColor: theme.colors.red[4],
                color: theme.colors.red[4],
              },
            }}
          >
            Logout
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};
