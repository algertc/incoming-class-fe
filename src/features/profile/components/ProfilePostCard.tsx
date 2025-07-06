import React from 'react';
import { 
  Paper, 
  Avatar, 
  Text, 
  Group, 
  ActionIcon, 
  Image, 
  Box,
  Menu
} from '@mantine/core';
import { 
  IconDots,
  IconBookmark,
  IconFlag,
  IconTrash
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '../../../features/feed/components/PostCard';

interface ProfilePostCardProps {
  post: Post;
}

const ProfilePostCard: React.FC<ProfilePostCardProps> = ({ post }) => {
  const formattedTime = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
  
  return (
    <Paper shadow="sm" p="md" radius="md" withBorder mb="md">
      {/* Post Header */}
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar src={post.author.profileImage} alt={post.author.name} radius="xl" />
          <Box>
            <Group gap={5}>
              <Text fw={600} size="sm">{post.author.name}</Text>
              {post.author.verified && (
                <Text size="xs" c="blue">✓</Text>
              )}
            </Group>
            <Text size="xs" c="dimmed">{formattedTime}</Text>
          </Box>
        </Group>
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconBookmark size={16} />}>
              Bookmark
            </Menu.Item>
            <Menu.Item leftSection={<IconFlag size={16} />}>
              Report
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconTrash size={16} />} color="red">
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      
      {/* Post Content */}
      {/* Post Title */}
      {post.title && (
        <Text fw={600} size="lg" mb="sm">
          {post.title}
        </Text>
      )}
      
      <Text mb="md">{post.content}</Text>
      
      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <Box mb="md">
          <Image
            src={post.images[0]}
            alt="Post image"
            radius="md"
            fit="cover"
          />
        </Box>
      )}
      
      {/* Post Stats (view-only) */}
      <Text size="xs" c="dimmed" mb="xs">
        {post.likes} likes • {post.comments} comments • {post.shares} shares
      </Text>
    </Paper>
  );
};

export default ProfilePostCard; 