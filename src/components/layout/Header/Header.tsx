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
} from "@mantine/core";
import { Link, useNavigate } from "react-router";
import {
  IconChevronDown,
  IconUser,
  IconCreditCard,
  IconLogout,
} from "@tabler/icons-react";
import { useAuthStore } from "../../../store/auth.store";
import Logo from "../../Header/Logo";
import gsap from "gsap";

export const Header: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

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
/* eslint-disable  @typescript-eslint/no-explicit-any */
  const fullName = user ? `${(user as any).user.firstName} ${(user as any).user.lastName}` : "";

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
        <Group justify="space-between" align="center" style={{ height: "100%" }} wrap="nowrap">
          {/* Logo */}
          <Box ref={logoRef} style={{ flexShrink: 0 }}>
            <Link to="/app">
              <Logo darkMode />
            </Link>
          </Box>

          {/* User Menu - Responsive */}
          <Box ref={buttonsRef} style={{ flexShrink: 0, minWidth: 0 }}>
            <Menu
              width="target"
              position="bottom-end"
              transitionProps={{ transition: "pop-top-right" }}
            >
              <Menu.Target>
                <UnstyledButton
                  style={{
                    padding: `${rem(8)} ${rem(12)}`,
                    borderRadius: theme.radius.md,
                    color: theme.white,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    transition: "all 0.2s ease",
                    minWidth: 0,
                    maxWidth: "200px", // Prevent button from getting too wide
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <Group gap="xs" wrap="nowrap" style={{ minWidth: 0 }}>
                    <Avatar
                      src={user?.profilePicture}
                      alt={fullName}
                      radius="xl"
                      size="sm"
                      style={{ flexShrink: 0 }}
                      styles={{
                        root: {
                          border: "2px solid rgba(255, 255, 255, 0.2)",
                        },
                      }}
                    />
                    {/* Show full info on desktop, minimal on mobile */}
                    <Box 
                      style={{ 
                        flex: 1, 
                        minWidth: 0,
                        overflow: "hidden"
                      }}
                      visibleFrom="sm"
                    >
                      <Text 
                        fw={600} 
                        size="sm" 
                        lh={1.2} 
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {fullName}
                      </Text>
                      <Text 
                        size="xs" 
                        c="dimmed" 
                        lh={1}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {user?.email}
                      </Text>
                    </Box>
                    {/* Show only name on mobile, truncated */}
                    <Box 
                      style={{ 
                        flex: 1, 
                        minWidth: 0,
                        overflow: "hidden",
                        maxWidth: "80px" // Limit width on mobile
                      }}
                      hiddenFrom="sm"
                    >
                      <Text 
                        fw={600} 
                        size="sm" 
                        lh={1.2}
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {user?.firstName || fullName}
                      </Text>
                    </Box>
                    <IconChevronDown
                      style={{ 
                        width: rem(14), 
                        height: rem(14),
                        flexShrink: 0
                      }}
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
                      style={{ width: rem(14), height: rem(14) }}
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
                      style={{ width: rem(14), height: rem(14) }}
                      stroke={1.5}
                    />
                  }
                  onClick={() => navigate("/app/subscription")}
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
                    navigate("/login");
                  }}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </Group>
      </Container>
    </Box>
  );
};
