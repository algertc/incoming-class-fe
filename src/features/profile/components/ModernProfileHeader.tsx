import React, { useRef } from 'react';
import {
  Box,
  Avatar,
  Title,
  Text,
  Group,
  Badge,
  Stack,
  rem,
  LoadingOverlay,
  Flex,
} from '@mantine/core';
import {
  IconMapPin,
  IconSparkles,
  IconGenderMale,
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { useUploadProfilePicture, createProfileImageFormData, validateSingleImageFile } from '../../../hooks/api';
import { useAuthStore } from '../../../store/auth.store';
import { ProfileGlowEffect } from '../../../components/common/ProfileGlowEffect';
import ProfileCameraButton from '../../../components/common/ProfileCameraButton';
import { Gender } from '../../../models/user.model';

interface ModernProfileHeaderProps {
  name: string;
  designation: string;
  profilePicture: string;
  hometown: string;
  bio: string;
  isPremium: boolean;
  isEditable?: boolean;
  gender?: Gender;
}

const ModernProfileHeader: React.FC<ModernProfileHeaderProps> = ({
  name,
  profilePicture,
  hometown,
  bio,
  isPremium,
  isEditable = false,
  gender,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fetchUser } = useAuthStore();
  const { 
    mutateAsync: uploadProfilePicture, 
    isPending: isUploading, 
  } = useUploadProfilePicture();

  const handleProfileImageUpload = async (file: File) => {
    try {
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

      const formData = createProfileImageFormData(file);
      const response = await uploadProfilePicture(formData);

      if (response.status) {
        notifications.show({
          title: 'Success!',
          message: 'Profile picture updated successfully',
          color: 'green',
          autoClose: 3000,
        });
        fetchUser();
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
      {isEditable && <LoadingOverlay visible={isUploading} overlayProps={{ blur: 2 }} />}
      
      {isEditable && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/jpg,image/png,image/webp"
          style={{ display: 'none' }}
        />
      )}

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
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: 'center', md: 'flex-start' }}
          gap={{ base: 'md', md: 'xl' }}
        >
          <Box style={{ position: 'relative', flexShrink: 0 }}>
            <ProfileGlowEffect isActive={!profilePicture}>
              <Avatar
                src={profilePicture}
                radius="50%"
                styles={{
                  root: {
                    width: rem(140),
                    height: rem(140),
                    border: '4px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    '@media (max-width: 768px)': {
                      width: rem(120),
                      height: rem(120),
                    },
                  }
                }}
              />
            </ProfileGlowEffect>
            {isEditable && (
              <ProfileCameraButton
                onClick={() => fileInputRef.current?.click()}
                isUploading={isUploading}
                hasProfilePicture={!!profilePicture}
              />
            )}
          </Box>

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
                    fontSize: rem(24)
                  }
                }}
              >
                {name}
              </Title>
              {isPremium && (
                <Badge
                  variant="gradient"
                  gradient={{ from: 'yellow', to: 'orange' }}
                  size="lg"
                  leftSection={<IconSparkles size={14} />}
                >
                  Premium
                </Badge>
              )}
            </Group>

            {hometown && (
              <Group gap="xs">
                <IconMapPin size={16} color="white" style={{ opacity: 0.7 }} />
                <Text size="sm" c="white" style={{ opacity: 0.7 }}>
                  {hometown}
                </Text>
              </Group>
            )}

            {gender && (
              <Group gap="xs">
                <IconGenderMale size={16} color="white" style={{ opacity: 0.7 }} />
                <Text size="sm" c="white" style={{ opacity: 0.7 }}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Text>
              </Group>
            )}

            {bio && (
              <Text
                size="sm"
                c="white"
                style={{
                  opacity: 0.9,
                  maxWidth: rem(600),
                  lineHeight: 1.6,
                }}
              >
                {bio}
              </Text>
            )}
          </Stack>
        </Flex>
      </Box>
    </Box>
  );
};

export default ModernProfileHeader; 