import React from "react";
import {
  Box,
  Text,
  Button,
  Stack,
  Group,
  ThemeIcon,
  List,
  Badge,
  useMantineTheme,
} from "@mantine/core";
import {
  IconStarFilled,
  IconCheck,
  IconCrown,
  IconRocket,
  IconBrandTelegram,
} from "@tabler/icons-react";

export const PremiumFeatures: React.FC = () => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: theme.radius.md,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: theme.spacing.md,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative gradient background */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "150px",
          height: "150px",
          background:
            "radial-gradient(circle, rgba(67, 97, 238, 0.3) 0%, rgba(67, 97, 238, 0) 70%)",
          borderRadius: "50%",
          filter: "blur(20px)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      {/* Premium Badge */}
      <Group mb="md" justify="space-between">
        <Group>
          <IconCrown size={20} color={theme.colors.yellow[4]} />
          <Text fw={600} size="sm" c={theme.white}>
            Premium Features
          </Text>
        </Group>
        <Badge
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          size="sm"
        >
          Exclusive
        </Badge>
      </Group>

      {/* Premium Content */}
      <Box
        style={{
          backgroundColor: "rgba(67, 97, 238, 0.1)",
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md,
          border: "1px solid rgba(67, 97, 238, 0.2)",
        }}
      >
        <Group mb="sm">
          <ThemeIcon
            size="xl"
            radius="md"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            <IconStarFilled size={20} />
          </ThemeIcon>
          <Box>
            <Text fw={600} size="sm" c={theme.white}>
              Unlock Premium
            </Text>
            <Text size="xs" c="dimmed">
              Enhance your college journey
            </Text>
          </Box>
        </Group>

        <List
          spacing="sm"
          size="sm"
          mb="md"
          center
          styles={{
            itemWrapper: {
              color: theme.white,
            },
          }}
          icon={
            <ThemeIcon color="blue" size="sm" radius="xl">
              <IconCheck size={12} />
            </ThemeIcon>
          }
        >
          <List.Item>Access to exclusive college events</List.Item>
          <List.Item>Connect with alumni network</List.Item>
          <List.Item>Priority application support</List.Item>
          <List.Item>Ad-free browsing experience</List.Item>
        </List>

        <Button
          fullWidth
          variant="gradient"
          gradient={{ from: "indigo", to: "cyan" }}
          leftSection={<IconRocket size={16} />}
        >
          Upgrade Now
        </Button>
      </Box>

      {/* Featured Premium Content */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Featured Premium Content
      </Text>
      <Stack gap="sm">
        <PremiumContentCard
          title="Interview Preparation"
          description="Exclusive tips from successful applicants"
          badge="Popular"
        />
        <PremiumContentCard
          title="Scholarship Guide"
          description="Find scholarships matching your profile"
          badge="New"
        />
        <PremiumContentCard
          title="Housing Options"
          description="Compare on and off-campus housing"
        />
      </Stack>

      {/* Newsletter Signup */}
      <Box
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          marginTop: theme.spacing.md,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Group mb="xs">
          <IconBrandTelegram size={20} color={theme.colors.blue[5]} />
          <Text size="sm" fw={500} c={theme.white}>
            Subscribe to Updates
          </Text>
        </Group>
        <Text size="xs" c="dimmed" mb="md">
          Get notified about new premium features and exclusive content.
        </Text>
        <Button
          variant="light"
          color="blue"
          fullWidth
          size="sm"
        >
          Subscribe
        </Button>
      </Box>
    </Box>
  );
};

// Helper component for premium content cards
const PremiumContentCard: React.FC<{
  title: string;
  description: string;
  badge?: string;
}> = ({ title, description, badge }) => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: theme.radius.md,
        padding: theme.spacing.sm,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Group justify="space-between" mb="xs">
        <Text size="sm" fw={500} c={theme.white}>
          {title}
        </Text>
        {badge && (
          <Badge size="xs" variant="filled" color="blue">
            {badge}
          </Badge>
        )}
      </Group>
      <Text size="xs" c="dimmed">
        {description}
      </Text>
    </Box>
  );
}; 