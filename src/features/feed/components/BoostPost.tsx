import React, { useState } from 'react';
import {
  ActionIcon,
  Button,
  Modal,
  Stack,
  Group,
  Text,
  useMantineTheme,
  Paper,
  Badge,
} from '@mantine/core';
import {
  IconRocket,
} from '@tabler/icons-react';
import { useAuthStore } from '../../../store/auth.store';
import { useUserPosts, useBoostPost } from '../../../hooks/api';
import { showError, showSuccess } from '../../../utils';
import { PremiumSubscriptionModal } from '../../../components/common/PremiumSubscriptionModal';
import { LimitReachedModal } from '../../../components/common/LimitReachedModal';
import { modals } from '@mantine/modals';
import { useNavigate } from 'react-router';

interface BoostPostProps {
  variant?: 'icon' | 'button';
}

const BoostPost: React.FC<BoostPostProps> = ({ variant = 'button' }) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();
  const [boostModalOpened, setBoostModalOpened] = useState(false);
  const [premiumModalOpened, setPremiumModalOpened] = useState(false);
  const [limitReachedModalOpened, setLimitReachedModalOpened] = useState(false);

  // Fetch user's post
  const { data: userPostsResponse } = useUserPosts({ page: 1, limit: 1 });
  const userPost = userPostsResponse?.data?.posts?.[0];

  // Get boost mutation
  const boostPostMutation = useBoostPost();

  const showLimitReachedModal = () => {
    if (user?.isSubscribed) {
      // For subscribed users, show the dedicated limit reached modal
      setLimitReachedModalOpened(true);
    } else {
      // For non-subscribed users, show the premium upgrade modal
      modals.open({
        title: 'No Boosts Remaining',
        centered: true,
        children: (
          <Stack>
            <Text size="sm">
              You've used all your available post boosts for your current plan.
              Upgrade to Premium for more boosts and other exclusive features!
            </Text>
            <Button
              onClick={() => {
                modals.closeAll();
                setPremiumModalOpened(true);
              }}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              Upgrade to Premium
            </Button>
          </Stack>
        ),
      });
    }
  };

  // Handle boost button click
  const handleClick = () => {

    if (!user) {
      navigate('/signup');
      return;
    }
console.log("user", user);

    if (user?.isSubscribed) {
      if ((user.subscriptionBumpCount || 0) >= 2) {
        showLimitReachedModal();
        return;
      }
    } else if (user?.isStarterSubscribed) {
      setPremiumModalOpened(true);
      return;
    }


    // For subscribed users, open boost modal
    setBoostModalOpened(true);
  };

  // Handle boost confirmation
  const handleBoostConfirm = async () => {
    if (!userPost?.id) {
      showError('No post found to boost');
      return;
    }

    try {
      await boostPostMutation.mutateAsync(userPost.id, {
        onSuccess: () => {
          showSuccess('Post boosted successfully!');
          fetchUser();
        }
      });
      setBoostModalOpened(false);
    } catch (error) {
      console.error('Error boosting post:', error);
      showError('Failed to boost post');
    }
  };

  return (
    <>
      {variant === 'icon' ? (
        <ActionIcon
          size="lg"
          variant="light"
          color="yellow"
          onClick={handleClick}
          style={{
            backgroundColor: "rgba(250, 176, 5, 0.2)",
          }}
        >
          <IconRocket size={20} />
        </ActionIcon>
      ) : (
        <Button
          variant="gradient"
          gradient={{ from: 'yellow', to: 'orange' }}
          leftSection={<IconRocket size={16} />}
          onClick={handleClick}
        >
          {user?.isProfileCompleted ? 'Repost' : 'Post'}
        </Button>
      )}

      {/* Boost Modal */}
      <Modal
        opened={boostModalOpened}
        onClose={() => setBoostModalOpened(false)}
        title="Boost Your Post"
        size="md"
        centered
        styles={{
          content: {
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          header: {
            backgroundColor: 'transparent',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
          title: {
            color: 'white',
            fontSize: theme.fontSizes.lg,
            fontWeight: 600,
          },
          close: {
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        }}
      >
        <Stack>
          <Text c="white">
            Repost your post to increase its visibility and reach more users. Your post will:
          </Text>

          <Paper p="md" radius="md" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
            <Stack>
              <Group gap="xs">
                <Badge variant="filled" color="yellow">Premium</Badge>
                <Text size="sm" c="white">Repost to your photo on Instagram and Incoming Class Feed.</Text>
              </Group>
              <Group gap="xs">
                <Badge variant="filled" color="yellow">Premium</Badge>
                <Text size="sm" c="white">Appear higher in search results</Text>
              </Group>
              <Group gap="xs">
                <Badge variant="filled" color="yellow">Premium</Badge>
                <Text size="sm" c="white">Get featured in the "Trending" section</Text>
              </Group>
              <Group gap="xs">
                <Badge variant="filled" color="yellow">Premium</Badge>
                <Text size="sm" c="white">Find roommates and friends faster</Text>
              </Group>
            </Stack>
          </Paper>

          <Group justify="flex-end" mt="md">
            <Button
              variant="default"
              onClick={() => setBoostModalOpened(false)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange' }}
              onClick={handleBoostConfirm}
              leftSection={<IconRocket size={16} />}
              loading={boostPostMutation.isPending}
            >
              Boost Now
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Premium Subscription Modal */}
      <PremiumSubscriptionModal
        opened={premiumModalOpened}
        onClose={() => setPremiumModalOpened(false)}
        trigger="boost"
      />

      {/* Limit Reached Modal */}
      <LimitReachedModal
        opened={limitReachedModalOpened}
        onClose={() => setLimitReachedModalOpened(false)}
        type="boost"
        currentCount={user?.subscriptionBumpCount || 0}
        maxCount={2}
      />
    </>
  );
};

export default BoostPost; 