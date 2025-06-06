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
  IconSchool as IconGraduation,
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
      const profileUrl = `http://localhost:5173/profile/student/${userId || '68344dbaac71a85065c347af'}`;
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
      
      <Box p="xl" style={{ position: 'relative', zIndex: 2 }}>
        <Group align="flex-start" gap="lg">
          {/* Avatar with modern styling */}
          <Box style={{ position: 'relative' }}>
            <Avatar
              src={profilePicture}
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
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={{
                position: 'absolute',
                bottom: -4,
                right: -4,
                background: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                cursor: isUploading ? 'not-allowed' : 'pointer',
                opacity: isUploading ? 0.7 : 1,
              }}
              title="Change profile picture"
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

          {/* Copy Profile Link Button */}
          <ActionIcon
            variant="light"
            size="lg"
            radius="xl"
            onClick={handleCopyProfile}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              cursor: 'pointer',
            }}
            title="Copy profile link"
          >
            <IconCopy size={18} />
          </ActionIcon>
        </Group>
      </Box>
    </Box>
  );
};

export default ModernProfileHeader; 