import React from 'react';
import {
  Box,
  Avatar,
  Title,
  Text,
  Group,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';
import {
  IconEdit,
  IconSettings,
  IconShare,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import { ProfileGlowEffect } from '../../../components/common/ProfileGlowEffect';

interface ProfileBannerProps {
  name: string;
  designation: string;
  profileImage: string;
  isCurrentUser?: boolean;
}

const ProfileBanner: React.FC<ProfileBannerProps> = ({
  name,
  designation,
  profileImage,
  isCurrentUser = false,
}) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  return (
    <Box
      style={{
        position: 'relative',
        marginBottom: 40,
        borderRadius: theme.radius.md,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        background: theme.colors.dark[7],
        padding: '20px',
        minHeight: '100px',
      }}
    >
      {/* Profile Picture */}
      <ProfileGlowEffect isActive={!profileImage}>
        <Avatar
          src={profileImage}
          size={120}
          radius={60}
          style={{
            border: `4px solid ${theme.colors.indigo[8]}`,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
            marginRight: '20px',
          }}
        />
      </ProfileGlowEffect>

      {/* Edit Profile Picture Button - Only for current user */}
      {isCurrentUser && (
        <ActionIcon
          color="indigo"
          variant="filled"
          radius="xl"
          size="sm"
          style={{
            position: 'absolute',
            top: 95,
            left: 95,
            zIndex: 10,
          }}
          onClick={() => console.log('Change profile picture')}
        >
          <IconEdit size={14} />
        </ActionIcon>
      )}

      {/* Action Buttons - Only for current user */}
      {isCurrentUser && (
        <Group gap={8} style={{ position: 'absolute', top: 20, right: 20 }}>
          <ActionIcon variant="subtle" color="gray" onClick={() => navigate('/settings')}>
            <IconSettings size={20} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray">
            <IconShare size={20} />
          </ActionIcon>
        </Group>
      )}

      {/* Profile Info */}
      <Box mt={20}>
        <Title order={3} style={{ color: theme.white }}>{name}</Title>
        <Text size="sm" c="dimmed">{designation}</Text>
      </Box>
    </Box>
  );
};

export default ProfileBanner; 