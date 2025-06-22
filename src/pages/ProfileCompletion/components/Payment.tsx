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
  IconTrendingUp,
  IconHeart,
  IconShare,
  IconAlertCircle,
} from "@tabler/icons-react";
import { showError } from "../../../utils";
import { useCreateCheckoutSession, usePricing } from "../../../hooks/api";

// Instagram post features data
const INSTAGRAM_FEATURES = [
  {
    title: "University Instagram Feature",
    description: "Your post will be featured on your university's official Instagram page",
    icon: IconBrandInstagram,
    color: "blue",
  },
  {
    title: "Maximum Visibility",
    description: "Reach thousands of students and potential connections at your university",
    icon: IconEye,
    color: "cyan",
  },
  {
    title: "Connect with Classmates",
    description: "Get discovered by students in your major, year, and interests",
    icon: IconUsers,
    color: "indigo",
  },
  {
    title: "Boost Your Profile",
    description: "Stand out from the crowd with premium Instagram placement",
    icon: IconTrendingUp,
    color: "violet",
  },
  {
    title: "Quality Assurance",
    description: "Professional posting with optimal timing for maximum engagement",
    icon: IconShield,
    color: "green",
  },
  {
    title: "Engagement Guarantee",
    description: "Guaranteed likes, comments, and follows from your university community",
    icon: IconHeart,
    color: "yellow",
  },
];

const Payment: React.FC = () => {
  const theme = useMantineTheme();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { mutateAsync: createCheckoutSession, isPending: isInitiatingPayment } = useCreateCheckoutSession();
  const { data: pricingData, isLoading: isPricingLoading } = usePricing();

  const price = pricingData?.data?.post || 0;
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
        successUrl: `${window.location.origin}/payment/post/success`,
        cancelUrl: `${window.location.origin}/payment/post/error`,
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
              <IconBrandInstagram size={isMobile ? 20 : 24} />
              </ThemeIcon>
            </Group>
            <Text
              size={isMobile ? "lg" : "xl"}
              fw={700}
              style={{ color: theme.white }}
              mb="xs"
            >
            Get Featured on Your University's Instagram
            </Text>
            <Text
              size={isMobile ? "xs" : "sm"}
              style={{ color: theme.colors.gray[4] }}
            >
            Boost your visibility and connect with thousands of students at your university
            </Text>
          </Box>

          <SimpleGrid
            cols={{ base: 1, md: isMobile ? 1 : 2 }}
            spacing={isMobile ? "md" : "xl"}
          >
          {/* Instagram Features Section */}
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
                  What You Get
                </Text>
              </Group>

              <Stack gap={isMobile ? "sm" : "md"}>
              {INSTAGRAM_FEATURES.map((feature, index) => (
                  <Card
                  key={index}
                    p={isMobile ? "sm" : "md"}
                    radius="md"
                    style={{
                      background: "rgba(255, 255, 255, 0.03)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                    }}
                  >
                    <Group gap="sm" mb={isMobile ? "4px" : "xs"}>
                      <ThemeIcon
                        size={isMobile ? "xs" : "sm"}
                        radius="xl"
                        variant="light"
                        color={feature.color}
                      >
                        <feature.icon size={isMobile ? 12 : 14} />
                      </ThemeIcon>
                      <Text
                        size={isMobile ? "xs" : "sm"}
                        fw={500}
                        style={{ color: theme.white }}
                      >
                        {feature.title}
                      </Text>
                    </Group>
                    <Text
                      size={isMobile ? "10px" : "xs"}
                      style={{ color: theme.colors.gray[5] }}
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
                Instagram Feature Package Includes
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
                <List.Item>Featured post on university Instagram</List.Item>
                <List.Item>Peak engagement time posting</List.Item>
                <List.Item>24-hour posting guarantee</List.Item>
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

            {/* Instagram Feature Plan */}
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
                    Instagram Feature
                    </Text>
                    <Text
                      size={isMobile ? "xs" : "sm"}
                      style={{ color: theme.colors.gray[4] }}
                    >
                    Get your post featured on your university's Instagram page
                    </Text>
                  </Box>
                  <Text
                    fw={700}
                    size={isMobile ? "lg" : "xl"}
                    style={{ color: theme.white }}
                  >
                  ${price.toFixed(2)}
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
                    Instagram Feature Post
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

            {/* Get Featured Button */}
            <Button
              size={isMobile ? "md" : "lg"}
              fullWidth
              mt={isMobile ? "md" : "xl"}
              loading={isInitiatingPayment}
              onClick={initiatePayment}
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              leftSection={<IconShare size={isMobile ? 16 : 18} />}
            >
              {isInitiatingPayment ? "Redirecting to Checkout..." : "Get Featured on Instagram"}
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
                Posted within 24 hours • 100% satisfaction guarantee
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>
        </Stack>
    </Paper>
  );
};

export default Payment;
