import React from 'react';
import { 
  Card, 
  Avatar, 
  Group, 
  Text, 
  ActionIcon, 
  Box, 
  Image,
} from '@mantine/core';
import { 
  IconHeart, 
  IconMessageCircle, 
  IconSend, 
  IconBookmark,
  IconDots,
} from '@tabler/icons-react';

interface InstagramPostProps {
  user: {
    username: string;
    avatar: string;
    verified?: boolean;
  };
  image?: string;
  caption: string;
  likesCount?: number;
  timeAgo?: string;
}

const InstagramPost: React.FC<InstagramPostProps> = ({
  user,
  image,
  caption,
  likesCount = 1247,
  timeAgo = '2 hours ago',
}) => {

  return (
    <Box style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
      <Card 
        padding={0} 
        radius={0} 
        style={{ 
          maxWidth: 470, 
          margin: '0 auto',
          border: '1px solid #dbdbdb',
          backgroundColor: '#fff'
        }}
      >
        {/* Header */}
        <Group justify="space-between" p="sm" style={{ borderBottom: '1px solid #efefef' }}>
          <Group gap="xs">
            <Box
              style={{
                position: 'relative',
                padding: '2px',
                background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar
                src={user.avatar}
                alt={user.username}
                size={32}
                style={{ 
                  border: '2px solid white',
                  borderRadius: '50%',
                }}
              />
            </Box>
            <Text 
              size="sm" 
              fw={600}
              style={{ color: '#262626', fontSize: '14px' }}
            >
              {user.username}
            </Text>
          </Group>
          <ActionIcon variant="transparent" color="dark" size="sm">
            <IconDots size={16} />
          </ActionIcon>
        </Group>

        {/* Image - Only show if image is provided */}
        {image && (
          <Box style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
            <Image
              src={image}
              alt="Post image"
              fit="cover"
              style={{ 
                width: '100%', 
                height: '100%',
                display: 'block'
              }}
              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDcwIiBoZWlnaHQ9IjQ3MCIgdmlld0JveD0iMCAwIDQ3MCA0NzAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0NzAiIGhlaWdodD0iNDcwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yMzUgMjAwQzI0Ny4xIDIwMCAyNTcgMjA5LjkgMjU3IDIyMkMyNTcgMjM0LjEgMjQ3LjEgMjQ0IDIzNSAyNDRDMjIyLjkgMjQ0IDIxMyAyMzQuMSAyMTMgMjIyQzIxMyAyMDkuOSAyMjIuOSAyMDAgMjM1IDIwMFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPHBhdGggZD0iTTI4NSAyNzBIMTg1QzE3OS41IDI3MCAxNzUgMjc0LjUgMTc1IDI4MFYyOTBDMTc1IDI5NS41IDE3OS41IDMwMCAxODUgMzAwSDI4NUMyOTAuNSAzMDAgMjk1IDI5NS41IDI5NSAyOTBWMjgwQzI5NSAyNzQuNSAyOTAuNSAyNzAgMjg1IDI3MFoiIGZpbGw9IiNDQ0NDQ0MiLz4KPC9zdmc+"
            />
          </Box>
        )}

        {/* Actions */}
        <Group justify="space-between" p="sm" pb="xs">
          <Group gap="md">
            <ActionIcon variant="transparent" color="dark" size="sm">
              <IconHeart size={24} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="transparent" color="dark" size="sm">
              <IconMessageCircle size={24} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="transparent" color="dark" size="sm">
              <IconSend size={24} stroke={1.5} />
            </ActionIcon>
          </Group>
          <ActionIcon variant="transparent" color="dark" size="sm">
            <IconBookmark size={24} stroke={1.5} />
          </ActionIcon>
        </Group>

        {/* Likes */}
        <Box px="sm" pb="xs">
          <Text 
            size="sm" 
            fw={600}
            style={{ color: '#262626', fontSize: '14px' }}
          >
            {likesCount.toLocaleString()} likes
          </Text>
        </Box>

        {/* Caption */}
        <Box px="sm" pb="sm">
          <Text 
            size="sm"
            style={{ color: '#262626', fontSize: '14px', lineHeight: '18px' }}
          >
            <Text 
              component="span" 
              fw={600} 
              style={{ marginRight: '8px' }}
            >
              {user.username}
            </Text>
            {caption}
          </Text>
        </Box>

        {/* Time */}
        <Box px="sm" pb="sm">
          <Text 
            size="xs"
            style={{ color: '#8e8e8e', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2px' }}
          >
            {timeAgo}
          </Text>
        </Box>
      </Card>
    </Box>
  );
};

export default InstagramPost; 