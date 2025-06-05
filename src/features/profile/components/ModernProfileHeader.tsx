import React from 'react';
import {
  Box,
  Avatar,
  Title,
  Text,
  Group,
  Button,
  ActionIcon,
  Badge,
  Progress,
  Stack,
  rem,
} from '@mantine/core';
import {
  IconSettings,
  IconShare,
  IconMapPin,
  IconCamera,
  IconSchool as IconGraduation,
  IconSparkles,
} from '@tabler/icons-react';

interface ModernProfileHeaderProps {
  name: string;
  designation: string;
  profileImage: string;
  hometown: string;
  bio: string;
  isPremium: boolean;
  profileCompletion: number;
  onSettingsClick: () => void;
}

const ModernProfileHeader: React.FC<ModernProfileHeaderProps> = ({
  name,
  designation,
  profileImage,
  hometown,
  bio,
  isPremium,
  profileCompletion,
  onSettingsClick,
}) => {
  return (
    <Box
      style={{
        position: 'relative',
        marginBottom: rem(16),
        minHeight: rem(180),
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: rem(20),
        overflow: 'hidden',
      }}
    >
      {/* Animated background elements */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        }}
      />
      
      <Box p="xl" style={{ position: 'relative', zIndex: 2 }}>
        <Group align="flex-start" gap="lg">
          {/* Avatar with modern styling */}
          <Box style={{ position: 'relative' }}>
            <Avatar
              src={profileImage}
              size={100}
              radius="50%"
              style={{
                border: '3px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            />
            <ActionIcon
              variant="filled"
              radius="xl"
              size="md"
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <IconCamera size={16} />
            </ActionIcon>
          </Box>

          {/* Profile Info */}
          <Stack gap="xs" style={{ flex: 1 }}>
            <Group gap="sm">
              <Title order={2} c="white" fw={700} size="h2">
                {name}
              </Title>
              {isPremium && (
                <Badge
                  size="lg"
                  variant="light"
                  color="yellow"
                  leftSection={<IconSparkles size={14} />}
                  style={{
                    background: 'rgba(255, 235, 59, 0.2)',
                    color: '#FFD700',
                    border: '1px solid rgba(255, 235, 59, 0.3)',
                  }}
                >
                  Premium
                </Badge>
              )}
            </Group>
            
            <Group gap="xs" c="rgba(255, 255, 255, 0.9)">
              <IconGraduation size={16} />
              <Text size="sm" fw={500}>{designation}</Text>
              <Text size="sm">•</Text>
              <IconMapPin size={16} />
              <Text size="sm">{hometown}</Text>
            </Group>

            <Text c="rgba(255, 255, 255, 0.8)" size="sm" lineClamp={2} maw={400}>
              {bio}
            </Text>

            {/* Compact Progress */}
            <Group gap="xs" align="center">
              <Text size="xs" c="rgba(255, 255, 255, 0.7)">Profile</Text>
              <Progress
                value={profileCompletion}
                color="teal"
                size="sm"
                radius="xl"
                style={{ flex: 1, maxWidth: 120 }}
              />
              <Text size="xs" c="rgba(255, 255, 255, 0.9)" fw={600}>
                {profileCompletion}%
              </Text>
            </Group>
          </Stack>

          {/* Action Buttons */}
          <Group gap="xs">
            <Button
              leftSection={<IconSettings size={16} />}
              variant="light"
              size="sm"
              radius="xl"
              color="blue"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
              onClick={onSettingsClick}
            >
              Settings
            </Button>
            <ActionIcon
              variant="light"
              size="lg"
              radius="xl"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'white',
              }}
            >
              <IconShare size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>
    </Box>
  );
};

export default ModernProfileHeader; 