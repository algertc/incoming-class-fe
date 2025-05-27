import React, { useState } from 'react';
import { 
  Box, 
  Paper, 
  Text, 
  Button, 
  Group, 
  Textarea, 
  Avatar, 
  Stack, 
  Skeleton, 
  Container,
  Title
} from '@mantine/core';
import { IconPhoto, IconVideo, IconMoodSmile } from '@tabler/icons-react';
import { useAuthStore } from '../../../store/auth.store';
import PostCard from './PostCard';
import type { Post } from './PostCard';
import { MOCK_POSTS } from '../data/mockPosts';

const FeedContent: React.FC = () => {
  const { user } = useAuthStore();
  const [postContent, setPostContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleCreatePost = () => {
    if (postContent.trim()) {
      console.log('Creating post:', postContent);
      // In a real app, this would call an API to create a post
      setPostContent('');
    }
  };

  const handleLike = (postId: string) => {
    console.log('Liked post:', postId);
    // In a real app, this would call an API to like a post
  };

  const handleComment = (postId: string, comment: string) => {
    console.log('Comment on post:', postId, comment);
    // In a real app, this would call an API to add a comment
  };

  const handleShare = (postId: string) => {
    console.log('Shared post:', postId);
    // In a real app, this would open a share dialog
  };

  const handleBookmark = (postId: string) => {
    console.log('Bookmarked post:', postId);
    // In a real app, this would call an API to bookmark a post
  };

  const renderAuthenticatedContent = () => (
    <>
      {/* Post Creation */}
      <Paper shadow="sm" p="md" radius="md" withBorder mb="lg">
        <Group mb="md">
          <Avatar 
            src={user?.profileImage || "https://i.pravatar.cc/150?img=10"} 
            alt="Profile" 
            radius="xl" 
          />
          <Textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={(e) => setPostContent(e.currentTarget.value)}
            style={{ flex: 1 }}
            autosize
            minRows={2}
            maxRows={4}
          />
        </Group>
        <Group justify="space-between">
          <Group>
            <Button leftSection={<IconPhoto size={18} />} variant="subtle" color="blue">
              Photo
            </Button>
            <Button leftSection={<IconVideo size={18} />} variant="subtle" color="blue">
              Video
            </Button>
            <Button leftSection={<IconMoodSmile size={18} />} variant="subtle" color="blue">
              Feeling
            </Button>
          </Group>
          <Button 
            color="blue" 
            onClick={handleCreatePost}
            disabled={!postContent.trim()}
          >
            Post
          </Button>
        </Group>
      </Paper>

      {/* Feed */}
      {isLoading ? (
        <Stack>
          {Array(3).fill(0).map((_, index) => (
            <Paper key={index} shadow="sm" p="md" radius="md" withBorder>
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
      ) : (
        <Stack>
          {MOCK_POSTS.map((post: Post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onBookmark={handleBookmark}
            />
          ))}
        </Stack>
      )}
    </>
  );

  const renderUnauthenticatedContent = () => (
    <Paper shadow="sm" p="xl" radius="md" withBorder>
      <Title order={3} ta="center" mb="md">Welcome to Incoming Class</Title>
      <Text ta="center" mb="xl">
        Log in to see posts from your classmates, join conversations, and share your own updates.
      </Text>
      <Group justify="center">
        <Button color="blue" component="a" href="/login">
          Log In
        </Button>
        <Button variant="outline" color="blue" component="a" href="/signup">
          Sign Up
        </Button>
      </Group>
    </Paper>
  );

  return (
    <Container size="md" py="md">
      {user ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
    </Container>
  );
};

export default FeedContent; 