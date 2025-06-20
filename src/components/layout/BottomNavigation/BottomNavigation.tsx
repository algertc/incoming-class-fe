import React, { useState } from "react";
import {
  Box,
  Group,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import {
  IconUser,
  IconCreditCard,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router";
import { useAuthStore } from "../../../store/auth.store";
import { showSuccess } from "../../../utils";
import ConfirmDialog from "../../common/ConfirmDialog";

export const BottomNavigation: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = async (): Promise<void> => {
    await logout();
    showSuccess("Logged out successfully");
    navigate("/login");
  };

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
    {
      icon: IconLogout,
      label: "Logout",
      path: "#logout",
      color: "#FF6B6B",
      onClick: () => setLogoutDialogOpen(true),
    },
  ];

  const isActive = (path: string) => {
    if (path === "/app") {
      return location.pathname === "/app" || location.pathname === "/app/feed";
    }
    return location.pathname === path;
  };

  return (
    <>
      <Box
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: "rgba(0, 0, 0, 0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          padding: "8px 0 max(8px, env(safe-area-inset-bottom))",
        }}
      >
        <Group justify="space-around" align="center" gap={0}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <ActionIcon
                key={item.label}
                variant="transparent"
                size="xl"
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    navigate(item.path);
                  }
                }}
                styles={{
                  root: {
                    padding: "12px",
                    borderRadius: theme.radius.md,
                    transition: "all 0.3s ease",
                    transform: active ? "translateY(-2px) scale(1.05)" : "translateY(0) scale(1)",
                    backgroundColor: active ? `${item.color}20` : "transparent",
                  },
                }}
                title={item.label}
              >
                <Icon
                  color={active ? item.color : "#9CA3AF"}
                  stroke={1.5}
                  style={{ width: 28, height: 28 }}
                />
              </ActionIcon>
            );
          })}
        </Group>
      </Box>

      <ConfirmDialog
        open={logoutDialogOpen}
        title="Confirm Logout"
        description="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmLabel="Logout"
        cancelLabel="Cancel"
        onConfirm={() => {
          setLogoutDialogOpen(false);
          handleLogout();
        }}
        onCancel={() => setLogoutDialogOpen(false)}
      />
    </>
  );
};

export default BottomNavigation; 