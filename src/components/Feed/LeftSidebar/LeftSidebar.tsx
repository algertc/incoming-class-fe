import React from "react";
import {
  Box,
  Avatar,
  Text,
  Stack,
  Group,
  Button,
  NavLink,
  Divider,
  Badge,
  useMantineTheme,
} from "@mantine/core";
import {
  IconHome2,
  IconMessageCircle,
  IconBell,
  IconBookmark,
  IconSettings,
  IconTrendingUp,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";

interface UserType {
  firstName?: string;
  lastName?: string;
  email?: string;
  profileImage?: string;
}

interface LeftSidebarProps {
  user: UserType | null;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ user }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  // Navigation items for the sidebar
  const navItems = [
    { icon: <IconHome2 size={20} />, label: "Home", path: "/feed" },
    { icon: <IconMessageCircle size={20} />, label: "Messages", path: "/messages", badge: "3" },
    { icon: <IconBell size={20} />, label: "Notifications", path: "/notifications", badge: "5" },
    { icon: <IconBookmark size={20} />, label: "Saved", path: "/saved" },
    { icon: <IconSettings size={20} />, label: "Settings", path: "/settings" },
  ];

  // Trending topics
  const trendingTopics = [
    { tag: "#IncomingClass", posts: "2.5k" },
    { tag: "#CollegeLife", posts: "1.8k" },
    { tag: "#Roommates", posts: "950" },
    { tag: "#CampusTips", posts: "720" },
  ];

  return (
    <Box
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: theme.radius.md,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: theme.spacing.md,
        position: "sticky",
        top: 100, // Account for header
      }}
    >
      {/* User Profile Section */}
      <Box mb="xl">
        <Group mb="md">
          <Avatar 
            src={user?.profileImage} 
            size="lg" 
            radius="xl" 
            styles={{
              root: {
                border: "2px solid rgba(255, 255, 255, 0.2)",
              },
            }}
          />
          <Box>
            <Text fw={600} size="md" c={theme.white}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text size="xs" c="dimmed">
              {user?.email}
            </Text>
          </Box>
        </Group>
        
        <Group>
          <Box>
            <Text size="xs" c="dimmed">
              Posts
            </Text>
            <Text fw={600} size="sm" c={theme.white}>
              38
            </Text>
          </Box>
          
          <Button 
            variant="light" 
            color="blue" 
            size="xs" 
            radius="xl"
            onClick={() => navigate("/profile")}
            ml="auto"
          >
            View Profile
          </Button>
        </Group>
      </Box>
      
      <Divider 
        color="rgba(255, 255, 255, 0.1)" 
        mb="md"
      />
      
      {/* Navigation Links */}
      <Stack gap="xs" mb="xl">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            label={item.label}
            leftSection={item.icon}
            rightSection={
              item.badge ? (
                <Badge size="xs" variant="filled" color="blue">
                  {item.badge}
                </Badge>
              ) : null
            }
            active={window.location.pathname === item.path}
            onClick={() => navigate(item.path)}
            style={{
              borderRadius: theme.radius.md,
              color: theme.white,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          />
        ))}
      </Stack>
      
      <Divider 
        color="rgba(255, 255, 255, 0.1)" 
        mb="md"
      />
      
      {/* Trending Topics */}
      <Box>
        <Group mb="md" align="center">
          <IconTrendingUp size={20} color={theme.colors.blue[5]} />
          <Text fw={600} size="sm" c={theme.white}>
            Trending Topics
          </Text>
        </Group>
        
        <Stack gap="xs">
          {trendingTopics.map((topic, index) => (
            <Group key={index} justify="space-between">
              <Text size="sm" c={theme.colors.blue[4]} fw={500}>
                {topic.tag}
              </Text>
              <Text size="xs" c="dimmed">
                {topic.posts} posts
              </Text>
            </Group>
          ))}
        </Stack>
      </Box>
    </Box>
  );
};

export default LeftSidebar; 