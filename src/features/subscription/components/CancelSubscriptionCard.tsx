import React, { useState } from 'react';
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  ThemeIcon,
  useMantineTheme,
  Modal,
  Alert,
  Loader,
} from '@mantine/core';
import {
  IconX,
  IconAlertTriangle,
  IconInfoCircle,
} from '@tabler/icons-react';
import { useCancelSubscription, useSubscriptionStatus } from '../../../hooks/api/usePayment';
import { notifications } from '@mantine/notifications';

interface CancelSubscriptionCardProps {
  onSubscriptionCanceled?: () => void;
}

const CancelSubscriptionCard: React.FC<CancelSubscriptionCardProps> = ({
  onSubscriptionCanceled,
}) => {
  const theme = useMantineTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get subscription status to determine if cancellation should be available
  const { 
    data: subscriptionStatus, 
    isLoading: isLoadingStatus,
    error: statusError ,
    refetch: refetchSubscriptionStatus,
  } = useSubscriptionStatus();
  
  const {
    mutateAsync: cancelSubscription,
    isPending: isCanceling,
    error: cancelError,
  } = useCancelSubscription();

  const handleCancelSubscription = async () => {
    try {
      const response = await cancelSubscription();
      
      // Show success notification
      notifications.show({
        title: 'Subscription Canceled',
        message: response.data.message || 'Your subscription has been successfully canceled.',
        color: 'green',
        icon: <IconInfoCircle size={16} />,
      });

      // Close modal
      setIsModalOpen(false);
      
      // Call callback if provided
      if (onSubscriptionCanceled) {
        onSubscriptionCanceled();
       await refetchSubscriptionStatus();
      }
    } catch (error) {
      // Show error notification
      notifications.show({
        title: 'Cancellation Failed',
        message: (error as Error).message || 'Failed to cancel subscription. Please try again.',
        color: 'red',
        icon: <IconAlertTriangle size={16} />,
      });
    }
  };

  // Determine if cancellation should be available
  const canCancel = subscriptionStatus?.data?.isSubscribed && subscriptionStatus?.data?.isAutoRenewalOn;

  // Show loading state while fetching subscription status
  if (isLoadingStatus) {
    return (
      <Paper
        p="xl"
        radius="lg"
        style={{
          background: "linear-gradient(135deg, rgba(229, 56, 59, 0.05) 0%, rgba(139, 69, 19, 0.05) 100%)",
          border: "1px solid rgba(229, 56, 59, 0.15)",
          backdropFilter: "blur(10px)"
        }}
      >
        <Group align="center" justify="center">
          <Loader size="sm" />
          <Text size="sm" c="gray.4">Loading subscription status...</Text>
        </Group>
      </Paper>
    );
  }

  // Show error state if failed to load subscription status
  if (statusError) {
    return (
      <Paper
        p="xl"
        radius="lg"
        style={{
          background: "linear-gradient(135deg, rgba(229, 56, 59, 0.05) 0%, rgba(139, 69, 19, 0.05) 100%)",
          border: "1px solid rgba(229, 56, 59, 0.15)",
          backdropFilter: "blur(10px)"
        }}
      >
        <Alert
          icon={<IconAlertTriangle size={16} />}
          color="red"
          variant="light"
        >
          <Text size="sm">
            Failed to load subscription status. Please refresh the page to try again.
          </Text>
        </Alert>
      </Paper>
    );
  }

  // Don't render if user cannot cancel (not subscribed or auto-renewal is off)
  if (!canCancel) {
    return null;
  }

  return (
    <>
      <Paper
        p="xl"
        radius="lg"
        style={{
          background: "linear-gradient(135deg, rgba(229, 56, 59, 0.05) 0%, rgba(139, 69, 19, 0.05) 100%)",
          border: "1px solid rgba(229, 56, 59, 0.15)",
          backdropFilter: "blur(10px)"
        }}
      >
        <Stack gap="lg">
          <Group align="center">
            <ThemeIcon
              size="lg"
              radius="md"
              color="red"
              variant="light"
            >
              <IconX size={20} />
            </ThemeIcon>
            <Title order={3} c={theme.white}>
              Cancel Subscription
            </Title>
          </Group>

          <Text size="sm" c="gray.4" style={{ lineHeight: 1.6 }}>
            If you're not satisfied with your premium experience, you can cancel your subscription at any time. 
            Your premium features will remain active until the end of your current billing period.
          </Text>

          <Alert
            icon={<IconAlertTriangle size={16} />}
            color="yellow"
            variant="light"
            style={{ backgroundColor: 'rgba(255, 193, 7, 0.1)' }}
          >
            <Text c={"white"} size="sm">
              <strong>Important:</strong> Canceling your subscription will remove access to unlimited posts, 
              advanced filters, and other premium features at the end of your billing cycle.
            </Text>
          </Alert>

          <Group justify="flex-end">
            <Button
              variant="light"
              color="red"
              leftSection={<IconX size={16} />}
              onClick={() => setIsModalOpen(true)}
              disabled={isCanceling}
            >
              Cancel Subscription
            </Button>
          </Group>
        </Stack>
      </Paper>

      {/* Confirmation Modal */}
      <Modal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cancel Subscription"
        centered
        size="md"
        styles={{
          content: {
            backgroundColor: theme.colors.dark[7],
          },
          header: {
            backgroundColor: theme.colors.dark[7],
            borderBottom: `1px solid ${theme.colors.dark[5]}`,
          },
          title: {
            color: theme.white,
            fontWeight: 600,
          },
        }}
      >
        <Stack gap="lg">
          <Alert
            icon={<IconAlertTriangle size={16} />}
            color="red"
            variant="light"
          >
            <Text c={"white"} size="sm" fw={500}>
              Are you sure you want to cancel your subscription?
            </Text>
          </Alert>

          <Stack gap="sm">
            <Text size="sm" c="gray.4">
              By canceling your subscription, you will lose access to:
            </Text>
            <Stack gap="xs" pl="md">
              <Text size="sm" c="gray.3">• Unlimited post viewing</Text>
              <Text size="sm" c="gray.3">• Advanced search and filtering</Text>
              <Text size="sm" c="gray.3">• Priority customer support</Text>
              <Text size="sm" c="gray.3">• Premium features and updates</Text>
            </Stack>
          </Stack>

          <Text size="sm" c="gray.4">
            Your premium features will remain active until the end of your current billing period.
          </Text>

          {cancelError && (
            <Alert
              icon={<IconAlertTriangle size={16} />}
              color="red"
              variant="light"
            >
              <Text size="sm">
                {(cancelError as Error).message || 'Failed to cancel subscription. Please try again.'}
              </Text>
            </Alert>
          )}

          <Group justify="flex-end" gap="md">
            <Button
              variant="light"
              color="gray"
              onClick={() => setIsModalOpen(false)}
              disabled={isCanceling}
            >
              Keep Subscription
            </Button>
            <Button
              color="red"
              onClick={handleCancelSubscription}
              disabled={isCanceling}
              leftSection={isCanceling ? <Loader size={16} /> : <IconX size={16} />}
            >
              {isCanceling ? 'Canceling...' : 'Yes, Cancel Subscription'}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default CancelSubscriptionCard; 