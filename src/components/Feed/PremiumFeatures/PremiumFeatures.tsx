import React from "react";
import {
  Box,
  Text,
  Button,
  Stack,
  Group,
  ThemeIcon,
  List,
  Badge,
  useMantineTheme,
  Progress,
  LoadingOverlay,
} from "@mantine/core";
import {
  IconStarFilled,
  IconCheck,
  IconCrown,
  IconRocket,
  IconFilter,
  IconInfinity,
  IconBolt,
  IconSparkles,
} from "@tabler/icons-react";
import { useAuthStore } from "../../../store/auth.store";
import { useCreateSubscriptionSession, usePricing } from "../../../hooks/api";
import { showError } from "../../../utils";
import { useState } from "react";
import { useNavigate } from "react-router";

export const PremiumFeatures: React.FC = () => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const isPremium = user?.isPremium || false;
  const navigate = useNavigate();

  // Subscription payment hook
  const { mutateAsync: createSubscriptionSession, isPending: isInitiatingPayment } = useCreateSubscriptionSession();
  const { data: pricingData, isLoading: isPricingLoading } = usePricing();
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const price = pricingData?.data?.premium || 0;

  const handleUpgradeClick = async () => {
    if (!user) {
      // Redirect to login page if user is not authenticated
      navigate('/login');
      return;
    }

    // Proceed with payment flow for authenticated users
    await initiateSubscriptionPayment();
  };

  const initiateSubscriptionPayment = async () => {
    setPaymentError(null);

    try {
      const requestData = {
        amount: Math.round(price * 100), // Convert to cents
        currency: "usd",
        successUrl: `${window.location.origin}/payment/premium/success`,
        cancelUrl: `${window.location.origin}/payment/post/error`,
      } as const;

      const response = await createSubscriptionSession(requestData);

      if (!response.status || !response.data?.checkoutUrl) {
        const errorMsg = response.message || "Failed to initialize payment";
        throw new Error(errorMsg);
      }

      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to initialize payment. Please try again.";
      setPaymentError(errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <Box
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: theme.radius.md,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: theme.spacing.md,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <LoadingOverlay visible={isInitiatingPayment || isPricingLoading} overlayProps={{ blur: 2 }} />

      {/* Decorative gradient background */}
      <Box
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "150px",
          height: "150px",
          background:
            "radial-gradient(circle, rgba(67, 97, 238, 0.3) 0%, rgba(67, 97, 238, 0) 70%)",
          borderRadius: "50%",
          filter: "blur(20px)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      {/* Premium Badge with Most Popular tag */}
      <Group mb="md" justify="space-between">
        <Group>
          <IconCrown size={20} color={theme.colors.yellow[4]} />
          <Text fw={600} size="sm" c={theme.white}>
            Premium Match+
          </Text>
        </Group>
        <Stack gap={4} align="flex-end">
          <Badge
            variant="gradient"
            gradient={{ from: "orange", to: "red" }}
            size="xs"
          >
            Most Popular
          </Badge>
          <Badge
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            size="sm"
          >
            {isPremium ? "Active" : "Upgrade"}
          </Badge>
        </Stack>
      </Group>

      {/* Premium Content */}
      <Box
        style={{
          backgroundColor: "rgba(67, 97, 238, 0.1)",
          borderRadius: theme.radius.md,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md,
          border: "1px solid rgba(67, 97, 238, 0.2)",
        }}
      >
        <Group mb="sm">
          <ThemeIcon
            size="xl"
            radius="md"
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            <IconStarFilled size={20} />
          </ThemeIcon>
          <Box>
            <Text fw={600} size="sm" c={theme.white}>
              {isPremium ? "Premium Match+ Active" : "Unlock Premium Match+"}
            </Text>
            <Text size="xs" c="dimmed">
              {isPremium ? "Your premium benefits" : "Get the ultimate matching experience"}
            </Text>
          </Box>
        </Group>

        <List
          spacing="sm"
          size="sm"
          mb="md"
          center
          styles={{
            itemWrapper: {
              color: theme.white,
            },
          }}
          icon={
            <ThemeIcon color="blue" size="sm" radius="xl">
              <IconCheck size={12} />
            </ThemeIcon>
          }
        >
          <List.Item icon={
            <ThemeIcon color="orange" size="sm" radius="xl">
              <IconBolt size={12} />
            </ThemeIcon>
          }>
            Expedited posting (front of queue)
          </List.Item>
          <List.Item icon={
            <ThemeIcon color="blue" size="sm" radius="xl">
              <IconInfinity size={12} />
            </ThemeIcon>
          }>
            Unlimited profile views
          </List.Item>
          <List.Item icon={
            <ThemeIcon color="cyan" size="sm" radius="xl">
              <IconInfinity size={12} />
            </ThemeIcon>
          }>
            Unlimited posts
          </List.Item>
          <List.Item icon={
            <ThemeIcon color="purple" size="sm" radius="xl">
              <IconSparkles size={12} />
            </ThemeIcon>
          }>
            AI-powered roommate matching
          </List.Item>
          <List.Item icon={
            <ThemeIcon color="green" size="sm" radius="xl">
              <IconFilter size={12} />
            </ThemeIcon>
          }>
            Full filter access (major, vibe, interests, dorm)
          </List.Item>
        </List>

        {!isPremium && (
          <Button
            fullWidth
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            leftSection={<IconRocket size={16} />}
            onClick={handleUpgradeClick}
            loading={isInitiatingPayment}
            disabled={isInitiatingPayment || isPricingLoading}
          >
            {isInitiatingPayment ? "Processing..." : `Upgrade - $${price.toFixed(2)}/month`}
          </Button>
        )}
        {paymentError && (
          <Text size="xs" c="red" mt="xs">
            {paymentError}
          </Text>
        )}
      </Box>

      {/* Premium Status Summary */}
      {isPremium ? (
        <PremiumStatusSummary />
      ) : (
        <>
          {/* Featured Premium Content */}
          <Text size="sm" fw={500} c={theme.white} mb="xs">
            What You're Missing
          </Text>
          <Stack gap="sm">
            <PremiumContentCard
              title="Expedited Posting"
              description="Your posts move to the front of the queue"
              badge="Priority"
              icon={<IconBolt size={16} />}
            />
            <PremiumContentCard
              title="Unlimited Everything"
              description="Unlimited profile views and posts"
              badge="Exclusive"
              icon={<IconInfinity size={16} />}
            />
            <PremiumContentCard
              title="AI Roommate Matching"
              description="Smart AI finds your perfect roommate match"
              badge="New"
              icon={<IconSparkles size={16} />}
            />
            <PremiumContentCard
              title="Full Filter Access"
              description="Filter by major, vibe, interests, dorm & more"
              icon={<IconFilter size={16} />}
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

// Premium Status Summary for premium users
const PremiumStatusSummary: React.FC = () => {
  const theme = useMantineTheme();
  
  return (
    <Stack gap="md">
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Your Premium Stats
      </Text>
      
      <Box>
        <Group justify="space-between" mb={5}>
          <Text size="xs" c="dimmed">Profile Views</Text>
          <Text size="xs" fw={500} c={theme.white}>24 this week</Text>
        </Group>
        <Progress value={65} color="cyan" size="sm" radius="xl" />
      </Box>
      
      <Box>
        <Group justify="space-between" mb={5}>
          <Text size="xs" c="dimmed">Matches</Text>
          <Text size="xs" fw={500} c={theme.white}>8 new</Text>
        </Group>
        <Progress value={40} color="indigo" size="sm" radius="xl" />
      </Box>
      
      <Box>
        <Group justify="space-between" mb={5}>
          <Text size="xs" c="dimmed">Profiles Viewed</Text>
          <Text size="xs" fw={500} c={theme.white}>Unlimited</Text>
        </Group>
        <Progress value={90} color="blue" size="sm" radius="xl" />
      </Box>
      
      <Box
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          borderRadius: theme.radius.md,
          padding: theme.spacing.sm,
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Text size="xs" c="dimmed" mb={5}>Premium Status</Text>
        <Group>
          <ThemeIcon color="yellow" size="sm" radius="xl">
            <IconCrown size={12} />
          </ThemeIcon>
          <Text size="sm" fw={500} c={theme.white}>
            Active until May 15, 2024
          </Text>
        </Group>
      </Box>
    </Stack>
  );
};

// Helper component for premium content cards
const PremiumContentCard: React.FC<{
  title: string;
  description: string;
  badge?: string;
  icon?: React.ReactNode;
}> = ({ title, description, badge, icon }) => {
  const theme = useMantineTheme();

  return (
    <Box
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderRadius: theme.radius.md,
        padding: theme.spacing.sm,
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          {icon && (
            <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
              {icon}
            </ThemeIcon>
          )}
          <Text size="sm" fw={500} c={theme.white}>
            {title}
          </Text>
        </Group>
        {badge && (
          <Badge size="xs" variant="filled" color="blue">
            {badge}
          </Badge>
        )}
      </Group>
      <Text size="xs" c="dimmed">
        {description}
      </Text>
    </Box>
  );
}; 