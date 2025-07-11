import React from "react";
import {
  Box,
  Text,
  Button,
  Stack,
  Group,
  ThemeIcon,
  useMantineTheme,
  Modal,
  Title,
  Paper,
  Badge,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconX,
  IconEdit,
  IconRocket,
  IconClock,
} from "@tabler/icons-react";

interface LimitReachedModalProps {
  opened: boolean;
  onClose: () => void;
  type: 'edit' | 'boost';
  currentCount: number;
  maxCount: number;
}

export const LimitReachedModal: React.FC<LimitReachedModalProps> = ({
  opened,
  onClose,
  type,
  currentCount,
  maxCount,
}) => {
  const theme = useMantineTheme();

  const getModalContent = () => {
    switch (type) {
      case 'edit':
        return {
          title: 'Edit Limit Reached',
          icon: <IconEdit size={24} />,
          description: 'You have reached your monthly limit for editing posts.',
          feature: 'post edits',
          iconColor: theme.colors.orange[4],
          gradientColors: { from: 'orange', to: 'red' },
        };
      case 'boost':
        return {
          title: 'Boost Limit Reached',
          icon: <IconRocket size={24} />,
          description: 'You have reached your monthly limit for boosting posts.',
          feature: 'post boosts',
          iconColor: theme.colors.yellow[4],
          gradientColors: { from: 'yellow', to: 'orange' },
        };
      default:
        return {
          title: 'Limit Reached',
          icon: <IconAlertTriangle size={24} />,
          description: 'You have reached your monthly limit.',
          feature: 'actions',
          iconColor: theme.colors.red[4],
          gradientColors: { from: 'red', to: 'pink' },
        };
    }
  };

  const content = getModalContent();

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size="md"
      centered
      title={
        <Group>
          <IconAlertTriangle size={24} color={theme.colors.red[4]} />
          <Title order={3} c="white">
            {content.title}
          </Title>
        </Group>
      }
      styles={{
        header: {
          backgroundColor: theme.colors.dark[7],
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        body: {
          backgroundColor: theme.colors.dark[7],
          padding: 0,
        },
        content: {
          backgroundColor: theme.colors.dark[7],
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      }}
    >
      <Box p="xl">
        {/* Decorative gradient background */}
        <Box
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: "80px",
            height: "80px",
            background: `radial-gradient(circle, rgba(239, 68, 68, 0.2) 0%, rgba(239, 68, 68, 0) 70%)`,
            borderRadius: "50%",
            filter: "blur(15px)",
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        {/* Error-like status with icon */}
        <Group mb="lg" justify="center">
          <ThemeIcon
            size="xl"
            radius="50%"
            variant="gradient"
            gradient={content.gradientColors}
            style={{
              animation: 'pulse 2s ease-in-out infinite',
            }}
          >
            {content.icon}
          </ThemeIcon>
        </Group>

        {/* Main message */}
        <Paper
          p="md"
          radius="md"
          mb="lg"
          style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            textAlign: 'center',
          }}
        >
          <Text size="md" c="white" fw={600} mb="xs">
            {content.description}
          </Text>
          <Text size="sm" c="dimmed">
            You have used {currentCount} out of {maxCount} {content.feature} this month.
          </Text>
        </Paper>

        {/* Limit information */}
        <Box
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            borderRadius: theme.radius.md,
            padding: theme.spacing.md,
            marginBottom: theme.spacing.lg,
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Group gap="sm" mb="sm">
            <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
              <IconClock size={12} />
            </ThemeIcon>
            <Text size="sm" fw={500} c={theme.white}>
              Monthly Limit Information
            </Text>
          </Group>
          
          <Stack gap="xs">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Current Plan:
              </Text>
              <Badge variant="filled" color="blue" size="sm">
                Premium
              </Badge>
            </Group>
            
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                {content.feature.charAt(0).toUpperCase() + content.feature.slice(1)} Used:
              </Text>
              <Text size="sm" c="white" fw={500}>
                {currentCount} / {maxCount}
              </Text>
            </Group>
            
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Resets:
              </Text>
              <Text size="sm" c="white" fw={500}>
                Next billing cycle
              </Text>
            </Group>
          </Stack>
        </Box>

        {/* Action button */}
        <Button
          fullWidth
          variant="light"
          color="gray"
          leftSection={<IconX size={16} />}
          onClick={onClose}
          styles={{
            root: {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: theme.white,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              },
            },
          }}
        >
          Got it
        </Button>

        {/* Additional info */}
        <Text size="xs" c="dimmed" ta="center" mt="md">
          Your limits will reset at the beginning of your next billing cycle.
        </Text>
      </Box>

      {/* CSS animations */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </Modal>
  );
}; 