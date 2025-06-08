import React from "react";
import {
  Box,
  Group,
  ActionIcon,
  Text,
  Stack,
  useMantineTheme,
  Modal,
  Button,
} from "@mantine/core";
import {
  IconUser,
  IconCreditCard,
  IconLogout,
  IconHome,
} from "@tabler/icons-react";
import { useNavigate, useLocation } from "react-router";
import { useDisclosure } from "@mantine/hooks";
import { useAuthStore } from "../../../store/auth.store";
import { showSuccess } from "../../../utils";

export const BottomNavigation: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const [logoutModalOpened, { open: openLogoutModal, close: closeLogoutModal }] = useDisclosure(false);

  const handleLogout = async (): Promise<void> => {
    closeLogoutModal();
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
      onClick: openLogoutModal,
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
                size="lg"
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else {
                    navigate(item.path);
                  }
                }}
                style={{
                  padding: "12px",
                  borderRadius: theme.radius.md,
                  transition: "all 0.3s ease",
                  transform: active ? "translateY(-4px) scale(1.1)" : "translateY(0) scale(1)",
                  backgroundColor: active 
                    ? `${item.color}20` 
                    : "transparent",
                }}
              >
                <Stack align="center" gap={2}>
                  <Icon
                    size={22}
                    color={active ? item.color : "#9CA3AF"}
                    style={{
                      transition: "all 0.3s ease",
                      filter: active ? `drop-shadow(0 0 8px ${item.color}40)` : "none",
                    }}
                  />
                  <Text
                    size="xs"
                    fw={active ? 600 : 400}
                    c={active ? item.color : "#6B7280"}
                    style={{
                      transition: "all 0.3s ease",
                      textShadow: active ? `0 0 8px ${item.color}40` : "none",
                    }}
                  >
                    {item.label}
                  </Text>
                </Stack>
              </ActionIcon>
            );
          })}
        </Group>
      </Box>

      {/* Logout Confirmation Modal */}
      <Modal
        opened={logoutModalOpened}
        onClose={closeLogoutModal}
        title="Confirm Logout"
        centered
        size="sm"
        styles={{
          header: {
            backgroundColor: "#101720",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          },
          title: {
            color: theme.white,
            fontWeight: 600,
          },
          close: {
            color: theme.white,
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          },
          body: {
            backgroundColor: "#101720",
          },
          content: {
            backgroundColor: "#101720",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <Stack gap="md">
          <Text c="white" size="sm">
            Are you sure you want to logout? You'll need to sign in again to access your account.
          </Text>
          
          <Group justify="space-between" mt="md">
            <Button
              variant="outline"
              color="gray"
              onClick={closeLogoutModal}
              styles={{
                root: {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: theme.white,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                  },
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color="red"
              onClick={handleLogout}
              styles={{
                root: {
                  backgroundColor: "#E03131",
                  "&:hover": {
                    backgroundColor: "#C92A2A",
                  },
                },
              }}
            >
              Logout
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}; 