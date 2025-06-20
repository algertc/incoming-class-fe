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
  Center,
  Badge,
} from '@mantine/core';
import { IconLock, IconAlertCircle } from '@tabler/icons-react';
import { useAuthStore } from '../../../store/auth.store';
import { useFeedStore } from '../../../store/feed.store';
import { useFeedInitializer } from '../../../hooks/api';
import { useNavigate } from 'react-router';
import PostCard from './PostCard';
import type { Post } from './PostCard';

const FeedContent: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const isAuthenticated = !!user;
  
  // Use feed store
  const {
    posts,
    isLoading,
    isLoadingMore,
    hasMore,
    hasReachedLimit,
    maxPostsWithoutLogin,
    modalShownAndDismissed,
    filters,
    error,
    totalCount,
    loadMorePosts,
    refreshFeed,
    markModalDismissed,
  } = useFeedStore();
  
  // Use custom hook for feed initialization
  useFeedInitializer(isAuthenticated, user?.id);
  
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Memoize loadMorePosts to prevent unnecessary re-renders
  const loadMorePostsMemoized = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore || hasReachedLimit || (!isAuthenticated && modalShownAndDismissed)) {
      return;
    }
    loadMorePosts(isAuthenticated);
  }, [hasMore, isLoading, isLoadingMore, hasReachedLimit, modalShownAndDismissed, loadMorePosts, isAuthenticated]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!hasMore || isLoading || hasReachedLimit || (!isAuthenticated && modalShownAndDismissed)) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoadingMore) {
          loadMorePostsMemoized();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    const currentTarget = loadMoreRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasMore, isLoading, hasReachedLimit, modalShownAndDismissed, loadMorePostsMemoized, isLoadingMore]);

  // Handle modal actions
  const handleModalLogin = () => {
    setLoginModalOpened(false);
    markModalDismissed();
    navigate('/login');
  };

  const handleModalSignup = () => {
    setLoginModalOpened(false);
    markModalDismissed();
    navigate('/signup');
  };

  // Handle modal close without action
  const handleModalClose = () => {
    setLoginModalOpened(false);
    markModalDismissed();
  };

  // Handle reaching limit for unauthenticated users
  useEffect(() => {
    if (hasReachedLimit && !isAuthenticated && !modalShownAndDismissed) {
      setLoginModalOpened(true);
    }
  }, [hasReachedLimit, isAuthenticated, modalShownAndDismissed]);

  // Check if any filters are active
  const hasActiveFilters = filters.searchQuery || 
                          filters.lastDays !== 30 ||
                          (filters.college && filters.college !== 'all');

  const renderFilterStatus = () => {
    if (!hasActiveFilters && !isLoading) return null;

    return (
      <Paper shadow="sm" p="md" radius="md" withBorder mb="md" style={{
        backgroundColor: "rgba(67, 97, 238, 0.1)",
        borderColor: "rgba(67, 97, 238, 0.3)",
      }}>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Text size="sm" fw={500} c="white">
              {isLoading ? 'Loading...' : `Showing ${posts.length} of ${totalCount} posts`}
            </Text>
            
            {/* Active filter badges */}
            {filters.searchQuery && (
              <Badge variant="light" color="blue" size="sm">
                Search: "{filters.searchQuery}"
              </Badge>
            )}
          </Group>
        </Group>
      </Paper>
    );
  };

  const renderErrorMessage = () => {
    if (!error) return null;

    return (
      <Paper shadow="sm" p="md" radius="md" withBorder mb="md" style={{
        backgroundColor: "rgba(229, 56, 59, 0.1)",
        borderColor: "rgba(229, 56, 59, 0.3)",
      }}>
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <IconAlertCircle size={16} color="#e5383b" />
            <Text size="sm" fw={500} c="white">
              Error loading posts: {error}
            </Text>
          </Group>
          <Button variant="light" color="red" size="xs" onClick={() => refreshFeed(isAuthenticated)}>
            Retry
          </Button>
        </Group>
      </Paper>
    );
  };

  const renderPosts = () => (
    <>
      {/* Filter Status Bar */}
      {renderFilterStatus()}
      
      {/* Error Message */}
      {renderErrorMessage()}
      
      {/* Posts Feed */}
      {isLoading && posts.length === 0 ? (
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
          {/* Render posts */}
          {posts.map((post: Post) => (
            <PostCard 
              key={post.id} 
              post={post} 
            />
          ))}
          
          {/* No posts found */}
          {posts.length === 0 && !error && !isLoading && (
            <Paper shadow="sm" p="xl" radius="md" withBorder style={{ textAlign: 'center' }}>
              <Text size="lg" c="dimmed">
                No posts found matching your filters.
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                Try adjusting your search criteria or filters.
              </Text>
            </Paper>
          )}
          
          {/* Loading indicator for infinite scroll */}
          {isLoadingMore && (
            <Center py="xl">
              <Stack align="center" gap="md">
                <Loader color="blue" size="md" />
                <Text size="sm" c="dimmed">Loading more posts...</Text>
              </Stack>
            </Center>
          )}
          
          {/* Error during load more */}
          {error && posts.length > 0 && (
            <Center py="md">
              <Button variant="light" color="red" onClick={() => loadMorePosts(isAuthenticated)}>
                Retry loading more posts
              </Button>
            </Center>
          )}
          
          {/* Intersection observer target for infinite scroll */}
          {hasMore && !hasReachedLimit && !error && !(!isAuthenticated && modalShownAndDismissed) && (
            <div
              ref={loadMoreRef}
              style={{
                height: '20px',
                width: '100%',
                marginTop: '20px',
              }}
            />
          )}

          {/* End of free content message for unauthenticated users */}
          {hasReachedLimit && !isAuthenticated && !modalShownAndDismissed && (
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
                  You've viewed {maxPostsWithoutLogin} posts. Join our community to see unlimited content and connect with your classmates.
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

          {/* End of all posts message for authenticated users */}
          {!hasMore && !hasReachedLimit && isAuthenticated && posts.length > 0 && (
            <Paper shadow="sm" p="lg" radius="md" withBorder style={{ textAlign: 'center', marginTop: '20px' }}>
              <Text size="md" c="dimmed">
                You've reached the end! 🎉
              </Text>
              <Text size="sm" c="dimmed" mt="xs">
                No more posts to load. Check back later for new content.
              </Text>
            </Paper>
          )}
        </Stack>
      )}
    </>
  );

  return (
    <>
    <Container size="md" py="md">
        {renderPosts()}
    </Container>

      {/* Login/Signup Modal */}
      <Modal
        opened={loginModalOpened}
        onClose={handleModalClose}
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
              Continue Reading
            </Title>
            <Text size="md" c="dimmed" style={{ maxWidth: '350px', margin: '0 auto' }}>
              You've enjoyed {maxPostsWithoutLogin} posts! Create an account to see unlimited content and connect with your classmates.
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