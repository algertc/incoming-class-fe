import React, { useState } from "react";
import {
  Group,
  Button,
  Stack,
  Text,
  useMantineTheme,
  Paper,
  Box,
  ThemeIcon,
  SimpleGrid,
  LoadingOverlay,
  Alert,
  Badge,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconBrandInstagram,
  IconEye,
  IconUsers,
  IconStar,
  IconSparkles,
  IconShield,
  IconAlertCircle,
  IconLock,
  IconX,
  IconRocket,
  IconFilter,
  IconUserSearch,
  IconCrown,
  IconBolt,
  IconInfinity,
  IconClock,
} from "@tabler/icons-react";
import { showError } from "../../../utils";
import { useCreateCheckoutSession, useCreateSubscriptionSession, usePricing } from "../../../hooks/api";
import { usePaymentPolling } from "../../../hooks/usePaymentPolling";

// Starter Plan features data
const STARTER_FEATURES = [
  {
    title: "1 Instagram Post",
    description: "Submit 1 post to Instagram and website feed",
    icon: IconBrandInstagram,
    color: "blue",
    included: true,
  },
  {
    title: "View Your Own Post",
    description: "Access and view your own submitted post",
    icon: IconEye,
    color: "cyan",
    included: true,
  },
  {
    title: "10 Profile Views",
    description: "View up to 10 other student profiles",
    icon: IconUsers,
    color: "indigo",
    included: true,
  },
  {
    title: "Basic Access",
    description: "After 10 views, upgrade prompt for continued access",
    icon: IconLock,
    color: "orange",
    included: true,
  },
  {
    title: "No Filters",
    description: "Basic browsing without advanced filtering options",
    icon: IconFilter,
    color: "gray",
    included: false,
  },
  {
    title: "No AI Matching",
    description: "Standard browsing without AI-powered recommendations",
    icon: IconUserSearch,
    color: "gray",
    included: false,
  },
  {
    title: "No Expedited Posting",
    description: "Standard posting timeline (not expedited)",
    icon: IconRocket,
    color: "gray",
    included: false,
  },
];

// Premium Plan features data
const PREMIUM_FEATURES = [
  {
    title: "Expedited Posting",
    description: "Your posts move to the front of the queue",
    icon: IconBolt,
    color: "orange",
    included: true,
    badge: "Priority",
  },
  {
    title: "Unlimited Profile Views",
    description: "View unlimited student profiles",
    icon: IconInfinity,
    color: "blue",
    included: true,
    badge: "Unlimited",
  },
  {
    title: "Unlimited Posts",
    description: "Submit unlimited posts to the feed",
    icon: IconInfinity,
    color: "cyan",
    included: true,
    badge: "Unlimited",
  },
  {
    title: "AI-Powered Matching",
    description: "Smart AI finds your perfect roommate match",
    icon: IconSparkles,
    color: "purple",
    included: true,
    badge: "AI",
  },
  {
    title: "Full Filter Access",
    description: "Filter by major, vibe, interests, dorm & more",
    icon: IconFilter,
    color: "green",
    included: true,
    badge: "Advanced",
  },
  {
    title: "Premium Support",
    description: "Priority customer support and assistance",
    icon: IconShield,
    color: "indigo",
    included: true,
    badge: "Support",
  },
  {
    title: "Early Access",
    description: "Get early access to new features and updates",
    icon: IconRocket,
    color: "pink",
    included: true,
    badge: "Exclusive",
  },
];

const Payment: React.FC = () => {
  const theme = useMantineTheme();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [premiumPaymentError, setPremiumPaymentError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { mutateAsync: createCheckoutSession, isPending: isInitiatingPayment } = useCreateCheckoutSession();
  const { mutateAsync: createSubscriptionSession, isPending: isInitiatingPremiumPayment } = useCreateSubscriptionSession();
  const { data: pricingData, isLoading: isPricingLoading } = usePricing();
  
  // Use the payment polling hook
  const { isPolling: isPollingPayment, startPolling: startPaymentPolling } = usePaymentPolling();

  // Pricing keys: post (starter one-time), premium (monthly subscription)
  const starterPrice = pricingData?.data?.post || 0;
  const premiumPrice = pricingData?.data?.premium || 0;

  const tax = 0.0;
  const starterTotal = starterPrice + tax;



  const initiatePayment = async () => {
 
    setPaymentError(null);

    try {
      const requestData = {
        amount: Math.round(starterTotal * 100), // Convert to cents (starter plan)
        currency: "usd",
        successUrl: `${window.location.origin}/payment/premium/success`,
        cancelUrl: `${window.location.origin}/payment/error`,
      };
      
      const response = await createCheckoutSession(requestData);
      
      if (!response.status || !response.data?.checkoutUrl) {
        const errorMsg = response.message || "Failed to initialize payment";
        throw new Error(errorMsg);
      }

      // Open Stripe checkout in a new tab
      const newTab = window.open(response.data.checkoutUrl, '_blank');
      if (!newTab) {
        // Fallback if popup is blocked
        window.location.href = response.data.checkoutUrl;
      } else {
        // Start polling for payment completion
        startPaymentPolling();
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to initialize payment. Please try again.";
      setPaymentError(errorMessage);
      showError(errorMessage);
    }
  };

  const initiatePremiumPayment = async () => {
 
    setPremiumPaymentError(null);

    try {
      const requestData = {
        amount: Math.round(premiumPrice * 100), // Convert to cents
        currency: "usd",
        successUrl: `${window.location.origin}/payment/premium/success`,
        cancelUrl: `${window.location.origin}/payment/post/error`,
      };

      const response = await createSubscriptionSession(requestData);

      if (!response.status || !response.data?.checkoutUrl) {
        const errorMsg = response.message || "Failed to initialize payment";
        throw new Error(errorMsg);
      }

      // Open Stripe checkout in a new tab
      const newTab = window.open(response.data.checkoutUrl, '_blank');
      if (!newTab) {
        // Fallback if popup is blocked
        window.location.href = response.data.checkoutUrl;
      } else {
        // Start polling for payment completion
        startPaymentPolling();
      }
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to initialize payment. Please try again.";
      setPremiumPaymentError(errorMessage);
      showError(errorMessage);
    }
  };

  return (
    <Paper
      p={isMobile ? "sm" : "xl"}
      radius="md"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative",
        ...(isMobile && {
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflow: "auto",
        }),
      }}
    >
      <LoadingOverlay 
        visible={isInitiatingPayment || isInitiatingPremiumPayment || isPricingLoading || isPollingPayment} 
        overlayProps={{ blur: 2 }}
        loaderProps={{
          children: isPollingPayment ? "Waiting for payment completion..." : undefined
        }}
      />

              <Stack gap={isMobile ? "md" : "xl"} style={isMobile ? { flex: 1 } : {}}>
        {/* Payment Status Alert */}
        {isPollingPayment && (
          <Alert
            icon={<IconClock size={16} />}
            title="Waiting for Payment"
            color="blue"
            variant="light"
            style={{
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.2)",
            }}
          >
            <Text size="sm" style={{ color: theme.colors.blue[3] }}>
              Complete your payment in the new tab. This page will automatically redirect you once payment is confirmed.
            </Text>
          </Alert>
        )}

        {/* Header */}
        <Box ta="center">
          <Group justify="center" mb={isMobile ? "xs" : "sm"}>
            <ThemeIcon
              size={isMobile ? "lg" : "xl"}
              radius="md"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              <IconStar size={isMobile ? 20 : 24} />
            </ThemeIcon>
          </Group>
          <Text
            size={isMobile ? "lg" : "xl"}
            fw={700}
            style={{ color: theme.white }}
            mb="xs"
          >
            Choose Your Plan
          </Text>
          <Text
            size={isMobile ? "xs" : "sm"}
            style={{ color: theme.colors.gray[4] }}
          >
            Compare plans and pick what works best for you
          </Text>
        </Box>

        <SimpleGrid
          cols={{ base: 1, md: 2 }}
          spacing={isMobile ? "md" : "xl"}
        >
          {/* Column 1: Starter Plan */}
          <Paper
            p={isMobile ? "md" : "xl"}
            radius="lg"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Stack gap={isMobile ? "md" : "lg"} style={{ flex: 1 }}>
              {/* Starter Plan Header */}
              <Box>
                <Group mb={isMobile ? "xs" : "sm"}>
                  <ThemeIcon
                    size={isMobile ? "sm" : "md"}
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan" }}
                  >
                    <IconSparkles size={isMobile ? 16 : 18} />
                  </ThemeIcon>
                  <Text
                    fw={600}
                    style={{ color: theme.white }}
                    size={isMobile ? "lg" : "xl"}
                  >
                    Starter Plan
                  </Text>
                </Group>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                  mb="md"
                >
                  Essential features to get started
                </Text>
                <Group align="baseline" mb="lg">
                  <Text
                    fw={700}
                    size={isMobile ? "xl" : "2xl"}
                    style={{ color: theme.white }}
                  >
                    ${starterPrice.toFixed(2)}
                  </Text>
                  <Text
                    size={isMobile ? "xs" : "sm"}
                    style={{ color: theme.colors.gray[5] }}
                  >
                    /month
                  </Text>
                </Group>
              </Box>

              {/* Starter Features */}
              <Box style={{ flex: 1 }}>
                <Text
                  fw={500}
                  style={{ color: theme.white }}
                  mb="md"
                  size={isMobile ? "sm" : "md"}
                >
                  What's Included
                </Text>
                <Stack gap={isMobile ? "xs" : "sm"}>
                  {STARTER_FEATURES.map((feature, index) => (
                    <Group key={index} gap="sm" align="flex-start">
                      <ThemeIcon
                        size={isMobile ? "xs" : "sm"}
                        radius="xl"
                        variant="light"
                        color={feature.included ? feature.color : "gray"}
                      >
                        {feature.included ? (
                          <feature.icon size={isMobile ? 12 : 14} />
                        ) : (
                          <IconX size={isMobile ? 12 : 14} />
                        )}
                      </ThemeIcon>
                      <Box style={{ flex: 1 }}>
                        <Text
                          size={isMobile ? "xs" : "sm"}
                          fw={500}
                          style={{ 
                            color: feature.included ? theme.white : theme.colors.gray[6],
                            textDecoration: feature.included ? "none" : "line-through"
                          }}
                        >
                          {feature.title}
                        </Text>
                        <Text
                          size={isMobile ? "10px" : "xs"}
                          style={{ 
                            color: feature.included ? theme.colors.gray[5] : theme.colors.gray[7]
                          }}
                        >
                          {feature.description}
                        </Text>
                      </Box>
                    </Group>
                  ))}
                </Stack>
              </Box>

              {/* Starter Plan CTA */}
              <Box>
                {paymentError && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    variant="light"
                    mb="md"
                  >
                    {paymentError}
                  </Alert>
                )}
                <Button
                  size={isMobile ? "md" : "lg"}
                  fullWidth
                  loading={isInitiatingPayment}
                  onClick={initiatePayment}
                  variant="gradient"
                  gradient={{ from: "indigo", to: "cyan" }}
                  leftSection={<IconRocket size={isMobile ? 16 : 18} />}
                >
                  {isInitiatingPayment ? "Processing..." : "Get Started"}
                </Button>
                <Text
                  size={isMobile ? "10px" : "xs"}
                  style={{ color: theme.colors.gray[5] }}
                  ta="center"
                  mt="xs"
                >
                  Monthly billing • Cancel anytime
                </Text>
              </Box>
            </Stack>
          </Paper>

          {/* Column 2: Premium Plan */}
          <Paper
            p={isMobile ? "md" : "xl"}
            radius="lg"
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              border: "2px solid rgba(255, 215, 0, 0.3)",
              backdropFilter: "blur(10px)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            {/* Popular Badge */}
            <Badge
              variant="gradient"
              gradient={{ from: "orange", to: "red" }}
              size="sm"
              style={{
                position: "absolute",
                top: isMobile ? 8 : 16,
                right: isMobile ? 8 : 16,
              }}
            >
              Most Popular
            </Badge>

            <Stack gap={isMobile ? "md" : "lg"} style={{ flex: 1 }}>
              {/* Premium Plan Header */}
              <Box>
                <Group mb={isMobile ? "xs" : "sm"}>
                  <ThemeIcon
                    size={isMobile ? "sm" : "md"}
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "yellow", to: "orange" }}
                  >
                    <IconCrown size={isMobile ? 16 : 18} />
                  </ThemeIcon>
                  <Text
                    fw={600}
                    style={{ color: theme.white }}
                    size={isMobile ? "lg" : "xl"}
                  >
                    Premium Match+
                  </Text>
                </Group>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                  mb="md"
                >
                  The ultimate matching experience
                </Text>
                <Group align="baseline" mb="lg">
                  <Text
                    fw={700}
                    size={isMobile ? "xl" : "2xl"}
                    style={{ color: theme.white }}
                  >
                    ${premiumPrice.toFixed(2)}
                  </Text>
                  <Text
                    size={isMobile ? "xs" : "sm"}
                    style={{ color: theme.colors.gray[5] }}
                  >
                    /month
                  </Text>
                </Group>
              </Box>

              {/* Premium Features */}
              <Box style={{ flex: 1 }}>
                <Text
                  fw={500}
                  style={{ color: theme.white }}
                  mb="md"
                  size={isMobile ? "sm" : "md"}
                >
                  Everything in Starter, plus:
                </Text>
                <Stack gap={isMobile ? "xs" : "sm"}>
                  {PREMIUM_FEATURES.map((feature, index) => (
                    <Group key={index} gap="sm" align="flex-start">
                      <ThemeIcon
                        size={isMobile ? "xs" : "sm"}
                        radius="xl"
                        variant="gradient"
                        gradient={{ from: feature.color, to: feature.color === "orange" ? "red" : "blue" }}
                      >
                        <feature.icon size={isMobile ? 12 : 14} />
                      </ThemeIcon>
                      <Box style={{ flex: 1 }}>
                        <Group gap="xs" mb="2px">
                          <Text
                            size={isMobile ? "xs" : "sm"}
                            fw={500}
                            style={{ color: theme.white }}
                          >
                            {feature.title}
                          </Text>
                          {feature.badge && (
                            <Badge
                              size="xs"
                              variant="light"
                              color={feature.color}
                            >
                              {feature.badge}
                            </Badge>
                          )}
                        </Group>
                        <Text
                          size={isMobile ? "10px" : "xs"}
                          style={{ color: theme.colors.gray[5] }}
                        >
                          {feature.description}
                        </Text>
                      </Box>
                    </Group>
                  ))}
                </Stack>
              </Box>

              {/* Premium Plan CTA */}
              <Box>
                {premiumPaymentError && (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    variant="light"
                    mb="md"
                  >
                    {premiumPaymentError}
                  </Alert>
                )}
                <Button
                  size={isMobile ? "md" : "lg"}
                  fullWidth
                  loading={isInitiatingPremiumPayment}
                  onClick={initiatePremiumPayment}
                  variant="gradient"
                  gradient={{ from: "yellow", to: "orange" }}
                  leftSection={<IconCrown size={isMobile ? 16 : 18} />}
                >
                  {isInitiatingPremiumPayment ? "Processing..." : "Upgrade to Premium"}
                </Button>
                <Text
                  size={isMobile ? "10px" : "xs"}
                  style={{ color: theme.colors.gray[5] }}
                  ta="center"
                  mt="xs"
                >
                  Monthly billing • Cancel anytime
                </Text>
              </Box>
            </Stack>
          </Paper>
        </SimpleGrid>

        {/* Security Footer */}
        <Box ta="center">
          <Text
            size={isMobile ? "10px" : "xs"}
            style={{ color: theme.colors.gray[5] }}
          >
            <IconShield
              size={12}
              style={{ display: "inline", marginRight: 4 }}
            />
            Secure payment powered by Stripe
          </Text>
        </Box>
      </Stack>
    </Paper>
  );
};

export default Payment;