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
  Flex,
  Button,
} from '@mantine/core';
import {
  IconMapPin,
  IconCamera,
  IconSparkles,
  IconEdit,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useNavigate } from 'react-router';
import { useUploadProfilePicture, createProfileImageFormData, validateSingleImageFile } from '../../../hooks/api';
import ROUTES from '../../../constants/routes';

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

  isPremium,
  profileCompletion,

}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { mutateAsync: uploadProfilePicture, isPending: isUploading } = useUploadProfilePicture();
  


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
        minHeight: rem(200),
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
        {/* Desktop: Horizontal Layout, Mobile: Vertical Stack */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'flex-start' }}
          gap={{ base: 'md', md: 'xl' }}
        >
          {/* Avatar Section - Larger sizes */}
          <Box style={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={profilePicture}
                radius="50%"
                styles={{
                  root: {
                  width: rem(140), // Increased from lg (around 80px)
                  height: rem(140),
                  border: '4px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                  '@media (max-width: 768px)': {
                    width: rem(120), // Increased mobile size
                    height: rem(120),
                    },
                  }
                }}
              />
              <ActionIcon
                variant="filled"
                radius="xl"
              size="lg"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                styles={{
                  root: {
                    position: 'absolute',
                  bottom: rem(8),
                  right: rem(8),
                    background: 'linear-gradient(135deg, #4361ee 0%, #4cc9f0 100%)',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                    cursor: isUploading ? 'not-allowed' : 'pointer',
                    opacity: isUploading ? 0.7 : 1,
                  width: rem(36),
                  height: rem(36),
                  '@media (max-width: 768px)': {
                    width: rem(32),
                    height: rem(32),
                    bottom: rem(4),
                    right: rem(4),
                    },
                  }
                }}
                title="Change profile picture"
              >
              <IconCamera style={{ width: rem(18), height: rem(18) }} />
              </ActionIcon>
            </Box>

          {/* Profile Info Section */}
          <Stack 
            gap="sm" 
            align="center"
            style={{ 
              width: '100%',
              '@media (min-width: 768px)': {
                alignItems: 'flex-start',
                textAlign: 'left'
              }
            }}
          >
            {/* Name and Premium Badge */}
            <Group gap="sm" justify="center" wrap="nowrap" style={{
              '@media (min-width: 768px)': {
                justifyContent: 'flex-start'
              }
            }}>
              <Title 
                order={1} 
                c="white" 
                fw={700} 
                size="h2"
                ta="center"
                style={{
                  '@media (max-width: 767px)': {
                    fontSize: 'var(--mantine-font-size-h3)'
                  },
                  '@media (min-width: 768px)': {
                    textAlign: 'left'
                  }
                }}
              >
                {name}
              </Title>
              
              {isPremium && (
                <Badge
                  variant="gradient"
                  gradient={{ from: 'gold', to: 'yellow' }}
                  size="md"
                  styles={{
                    root: {
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  <Group gap={4} wrap="nowrap">
                    <IconSparkles style={{ width: rem(14), height: rem(14) }} />
                    <Text size="sm" fw={600}>Premium</Text>
                  </Group>
                </Badge>
              )}

              {/* Copy Profile Button - Better positioned next to name */}
              {/* <ActionIcon
                variant="subtle"
                color="white"
                onClick={handleCopyProfile}
                size="md"
                title="Copy profile link"
                styles={{
                  root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      transform: 'scale(1.05)',
                    },
                    transition: 'all 0.2s ease',
                  }
                }}
              >
                <IconCopy style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon> */}
            </Group>

            {/* Designation and Location */}
            <Group gap="md" justify="center" wrap="wrap" style={{
              '@media (min-width: 768px)': {
                justifyContent: 'flex-start'
              }
            }}>
              <Text c="white" size="md" fw={500}>
                {designation}
              </Text>
              {hometown && (
                <Group gap={6} wrap="nowrap">
                  <IconMapPin style={{ width: rem(16), height: rem(16) }} color="white" />
                  <Text c="white" size="md">
                    {hometown}
                  </Text>
                </Group>
              )}
            </Group>

            {/* Bio */}
            {/* {bio && (
              <Text
                c="white"
                size="sm"
                opacity={0.9}
                ta="center"
                style={{
                    lineHeight: 1.6,
                  maxWidth: rem(500),
                  '@media (min-width: 768px)': {
                    textAlign: 'left'
                  }
                }}
              >
                {bio}
              </Text>
            )} */}

          {/* Profile Completion Progress */}
            <Box style={{ width: '100%', maxWidth: rem(400) }}>
              <Group justify="space-between" mb={6}>
                <Text size="sm" c="white" fw={500}>
                Profile Completion
              </Text>
                <Text size="sm" c="white" fw={600}>
                {profileCompletion}%
              </Text>
            </Group>
            <Progress
              value={profileCompletion}
              color="white"
              radius="xl"
                size="md"
              styles={{
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                  section: {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            />
            
            {/* Complete Profile Button - Only show if profile is not 100% complete */}
            {profileCompletion < 100 && (
              <Button
                leftSection={<IconEdit style={{ width: rem(16), height: rem(16) }} />}
                variant="gradient"
                gradient={{ from: 'blue', to: 'teal' }}
                size="sm"
                radius="xl"
                mt="sm"
                onClick={() => navigate(ROUTES.PROFILE_COMPLETION)}
                styles={{
                  root: {
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                    },
                    transition: 'all 0.2s ease',
                  }
                }}
              >
                Complete Profile
              </Button>
            )}
          </Box>
        </Stack>
        </Flex>
      </Box>
    </Box>
  );
};

export default ModernProfileHeader; 