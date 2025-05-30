import React from 'react';
import {
  Box,
  Card,
  Group,
  Title,
  Button,
  Paper,
  Skeleton,
  Stack,
  Text,
  useMantineTheme
} from '@mantine/core';
import { IconPhoto } from '@tabler/icons-react';
import type { Post } from '../../../features/feed/components/PostCard';
import ProfilePostCard from './ProfilePostCard';

interface PostsTabProps {
  posts: Post[];
  isLoading: boolean;
  isCurrentUser?: boolean;
  userName?: string;
  onCreatePost?: () => void;
}

const PostsTab: React.FC<PostsTabProps> = ({
  posts,
  isLoading,
  isCurrentUser = false,
  userName = 'Your',
  onCreatePost = () => console.log('Create a new post')
}) => {
  const theme = useMantineTheme();
  
  return (
    <Box>
      <Card shadow="sm" padding="md" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5], marginBottom: '20px' }}>
        {isCurrentUser ? (
          <Group justify="space-between" mb="md">
            <Title order={4} c="white">Your Posts</Title>
            <Button 
              leftSection={<IconPhoto size={16} />}
              variant="light"
              color="indigo"
              onClick={onCreatePost}
            >
              Create Post
            </Button>
          </Group>
        ) : (
          <Title order={4} c="white">{userName}'s Posts</Title>
        )}
      </Card>
      
      {isLoading ? (
        <Stack>
          {Array(2).fill(0).map((_, index) => (
            <Paper key={index} shadow="sm" p="md" radius="md" withBorder bg={theme.colors.dark[7]}>
              <Group mb="md">
                <Skeleton height={40} circle />
                <Box style={{ flex: 1 }}>
                  <Skeleton height={12} width="40%" mb="xs" />
                  <Skeleton height={10} width="20%" />
                </Box>
              </Group>
              <Skeleton height={12} mb="xs" />
              <Skeleton height={12} mb="xs" />
              <Skeleton height={12} width="80%" mb="md" />
              <Skeleton height={200} mb="md" />
              <Group>
                <Skeleton height={30} width="30%" />
                <Skeleton height={30} width="30%" />
                <Skeleton height={30} width="30%" />
              </Group>
            </Paper>
          ))}
        </Stack>
      ) : posts.length > 0 ? (
        <Stack>
          {posts.map((post) => (
            <ProfilePostCard 
              key={post.id} 
              post={post}
            />
          ))}
        </Stack>
      ) : (
        <Card shadow="sm" padding="xl" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
          <Stack align="center" gap="md">
            <IconPhoto size={48} color={theme.colors.gray[5]} />
            <Title order={3} c="white">No posts yet</Title>
            {isCurrentUser ? (
              <>
                <Text c="gray.4" ta="center">
                  You haven't created any posts yet. Share your thoughts, photos, or updates with your classmates.
                </Text>
                <Button 
                  leftSection={<IconPhoto size={16} />}
                  color="indigo"
                  onClick={onCreatePost}
                >
                  Create Your First Post
                </Button>
              </>
            ) : (
              <Text c="gray.4" ta="center">
                {userName} hasn't posted anything yet.
              </Text>
            )}
          </Stack>
        </Card>
      )}
    </Box>
  );
};

export default PostsTab; 