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
  IconFilter,
  IconEye,
  IconHeartHandshake,
  IconLock,
  IconStar,
  IconSparkles,
  IconShield,
  IconUserCheck,
  IconGift,
  IconRocket,
  IconCreditCard,
  IconAlertCircle,
} from "@tabler/icons-react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useUpdateCurrentUserProfile } from "../../../hooks/api";
import { showSuccess, showError } from "../../../utils";
import axios from "axios";
import type { StripeCardElementChangeEvent } from "@stripe/stripe-js";

interface PaymentProps {
  onComplete: () => void;
}

interface PaymentIntentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

interface StripeError {
  message: string;
  type: string;
  code?: string;
}

// Platform features data
const PLATFORM_FEATURES = [
  {
    title: "Advanced Matching Filters",
    description: "Filter by major, interests, location, and more",
    icon: IconFilter,
    color: "blue",
  },
  {
    title: "Unlimited Profile Views",
    description: "Browse through all profiles without restrictions",
    icon: IconEye,
    color: "cyan",
  },
  {
    title: "Smart Matching Algorithm",
    description: "Get matched with the most compatible classmates",
    icon: IconHeartHandshake,
    color: "indigo",
  },
  {
    title: "Profile Flexibility",
    description: "Edit and update your profile whenever you need",
    icon: IconLock,
    color: "violet",
  },
  {
    title: "Priority Support",
    description: "Get dedicated customer support when you need help",
    icon: IconShield,
    color: "green",
  },
  {
    title: "Verified Profile Badge",
    description: "Stand out with your verified student status",
    icon: IconUserCheck,
    color: "yellow",
  },
];

const PRICING = {
  monthlyPrice: 9.99,
  tax: 0.0,
};

// Stripe Card Element styling
// const cardElementOptions = {
//   style: {
//     base: {
//       fontSize: "16px",
//       color: "#ffffff",
//       fontFamily: "system-ui, -apple-system, sans-serif",
//       "::placeholder": {
//         color: "#9ca3af",
//       },
//       backgroundColor: "transparent",
//     },
//     invalid: {
//       color: "#ef4444",
//       iconColor: "#ef4444",
//     },
//     complete: {
//       color: "#10b981",
//       iconColor: "#10b981",
//     },
//   },
//   hidePostalCode: true,
// };

const Payment: React.FC<PaymentProps> = ({ onComplete }) => {
  const theme = useMantineTheme();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useUpdateCurrentUserProfile();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const total = PRICING.monthlyPrice + PRICING.tax;

  const createPaymentIntent = async (
    amount: number
  ): Promise<PaymentIntentResponse> => {
    try {
      const response = await axios.post<PaymentIntentResponse>(
        `${"process.env.REACT_APP_API_URL"}/payments/create-payment-intent`,
        {
          amount,
          currency: "usd",
          metadata: {
            service: "profile_completion",
            plan: "monthly_access",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating payment intent:", error);
      throw new Error("Failed to initialize payment. Please try again.");
    }
  };

  const handleComplete = async () => {
    if (!stripe || !elements) {
      showError("Payment system is not ready. Please try again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      showError(
        "Card information is not available. Please refresh and try again."
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent(total);

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {},
          },
        }
      );

      if (error) {
        const stripeError = error as StripeError;
        throw new Error(
          stripeError.message || "Payment failed. Please try again."
        );
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment successful, update profile
        const profileResponse = await updateProfile({
          isProfileCompleted: true,
        });

        if (!profileResponse.status) {
          throw new Error(
            profileResponse.message || "Failed to complete profile setup"
          );
        }

        showSuccess(
          "Payment successful! Profile setup completed. Welcome to the platform!"
        );
        setShowPaymentModal(false);
        onComplete();
      }
    } catch (error) {
      const errorMessage =
        (error as Error).message || "Payment failed. Please try again.";
      setPaymentError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setCardComplete(event.complete);
    if (event.error) {
      setPaymentError(event.error.message);
    } else {
      setPaymentError(null);
    }
  };

  const handleStartPayment = () => {
    setShowPaymentModal(true);
    setPaymentError(null);
  };

  const isLoading = isProcessing || isUpdatingProfile;

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
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

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
                <IconRocket size={isMobile ? 20 : 24} />
              </ThemeIcon>
            </Group>
            <Text
              size={isMobile ? "lg" : "xl"}
              fw={700}
              style={{ color: theme.white }}
              mb="xs"
            >
              Complete Your Profile
            </Text>
            <Text
              size={isMobile ? "xs" : "sm"}
              style={{ color: theme.colors.gray[4] }}
            >
              Unlock all platform features and start connecting with classmates
            </Text>
          </Box>

          <SimpleGrid
            cols={{ base: 1, md: isMobile ? 1 : 2 }}
            spacing={isMobile ? "md" : "xl"}
          >
            {/* Platform Features Section */}
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
                {PLATFORM_FEATURES.map((feature, index) => (
                  <Card
                    key={index + "randoki"}
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
                  Platform Access Includes
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
                  <List.Item>Advanced matching algorithms</List.Item>
                  <List.Item>Unlimited profile browsing</List.Item>
                  <List.Item>Smart filters and search</List.Item>
                  <List.Item>Priority customer support</List.Item>
                  <List.Item>Verified student badge</List.Item>
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

              {/* Subscription Plan */}
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
                      Monthly Access
                    </Text>
                    <Text
                      size={isMobile ? "xs" : "sm"}
                      style={{ color: theme.colors.gray[4] }}
                    >
                      Full platform access, billed monthly
                    </Text>
                  </Box>
                  <Text
                    fw={700}
                    size={isMobile ? "lg" : "xl"}
                    style={{ color: theme.white }}
                  >
                    ${PRICING.monthlyPrice}/mo
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
                      Monthly Access Plan
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

              {/* Payment Button */}
              <Button
                size={isMobile ? "md" : "lg"}
                fullWidth
                mt={isMobile ? "md" : "xl"}
                loading={isLoading}
                onClick={handleStartPayment}
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
                leftSection={<IconGift size={isMobile ? 16 : 18} />}
                disabled={!stripe}
              >
                {isLoading ? "Processing..." : "Complete Profile Setup"}
              </Button>

              {/* Money-back guarantee */}
              <Text
                size={isMobile ? "10px" : "xs"}
                ta="center"
                mt="sm"
                style={{ color: theme.colors.gray[5] }}
              >
                30-day money-back guarantee • Cancel anytime
              </Text>
            </Paper>
          </SimpleGrid>
        </Stack>
      </Paper>

      {/* Payment Modal */}
      <Modal
        opened={showPaymentModal}
        onClose={() => !isProcessing && setShowPaymentModal(false)}
        title={
          <Group>
            <IconCreditCard size={20} />
            <Text fw={600}>Complete Payment</Text>
          </Group>
        }
        size="md"
        centered
        closeOnClickOutside={!isProcessing}
        closeOnEscape={!isProcessing}
      >
        <Stack gap="md">
          {/* Payment Summary */}
          <Box
            p="md"
            style={{
              background:
                theme.activeClassName === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[1],
              borderRadius: theme.radius.md,
            }}
          >
            <Group justify="space-between">
              <Text size="sm">Monthly Access Plan</Text>
              <Text fw={600}>${total.toFixed(2)}</Text>
            </Group>
          </Box>

          {/* Card Element */}
          <Box>
            <Text size="sm" fw={500} mb="xs">
              Card Information
            </Text>
            <Box
              p="md"
              style={{
                border: `1px solid ${
                  theme.activeClassName === "dark"
                    ? theme.colors.dark[4]
                    : theme.colors.gray[3]
                }`,
                borderRadius: theme.radius.md,
                background:
                  theme.activeClassName === "dark"
                    ? theme.colors.dark[7]
                    : theme.white,
              }}
            >
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color:
                        theme.activeClassName === "dark"
                          ? "#ffffff"
                          : "#000000",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      "::placeholder": {
                        color: "#9ca3af",
                      },
                      backgroundColor: "transparent",
                    },
                    invalid: {
                      color: "#ef4444",
                      iconColor: "#ef4444",
                    },
                    complete: {
                      color: "#10b981",
                      iconColor: "#10b981",
                    },
                  },
                  hidePostalCode: true,
                }}
                onChange={handleCardChange}
              />
            </Box>
          </Box>

          {/* Error Display */}
          {paymentError && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
            >
              {paymentError}
            </Alert>
          )}

          {/* Security Notice */}
          <Text size="xs" c="dimmed" ta="center">
            <IconShield
              size={12}
              style={{ display: "inline", marginRight: 4 }}
            />
            Your payment information is secure and encrypted
          </Text>

          {/* Action Buttons */}
          <Group justify="space-between" mt="md">
            <Button
              variant="subtle"
              onClick={() => setShowPaymentModal(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleComplete}
              loading={isProcessing}
              disabled={!stripe || !cardComplete}
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
            >
              {isProcessing ? "Processing..." : `Pay ${total.toFixed(2)}`}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default Payment;
