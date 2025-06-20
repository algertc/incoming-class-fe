import React from "react";
import {
  Box,
  Group,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  IconUser,
  IconCreditCard,
  IconHome,
} from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router";

export const BottomNavigation: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    {
      icon: IconHome,
      label: "Feed",
      path: "/app",
      color: "#4C6EF5",
    },
    {
      icon: IconUser,
      label: "Profile",
      path: "/app/profile",
      color: "#51CF66",
    },
    {
      icon: IconCreditCard,
      label: "Subscription",
      path: "/app/subscription",
      color: "#9775FA",
    },
  ];

  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app" || location.pathname === "/app/feed";
    }
    return location.pathname === path;
  };

  return (
    <Box
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.95) 100%)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        padding: "12px 0",
        zIndex: 1000,
      }}
    >
      <Group justify="space-around" align="center">
        {navItems.map((item) => (
          <ActionIcon
            key={item.path}
            variant="transparent"
            onClick={() => navigate(item.path)}
            style={{
              color: isActive(item.path) ? item.color : theme.colors.gray[6],
              transition: "all 0.2s ease",
            }}
          >
            <item.icon size={28} stroke={1.5} />
          </ActionIcon>
        ))}
      </Group>
    </Box>
  );
};

export default BottomNavigation; 