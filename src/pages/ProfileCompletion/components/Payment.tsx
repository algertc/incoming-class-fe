import React, { useState } from "react";
import {
  Group,
  Button,
  Stack,
  Text,
  useMantineTheme,
  Paper,
  Divider,
  Box,
  List,
  ThemeIcon,
  Card,
  SimpleGrid,
  LoadingOverlay,
  Alert,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCheck,
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
} from "@tabler/icons-react";
import { showError } from "../../../utils";
import { useCreateCheckoutSession, usePricing } from "../../../hooks/api";

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

const Payment: React.FC = () => {
  const theme = useMantineTheme();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { mutateAsync: createCheckoutSession, isPending: isInitiatingPayment } = useCreateCheckoutSession();
  const { data: pricingData, isLoading: isPricingLoading } = usePricing();

  const price = pricingData?.data?.premium || 0;
  const tax = 0.0;
  const total = price + tax;

  const initiatePayment = async () => {
    console.log("🔄 Payment initiation started");
    console.log("💰 Payment details:", {
      amount: Math.round(total * 100),
      currency: "usd",
      totalPrice: total,
      price,
      tax
    });

    setPaymentError(null);

    try {
      console.log("📡 Creating checkout session...");
      const requestData = {
        amount: Math.round(total * 100), // Convert to cents
        currency: "usd",
        successUrl: `${window.location.origin}/payment/premium/success`,
        cancelUrl: `${window.location.origin}/payment/error`,
      };
      
      console.log("📤 Request payload:", requestData);

      const response = await createCheckoutSession(requestData);
      
      console.log("📥 Checkout session response:", {
        status: response.status,
        message: response.message,
        data: response.data,
        timestamp: new Date().toISOString()
      });

      if (!response.status || !response.data?.checkoutUrl) {
        const errorMsg = response.message || "Failed to initialize payment";
        console.error("❌ Checkout session failed:", {
          error: errorMsg,
          response: response,
          timestamp: new Date().toISOString()
        });
        throw new Error(errorMsg);
      }

      console.log("✅ Checkout session created successfully");
      console.log("🔗 Checkout URL:", response.data.checkoutUrl);
      console.log("📊 Transaction Status:", response.data.transactionStatus);
      console.log("🚀 Redirecting to Stripe Checkout...");

      // Log redirect attempt
      console.log("🌐 Redirect details:", {
        from: window.location.href,
        to: response.data.checkoutUrl,
        timestamp: new Date().toISOString()
      });

      // Redirect to Stripe Checkout
      window.location.href = response.data.checkoutUrl;
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to initialize payment. Please try again.";
      
      console.error("💥 Payment initiation failed:", {
        error: errorMessage,
        errorObject: error,
        stack: (error as Error).stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      });

      setPaymentError(errorMessage);
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
      <LoadingOverlay visible={isInitiatingPayment || isPricingLoading} overlayProps={{ blur: 2 }} />

        <Stack gap={isMobile ? "md" : "xl"} style={isMobile ? { flex: 1 } : {}}>
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
            Get Started with Starter Plan
            </Text>
            <Text
              size={isMobile ? "xs" : "sm"}
              style={{ color: theme.colors.gray[4] }}
            >
            Begin your journey with essential features to connect with your university community
            </Text>
          </Box>

          <SimpleGrid
            cols={{ base: 1, md: isMobile ? 1 : 2 }}
            spacing={isMobile ? "md" : "xl"}
          >
          {/* Starter Plan Features Section */}
            <Paper
              p={isMobile ? "md" : "xl"}
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Group mb={isMobile ? "sm" : "lg"}>
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
                  size={isMobile ? "sm" : "md"}
                >
                  Starter Plan Features
                </Text>
              </Group>

              <Stack gap={isMobile ? "sm" : "md"}>
              {STARTER_FEATURES.map((feature, index) => (
                  <Card
                  key={index}
                    p={isMobile ? "sm" : "md"}
                    radius="md"
                    style={{
                      background: feature.included 
                        ? "rgba(255, 255, 255, 0.03)" 
                        : "rgba(255, 255, 255, 0.01)",
                      border: feature.included 
                        ? "1px solid rgba(255, 255, 255, 0.08)" 
                        : "1px solid rgba(255, 255, 255, 0.04)",
                      opacity: feature.included ? 1 : 0.6,
                    }}
                  >
                    <Group gap="sm" mb={isMobile ? "4px" : "xs"}>
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
                    </Group>
                    <Text
                      size={isMobile ? "10px" : "xs"}
                      style={{ 
                        color: feature.included ? theme.colors.gray[5] : theme.colors.gray[7]
                      }}
                    >
                      {feature.description}
                    </Text>
                  </Card>
                ))}
              </Stack>

              {/* What's Included Summary */}
              <Box
                p={isMobile ? "sm" : "md"}
                mt={isMobile ? "sm" : "lg"}
                style={{
                  background: "rgba(74, 93, 253, 0.1)",
                  borderRadius: theme.radius.md,
                  border: "1px solid rgba(74, 93, 253, 0.2)",
                }}
              >
                <Text
                  size={isMobile ? "xs" : "sm"}
                  fw={500}
                  style={{ color: theme.white }}
                  mb={isMobile ? "xs" : "sm"}
                >
                Starter Plan Includes
                </Text>
                <List
                  spacing={isMobile ? "4px" : "xs"}
                  size={isMobile ? "xs" : "sm"}
                  center
                  styles={{
                    itemWrapper: { color: theme.white },
                  }}
                  icon={
                    <ThemeIcon
                      color="blue"
                      size={isMobile ? "xs" : "xs"}
                      radius="xl"
                    >
                      <IconCheck size={isMobile ? 8 : 10} />
                    </ThemeIcon>
                  }
                >
                <List.Item>1 post submission to Instagram + website</List.Item>
                <List.Item>Access to view 10 student profiles</List.Item>
                <List.Item>Basic profile browsing features</List.Item>
                </List>
              </Box>
            </Paper>

            {/* Billing Summary Section */}
            <Paper
              p={isMobile ? "md" : "xl"}
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Group mb={isMobile ? "sm" : "lg"}>
                <ThemeIcon
                  size={isMobile ? "sm" : "md"}
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "green", to: "teal" }}
                >
                  <IconStar size={isMobile ? 16 : 18} />
                </ThemeIcon>
                <Text
                  fw={600}
                  style={{ color: theme.white }}
                  size={isMobile ? "sm" : "md"}
                >
                  Billing Summary
                </Text>
              </Group>

            {/* Starter Plan */}
              <Card
                p={isMobile ? "md" : "lg"}
                radius="md"
                mb={isMobile ? "md" : "xl"}
                style={{
                  background: "rgba(74, 93, 253, 0.2)",
                  border: "1px solid rgba(74, 93, 253, 0.4)",
                }}
              >
                <Group justify="space-between" align="center">
                  <Box>
                    <Text
                      fw={600}
                      size={isMobile ? "md" : "lg"}
                      style={{ color: theme.white }}
                    >
                    Starter Plan
                    </Text>
                    <Text
                      size={isMobile ? "xs" : "sm"}
                      style={{ color: theme.colors.gray[4] }}
                    >
                    Monthly subscription with essential features
                    </Text>
                  </Box>
                  <Text
                    fw={700}
                    size={isMobile ? "lg" : "xl"}
                    style={{ color: theme.white }}
                  >
                  ${price.toFixed(2)}/mo
                  </Text>
                </Group>
              </Card>

              {/* Order Summary */}
              <Box
                p={isMobile ? "md" : "lg"}
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: theme.radius.md,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <Text
                  fw={600}
                  style={{ color: theme.white }}
                  mb={isMobile ? "sm" : "md"}
                  size={isMobile ? "sm" : "md"}
                >
                  Order Summary
                </Text>

                <Stack gap={isMobile ? "xs" : "sm"}>
                  <Group justify="space-between">
                    <Text
                      style={{ color: theme.white }}
                      size={isMobile ? "xs" : "sm"}
                    >
                    Starter Plan (Monthly)
                    </Text>
                    <Text
                      fw={500}
                      style={{ color: theme.white }}
                      size={isMobile ? "xs" : "sm"}
                    >
                      ${price.toFixed(2)}
                    </Text>
                  </Group>

                  <Group justify="space-between">
                    <Text
                      style={{ color: theme.colors.gray[5] }}
                      size={isMobile ? "xs" : "sm"}
                    >
                      Tax
                    </Text>
                    <Text
                      style={{ color: theme.colors.gray[5] }}
                      size={isMobile ? "xs" : "sm"}
                    >
                      ${tax.toFixed(2)}
                    </Text>
                  </Group>

                  <Divider
                    style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                  />

                  <Group justify="space-between">
                    <Text
                      fw={600}
                      size={isMobile ? "md" : "lg"}
                      style={{ color: theme.white }}
                    >
                      Total
                    </Text>
                    <Text
                      fw={600}
                      size={isMobile ? "md" : "lg"}
                      style={{ color: theme.white }}
                    >
                      ${total.toFixed(2)}
                    </Text>
                  </Group>
                </Stack>
          </Box>

          {/* Error Display */}
          {paymentError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
                mt="md"
            >
              {paymentError}
            </Alert>
          )}

            {/* Get Started Button */}
            <Button
              size={isMobile ? "md" : "lg"}
              fullWidth
              mt={isMobile ? "md" : "xl"}
              loading={isInitiatingPayment}
              onClick={initiatePayment}
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              leftSection={<IconRocket size={isMobile ? 16 : 18} />}
            >
              {isInitiatingPayment ? "Redirecting to Checkout..." : "Get Started with Starter Plan"}
            </Button>

            {/* Security & Guarantee text */}
            <Stack gap="xs" mt="sm" ta="center">
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
              <Text
                size={isMobile ? "10px" : "xs"}
                style={{ color: theme.colors.gray[5] }}
              >
                Monthly billing • Cancel anytime
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>
        </Stack>
    </Paper>
  );
};

export default Payment;
