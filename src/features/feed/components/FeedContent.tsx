import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  Paper, 
  Text, 
  Button, 
  Group, 
  Stack, 
  Skeleton, 
  Container,
  Title,
  Modal,
  Divider,
  Loader,
  Center
} from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { useAuthStore } from '../../../store/auth.store';
import { useNavigate } from 'react-router';
import PostCard from './PostCard';
import type { Post } from './PostCard';
import { MOCK_POSTS } from '../data/mockPosts';

const FeedContent: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  
  // Infinite scroll state for unauthenticated users
  const [visiblePosts, setVisiblePosts] = useState<Post[]>([]);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  
  // Configuration
  const POSTS_PER_LOAD = 3;
  const MAX_POSTS_WITHOUT_LOGIN = 6;

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Initialize with first batch of posts for unauthenticated users
      if (!user) {
        setVisiblePosts(MOCK_POSTS.slice(0, POSTS_PER_LOAD));
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  // Load more posts function
  const loadMorePosts = useCallback(() => {
    if (hasReachedLimit || isLoadingMore || user) {
      console.log('Load more blocked:', { hasReachedLimit, isLoadingMore, user: !!user });
      return;
    }

    console.log('Loading more posts, current length:', visiblePosts.length);
    setIsLoadingMore(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const currentLength = visiblePosts.length;
      
      // Check if we'll exceed the limit with the next batch
      if (currentLength >= MAX_POSTS_WITHOUT_LOGIN) {
        console.log('Already at limit, triggering modal');
        setHasReachedLimit(true);
        setLoginModalOpened(true);
        setIsLoadingMore(false);
        return;
      }
      
      // Calculate how many posts we can still show
      const remainingSlots = MAX_POSTS_WITHOUT_LOGIN - currentLength;
      const postsToLoad = Math.min(POSTS_PER_LOAD, remainingSlots);
      const nextBatch = MOCK_POSTS.slice(currentLength, currentLength + postsToLoad);
      
      console.log('Next batch:', { currentLength, postsToLoad, batchSize: nextBatch.length });
      
      if (nextBatch.length === 0) {
        // No more posts available, trigger modal
        console.log('No more posts available, triggering modal');
        setHasReachedLimit(true);
        setLoginModalOpened(true);
        setIsLoadingMore(false);
        return;
      }
      
      // Add the posts
      setVisiblePosts(prev => {
        const newPosts = [...prev, ...nextBatch];
        console.log('Updated posts count:', newPosts.length);
        return newPosts;
      });
      
      // Check if we've reached the limit after adding posts
      if (currentLength + nextBatch.length >= MAX_POSTS_WITHOUT_LOGIN) {
        console.log('Reached limit after adding posts, triggering modal');
        setHasReachedLimit(true);
        setLoginModalOpened(true);
      }
      
      setIsLoadingMore(false);
    }, 800);
  }, [visiblePosts.length, hasReachedLimit, isLoadingMore, user, MAX_POSTS_WITHOUT_LOGIN, POSTS_PER_LOAD]);

  // Intersection Observer setup
  useEffect(() => {
    if (user || hasReachedLimit || isLoading) {
      console.log('Observer blocked:', { user: !!user, hasReachedLimit, isLoading });
      return;
    }

    console.log('Setting up intersection observer');

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        console.log('Intersection observed:', { isIntersecting: entry.isIntersecting, isLoadingMore });
        if (entry.isIntersecting && !isLoadingMore) {
          loadMorePosts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      console.log('Observing target element');
      observer.observe(currentTarget);
    }

    return () => {
      console.log('Cleaning up intersection observer');
      observer.disconnect();
    };
  }, [user, hasReachedLimit, isLoading, isLoadingMore, loadMorePosts]);

  const handleModalLogin = () => {
    setLoginModalOpened(false);
    navigate('/login');
  };

  const handleModalSignup = () => {
    setLoginModalOpened(false);
    navigate('/signup');
  };

  const renderAuthenticatedContent = () => (
    <>
      {/* Feed - Post creation removed since posts are created by backend */}
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
            />
          ))}
        </Stack>
      )}
    </>
  );

  const renderUnauthenticatedContent = () => (
    <>
      {/* Limited Feed for Unauthenticated Users with Infinite Scroll */}
      {isLoading ? (
        <Stack>
          {Array(3).fill(0).map((_, index) => (
            <Paper key={index} shadow="sm" p="md" radius="md" withBorder mb="md">
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
          {/* Render visible posts */}
          {visiblePosts.map((post: Post) => (
            <PostCard 
              key={post.id} 
              post={post} 
            />
          ))}
          
          {/* Loading indicator for infinite scroll */}
          {isLoadingMore && (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Loader color="blue" size="md" />
                <Text size="sm" c="dimmed">Loading more posts...</Text>
              </Stack>
            </Center>
          )}
          
          {/* Intersection observer target */}
          {!hasReachedLimit && (
            <div
              ref={loadMoreRef}
              style={{
                height: '20px',
                width: '100%',
                marginTop: '20px',
              }}
            />
          )}

          {/* End of free content message */}
          {hasReachedLimit && (
            <Paper 
              shadow="sm" 
              p="xl" 
              radius="md" 
              withBorder 
              style={{
                background: 'linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(0, 0, 0, 0.2) 100%)',
                border: '1px solid rgba(67, 97, 238, 0.3)',
                textAlign: 'center',
                marginTop: '20px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Decorative elements */}
              <Box 
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '20px',
                  opacity: 0.3
                }}
              >
                <IconLock size={40} color="#4361ee" />
              </Box>
              
              <Box style={{ position: 'relative', zIndex: 1 }}>
                <Title order={3} mb="md" style={{ color: 'white' }}>
                  You've reached the end of free content
                </Title>
                
                <Text size="md" c="dimmed" mb="xl" style={{ maxWidth: '400px', margin: '0 auto' }}>
                  You've viewed {MAX_POSTS_WITHOUT_LOGIN} posts. Join our community to see unlimited content and connect with your classmates.
                </Text>
                
                <Button 
                  size="lg"
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  onClick={() => setLoginModalOpened(true)}
                  style={{ fontWeight: 600 }}
                >
                  Join Now to Continue
                </Button>
                
                <Text size="sm" c="dimmed" mt="md">
                  Free forever • No hidden fees
                </Text>
              </Box>
            </Paper>
          )}
        </Stack>
      )}
    </>
  );

  return (
    <>
      <Container size="md" py="md">
        {user ? renderAuthenticatedContent() : renderUnauthenticatedContent()}
      </Container>

      {/* Login/Signup Modal */}
      <Modal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
        title=""
        centered
        size="md"
        styles={{
          content: {
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          header: {
            backgroundColor: 'transparent',
            borderBottom: 'none',
          },
          close: {
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
          title: {
            color: 'white',
          },
        }}
      >
        <Box p="md" style={{ textAlign: 'center' }}>
          {/* Modal Header */}
          <Box mb="xl">
            <IconLock 
              size={60} 
              color="#4361ee" 
              style={{ marginBottom: '16px' }}
            />
            <Title order={2} mb="md" style={{ color: 'white' }}>
              {hasReachedLimit ? 'Continue Reading' : 'Join the Conversation'}
            </Title>
            <Text size="md" c="dimmed" style={{ maxWidth: '350px', margin: '0 auto' }}>
              {hasReachedLimit 
                ? `You've enjoyed ${MAX_POSTS_WITHOUT_LOGIN} posts! Create an account to see unlimited content and connect with your classmates.`
                : 'Create an account or sign in to see more posts, connect with classmates, and share your own updates.'
              }
            </Text>
          </Box>

          {/* Action Buttons */}
          <Stack gap="md">
            <Button
              size="lg"
              fullWidth
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              onClick={handleModalSignup}
              style={{ fontWeight: 600 }}
            >
              Create Free Account
            </Button>
            
            <Button
              size="lg"
              fullWidth
              variant="outline"
              color="blue"
              onClick={handleModalLogin}
              style={{ 
                borderColor: 'rgba(67, 97, 238, 0.5)',
                color: 'white',
                fontWeight: 600
              }}
            >
              Sign In
            </Button>
          </Stack>

          <Divider 
            my="xl" 
            label="Why join us?" 
            labelPosition="center"
            styles={{
              label: { color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' },
              root: { borderColor: 'rgba(255, 255, 255, 0.2)' }
            }}
          />

          {/* Benefits List */}
          <Stack gap="sm" style={{ textAlign: 'left' }}>
            <Group>
              <Text size="sm" style={{ color: '#4361ee' }}>✓</Text>
              <Text size="sm" c="white">Unlimited access to all posts</Text>
            </Group>
            <Group>
              <Text size="sm" style={{ color: '#4361ee' }}>✓</Text>
              <Text size="sm" c="white">Connect with students from your college</Text>
            </Group>
            <Group>
              <Text size="sm" style={{ color: '#4361ee' }}>✓</Text>
              <Text size="sm" c="white">Share your own posts and updates</Text>
            </Group>
            <Group>
              <Text size="sm" style={{ color: '#4361ee' }}>✓</Text>
              <Text size="sm" c="white">Find roommates and study partners</Text>
            </Group>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default FeedContent; 