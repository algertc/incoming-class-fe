import React, { useRef } from 'react';
import {
  Box,
  Avatar,
  Title,
  Text,
  Group,
  ActionIcon,
  Badge,
  Progress,
  Stack,
  rem,
  LoadingOverlay,
} from '@mantine/core';
import {
  IconCopy,
  IconMapPin,
  IconCamera,
  IconSparkles,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useUploadProfilePicture, createProfileImageFormData, validateSingleImageFile } from '../../../hooks/api';

interface ModernProfileHeaderProps {
  name: string;
  designation: string;
  profilePicture: string;
  hometown: string;
  bio: string;
  isPremium: boolean;
  profileCompletion: number;
  userId?: string;
}

const ModernProfileHeader: React.FC<ModernProfileHeaderProps> = ({
  name,
  designation,
  profilePicture,
  hometown,
  bio,
  isPremium,
  profileCompletion,
  userId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: uploadProfilePicture, isPending: isUploading } = useUploadProfilePicture();
  
  const handleCopyProfile = async () => {
    try {
      const profileUrl = `https://incomingclass.com/profile/student/${userId || '68344dbaac71a85065c347af'}`;
      await navigator.clipboard.writeText(profileUrl);
      
      notifications.show({
        title: 'Copied!',
        message: 'Profile link copied to clipboard',
        color: 'green',
        autoClose: 3000,
      });
    } catch {
      notifications.show({
        title: 'Error',
        message: 'Failed to copy profile link',
        color: 'red',
        autoClose: 3000,
      });
    }
  };

  const handleProfileImageUpload = async (file: File) => {
    try {
      // Validate file first
      const validation = validateSingleImageFile(file);
      if (!validation.isValid) {
        notifications.show({
          title: 'Invalid File',
          message: validation.error || 'Please select a valid image file',
          color: 'red',
          autoClose: 5000,
        });
        return;
      }

      // Create FormData and upload
      const formData = createProfileImageFormData(file);
      const response = await uploadProfilePicture(formData);

      if (response.status) {
        notifications.show({
          title: 'Success!',
          message: 'Profile picture updated successfully',
          color: 'green',
          autoClose: 3000,
        });
      } else {
        throw new Error(response.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      notifications.show({
        title: 'Upload Failed',
        message: error instanceof Error ? error.message : 'Failed to upload profile picture',
        color: 'red',
        autoClose: 5000,
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleProfileImageUpload(file);
    }
    // Reset the file input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <Box
      style={{
        position: 'relative',
        marginBottom: rem(16),
        minHeight: rem(180),
        background: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)',
        borderRadius: rem(20),
        overflow: 'hidden',
      }}
    >
      <LoadingOverlay visible={isUploading} overlayProps={{ blur: 2 }} />
      
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        style={{ display: 'none' }}
      />

      {/* Animated background elements */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(67, 97, 238, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(76, 201, 240, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
          `,
          animation: 'pulse 4s ease-in-out infinite alternate',
        }}
      />
      
      <Box p={{ base: 'md', sm: 'xl' }} style={{ position: 'relative', zIndex: 2 }}>
        <Stack gap="md">
          {/* Avatar with modern styling */}
          <Group justify="center" style={{ width: '100%' }}>
            <Box style={{ position: 'relative' }}>
              <Avatar
                src={profilePicture}
                size="lg"
                radius="50%"
                styles={{
                  root: {
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '@media (max-width: 48em)': {
                      width: rem(80),
                      height: rem(80),
                    },
                  }
                }}
              />
              <ActionIcon
                variant="filled"
                radius="xl"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                styles={{
                  root: {
                    position: 'absolute',
                    bottom: -4,
                    right: -4,
                    background: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    opacity: isUploading ? 0.7 : 1,
                    '@media (max-width: 48em)': {
                      width: rem(24),
                      height: rem(24),
                    },
                  }
                }}
                title="Change profile picture"
              >
                <IconCamera style={{ width: rem(14), height: rem(14) }} />
              </ActionIcon>
            </Box>
          </Group>

          {/* Profile Info */}
          <Stack gap="xs" align="center" style={{ width: '100%' }}>
            <Group gap="sm" justify="center" wrap="nowrap">
              <Title order={2} c="white" fw={700} size="h3" ta="center">
                {name}
              </Title>
              {isPremium && (
                <Badge
                  variant="gradient"
                  gradient={{ from: 'gold', to: 'yellow' }}
                  size="sm"
                  styles={{
                    root: {
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      '@media (max-width: 48em)': {
                        fontSize: 'var(--mantine-font-size-xs)',
                        height: rem(20),
                      },
                    }
                  }}
                >
                  <Group gap={4} wrap="nowrap">
                    <IconSparkles style={{ width: rem(12), height: rem(12) }} />
                    <Text size="xs">Premium</Text>
                  </Group>
                </Badge>
              )}
            </Group>

            <Group gap="xs" justify="center">
              <Text c="white" size="sm" fw={500}>
                {designation}
              </Text>
              {hometown && (
                <Group gap={4} wrap="nowrap">
                  <IconMapPin style={{ width: rem(14), height: rem(14) }} color="white" />
                  <Text c="white" size="sm">
                    {hometown}
                  </Text>
                </Group>
              )}
            </Group>

            {bio && (
              <Text
                c="white"
                size="sm"
                opacity={0.9}
                ta="center"
                maw={600}
                mx="auto"
                styles={{
                  root: {
                    lineHeight: 1.6,
                  }
                }}
              >
                {bio}
              </Text>
            )}

            <Group gap="sm" mt="xs" justify="center">
              <ActionIcon
                variant="subtle"
                color="white"
                onClick={handleCopyProfile}
                size="sm"
                title="Copy profile link"
              >
                <IconCopy style={{ width: rem(14), height: rem(14) }} />
              </ActionIcon>
             
            </Group>
          </Stack>

          {/* Profile Completion Progress */}
          <Box style={{ width: '100%', maxWidth: rem(400), margin: '0 auto' }}>
            <Group justify="space-between" mb={4}>
              <Text size="xs" c="white" fw={500}>
                Profile Completion
              </Text>
              <Text size="xs" c="white" fw={500}>
                {profileCompletion}%
              </Text>
            </Group>
            <Progress
              value={profileCompletion}
              color="white"
              radius="xl"
              size="xs"
              styles={{
                root: {
                  '@media (min-width: 48em)': {
                    height: rem(8),
                  },
                }
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ModernProfileHeader; 