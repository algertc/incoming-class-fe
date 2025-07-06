import React from 'react';
import {
  Paper,
  Stack,
  Group,
  Title,
  Text,
  Button,
  ThemeIcon,
  useMantineTheme,
  Badge,
  SimpleGrid,
} from '@mantine/core';
import {
  IconCrown,
  IconCheck,
  IconInfinity,
  IconFilter,
  IconRocket,
  IconUser,
} from '@tabler/icons-react';
import { useCreateSubscriptionSession, usePricing } from '../../../hooks/api';
import { showError } from '../../../utils';

interface SubscriptionPlansProps {
  isSubscribed: boolean;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({ isSubscribed }) => {
  const theme = useMantineTheme();
 
  const { data: pricingData, isLoading: isPricingLoading } = usePricing();
  const { mutateAsync: createSubscriptionSession, isPending: isInitiatingPayment } = useCreateSubscriptionSession();

  const premiumPrice = pricingData?.data?.premium || 0;

  const handleUpgradeClick = async () => {
    try {
      const requestData = {
        amount: Math.round(premiumPrice * 100), // Convert to cents
        currency: "usd",
        successUrl: `${window.location.origin}/payment/premium/success`,
        cancelUrl: `${window.location.origin}/payment/post/error`,
      } as const;

      const response = await createSubscriptionSession(requestData);

      if (!response.status || !response.data?.checkoutUrl) {
        throw new Error(response.message || "Failed to initialize payment");
      }

      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to initialize payment. Please try again.";
      showError(errorMessage);
    }
  };

  return (
    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
      {/* Basic Plan */}
      <Paper
        p="xl"
        radius="lg"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
          opacity: isSubscribed ? 0.7 : 1,
        }}
      >
        <Stack gap="lg">
          <Group>
            <ThemeIcon size="lg" radius="md" variant="light">
              <IconUser size={20} />
            </ThemeIcon>
            <Stack gap={4}>
              <Title order={3} c={theme.white}>Starter Pack</Title>
        
            </Stack>
            {!isSubscribed && (
              <Badge variant="light" color="blue" ml="auto">
                Current Plan
              </Badge>
            )}
          </Group>

          <Stack gap="md">
            <Text size="sm" c="gray.4" style={{ lineHeight: 1.6 }}>
              Essential features to get you started
            </Text>

            <Stack gap="sm">
              <Group gap="xs">
                <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                  <IconCheck size={12} />
                </ThemeIcon>
                <Text size="sm" c="gray.4">Limited profile views</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                  <IconCheck size={12} />
                </ThemeIcon>
                <Text size="sm" c="gray.4">Basic search filters</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                  <IconCheck size={12} />
                </ThemeIcon>
                <Text size="sm" c="gray.4">Standard posting queue</Text>
              </Group>
            </Stack>
          </Stack>
        </Stack>
      </Paper>

      {/* Premium Plan */}
      <Paper
        p="xl"
        radius="lg"
        style={{
          background: "linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(67, 97, 238, 0.05) 100%)",
          border: "1px solid rgba(67, 97, 238, 0.2)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack gap="lg">
          <Group>
            <ThemeIcon 
              size="lg" 
              radius="md" 
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
            >
              <IconCrown size={20} />
            </ThemeIcon>
            <Stack gap={4}>
              <Title order={3} c={theme.white}>Premium Watch+</Title>
              <Text size="sm" c="dimmed">${premiumPrice}/month</Text>
            </Stack>
            {isSubscribed && (
              <Badge variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} ml="auto">
                Current Plan
              </Badge>
            )}
          </Group>

          <Stack gap="md">
            <Text size="sm" c="gray.4" style={{ lineHeight: 1.6 }}>
              Enhanced features for serious users
            </Text>

            <Stack gap="sm">
              <Group gap="xs">
                <ThemeIcon size="sm" radius="xl" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                  <IconInfinity size={12} />
                </ThemeIcon>
                <Text size="sm" c="gray.4">Unlimited profile views</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon size="sm" radius="xl" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                  <IconFilter size={12} />
                </ThemeIcon>
                <Text size="sm" c="gray.4">Advanced search filters</Text>
              </Group>
              <Group gap="xs">
                <ThemeIcon size="sm" radius="xl" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }}>
                  <IconRocket size={12} />
                </ThemeIcon>
                <Text size="sm" c="gray.4">Priority posting queue</Text>
              </Group>
            </Stack>
          </Stack>

          {!isSubscribed && (
            <Button
              variant="gradient"
              gradient={{ from: 'indigo', to: 'cyan' }}
              onClick={handleUpgradeClick}
              loading={isInitiatingPayment || isPricingLoading}
              fullWidth
              mt="md"
            >
              Upgrade to Premium Watch+
            </Button>
          )}
        </Stack>
      </Paper>
    </SimpleGrid>
  );
}; 