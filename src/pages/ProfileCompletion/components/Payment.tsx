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
  Modal,
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
  IconCreditCard,
} from "@tabler/icons-react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { showSuccess, showError } from "../../../utils";
import { request } from "../../../hooks/api/http.client";
import CheckoutForm from "./CheckoutForm";
import stripeConfig, { validateStripeConfig } from "../../../config/stripe.config";

// Load Stripe with configuration
const stripePromise = loadStripe(stripeConfig.publishableKey);

// Validate Stripe configuration on component load
if (!validateStripeConfig()) {
  console.warn('Stripe configuration is invalid. Payment functionality may not work correctly.');
}

interface PaymentIntentResponse {
  client_secret: string;
}

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

const PRICING = {
  monthlyPrice: 9.99,
  tax: 0.0,
};

const Payment: React.FC = () => {
  const theme = useMantineTheme();
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const total = PRICING.monthlyPrice + PRICING.tax;

  const initiatePayment = async () => {
    setIsInitiatingPayment(true);
    setPaymentError(null);

    try {
      // Call backend API to create payment intent
      const response = await request({
        url: "/users/payment/post",
        method: "POST",
        data: {
          amount: Math.round(total * 100), // Convert to cents
          currency: "usd",
        },
      });

      if (!response.status || !(response.data as PaymentIntentResponse)?.client_secret) {
        throw new Error(response.message || "Failed to initialize payment");
      }

      setClientSecret((response.data as PaymentIntentResponse).client_secret);
      setShowCheckoutModal(true);
    } catch (error) {
      const errorMessage = (error as Error).message || "Failed to initialize payment. Please try again.";
      setPaymentError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowCheckoutModal(false);
    showSuccess("Payment successful! Your post will be featured on your university's Instagram page within 24 hours!");
    // Redirect to thank you page
    window.location.href = "/thank-you";
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
    showError(error);
  };

  const handleCloseModal = () => {
    setShowCheckoutModal(false);
    setClientSecret(null);
    setPaymentError(null);
  };

  return (
    <>
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
        <LoadingOverlay visible={isInitiatingPayment} overlayProps={{ blur: 2 }} />

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
                  {/* <List.Item>Professional content optimization</List.Item> */}
                  <List.Item>Peak engagement time posting</List.Item>
                  {/* <List.Item>Hashtag and caption enhancement</List.Item> */}
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
                    ${PRICING.monthlyPrice}
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
                      ${PRICING.monthlyPrice.toFixed(2)}
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
                      ${PRICING.tax.toFixed(2)}
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
                {isInitiatingPayment ? "Initializing Payment..." : "Get Featured on Instagram"}
              </Button>

              {/* Guarantee text */}
              <Text
                size={isMobile ? "10px" : "xs"}
                ta="center"
                mt="sm"
                style={{ color: theme.colors.gray[5] }}
              >
                Posted within 24 hours • 100% satisfaction guarantee
              </Text>
            </Paper>
          </SimpleGrid>
        </Stack>
      </Paper>

      {/* Stripe Checkout Modal */}
      <Modal
        opened={showCheckoutModal}
        onClose={handleCloseModal}
        title={
          <Group>
            <IconCreditCard size={20} />
            <Text fw={600}>Complete Payment</Text>
          </Group>
        }
        size="md"
        centered
        closeOnClickOutside={false}
        closeOnEscape={false}
      >
        {clientSecret && (
          <Elements 
            stripe={stripePromise} 
            options={{ 
              clientSecret,
              appearance: stripeConfig.appearance,
            }}
          >
            <CheckoutForm
              amount={total}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={handleCloseModal}
            />
          </Elements>
        )}
      </Modal>
    </>
  );
};

export default Payment;
