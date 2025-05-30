import React from 'react';
import {
  Box,
  Avatar,
  Title,
  Text,
  Group,
  Button,
  ActionIcon,
  useMantineTheme,
} from '@mantine/core';
import {
  IconEdit,
  IconSettings,
  IconShare,
} from '@tabler/icons-react';
import { useNavigate } from 'react-router';

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
      {isCurrentUser ? (
        <Group
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
          }}
        >
          <Button
            leftSection={<IconSettings size={16} />}
            variant="light"
            size="sm"
            onClick={() => navigate('/app/settings')}
            color="indigo"
          >
            Settings
          </Button>
          <Button
            leftSection={<IconShare size={16} />}
            variant="outline"
            size="sm"
            onClick={() => console.log('Share profile')}
            color="indigo"
          >
            Share
          </Button>
        </Group>
      ) : (
        <Group
          style={{
            position: 'absolute',
            top: 20,
            right: 20,
          }}
        >
          <Button
            leftSection={<IconShare size={16} />}
            variant="outline"
            size="sm"
            color="indigo"
          >
            Share
          </Button>
        </Group>
      )}

      {/* Name and Designation Container */}
      <Box
        style={{
          position: 'absolute',
          top: 40,
          left: 160,
          color: 'white',
        }}
      >
        <Title order={3}>
          {name}
        </Title>
        <Text size="lg">
          {designation}
        </Text>
      </Box>
    </Box>
  );
};

export default ProfileBanner; 