import React, { useEffect, useRef } from "react";
import {
  Group,
  Button,
  Box,
  rem,
  Container,
  Burger,
  Drawer,
  Stack,
  useMantineTheme,
  Avatar,
  Menu,
  UnstyledButton,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronDown,
  IconSettings,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { useAuthStore } from "../../../store/auth.store";
import { showSuccess } from "../../../utils";
import NavLink from "../../Header/HeaderNavLink";
import Logo from "../../Header/Logo";
import gsap from "gsap";

export const Header: React.FC = () => {
  const [opened, { close }] = useDisclosure(false);
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

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
            <Logo darkMode />
          </Box>

          {/* Desktop Navigation */}
          <Group
            ml="xl"
            ref={navLinksRef}
            display={{ base: "none", sm: "flex" }}
            gap={rem(5)}
          >
            <NavLink to="/app" label="Dashboard" darkMode />
            <NavLink to="/app/colleges" label="Colleges" darkMode />
            <NavLink to="/app/applications" label="Applications" darkMode />
          </Group>

          {/* Desktop User Menu */}
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
              onClose={close}
              onOpen={close}
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
                    <IconSettings
                      style={{ width: rem(16), height: rem(16) }}
                      stroke={1.5}
                    />
                  }
                  onClick={() => navigate("/app/settings")}
                >
                  Settings
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

          {/* Mobile Burger */}
          <Burger
            opened={opened}
            onClick={close}
            color={theme.white}
            display={{ sm: "none" }}
            size="md"
          />
        </Group>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        size="100%"
        padding="md"
        title="Menu"
        hiddenFrom="sm"
        zIndex={1000}
        styles={{
          title: { fontSize: rem(20), fontWeight: 700, color: theme.white },
          header: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            borderBottom: `1px solid ${theme.colors.dark[6]}`,
          },
          body: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            padding: rem(32),
          },
          close: { color: theme.white },
        }}
      >
        <Stack gap="xl">
          <NavLink to="/app" label="Dashboard" darkMode onClick={close} />
          <NavLink
            to="/app/colleges"
            label="Colleges"
            darkMode
            onClick={close}
          />
          <NavLink
            to="/app/applications"
            label="Applications"
            darkMode
            onClick={close}
          />

          <Box h={20} />

          <Button
            fullWidth
            variant="outline"
            color="red"
            radius="md"
            size="md"
            onClick={() => {
              close();
              navigate("/app/profile");
            }}
            style={{
              fontWeight: 600,
              borderColor: theme.colors.red[5],
              color: theme.white,
            }}
          >
            Profile
          </Button>

          <Button
            fullWidth
            variant="outline"
            color="red"
            radius="md"
            size="md"
            onClick={() => {
              close();
              navigate("/app/settings");
            }}
            style={{
              fontWeight: 600,
              borderColor: theme.colors.red[5],
              color: theme.white,
            }}
          >
            Settings
          </Button>

          <Button
            fullWidth
            variant="filled"
            color="red"
            radius="md"
            size="md"
            onClick={() => {
              close();
              handleLogout();
            }}
            style={{
              fontWeight: 600,
              backgroundColor: theme.colors.red[6],
            }}
          >
            Logout
          </Button>
        </Stack>
      </Drawer>
    </Box>
  );
};
