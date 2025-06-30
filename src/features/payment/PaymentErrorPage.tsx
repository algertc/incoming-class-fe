import React, { useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Box,
  ThemeIcon,
  Group,
  useMantineTheme,
  Alert,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate, useSearchParams } from "react-router";
import {
  IconX,
  IconAlertCircle,
  IconArrowLeft,
  IconRefresh,
  IconHome,
  IconHelpCircle,
} from "@tabler/icons-react";
import { showError } from "../../utils";

const PaymentErrorPage: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Get error details from URL params if available
  const errorMessage = searchParams.get("error") || "Payment was cancelled or failed";
  const errorCode = searchParams.get("error_code");

  useEffect(() => {
    // Log page entry and error details
 
    console.log("📊 Error page analytics:", {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      url: window.location.href,
      searchParams: Object.fromEntries(searchParams.entries()),
      isMobile,
      screenSize: {
        width: window.screen.width,
        height: window.screen.height
      }
    });

    // Log specific error details
    console.log("🔍 Payment error details:", {
      errorMessage,
      errorCode,
      timestamp: new Date().toISOString(),
      hasErrorCode: !!errorCode,
      hasCustomError: searchParams.has("error")
    });

    // Extract additional error parameters
    const sessionId = searchParams.get("session_id");
    const paymentIntentId = searchParams.get("payment_intent");
    const errorType = searchParams.get("error_type");
    
    if (sessionId || paymentIntentId || errorType) {
      console.log("💳 Payment failure context:", {
        sessionId,
        paymentIntentId,
        errorType,
        timestamp: new Date().toISOString()
      });
    }

    // Show error notification when page loads
    showError("Payment failed. Please try again or contact support if the issue persists.");

    // Log error notification
 
  }, [searchParams, isMobile, errorMessage, errorCode]);

  const handleRetryPayment = () => {
 
 
 
    navigate("/profile-completion");
  };

  const handleGoHome = () => {
 
 
 
    navigate("/");
  };

  const handleContactSupport = () => {
 
 
 
    navigate("/contact");
  };

  const handleGoBack = () => {
 
 
    navigate(-1);
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #300a0a 50%, #000000 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "1rem" : "2rem",
      }}
    >
      <Container size="sm">
        <Paper
          p={isMobile ? "xl" : "3rem"}
          radius="lg"
          style={{
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          <Stack gap={isMobile ? "lg" : "xl"} align="center">
            {/* Error Icon */}
            <ThemeIcon
              size={isMobile ? 80 : 100}
              radius="50%"
              variant="gradient"
              gradient={{ from: "red", to: "orange" }}
            >
              <IconX size={isMobile ? 40 : 50} />
            </ThemeIcon>

            {/* Error Message */}
            <Stack gap="md" align="center">
              <Title
                order={1}
                size={isMobile ? "h2" : "h1"}
                style={{ color: theme.white }}
              >
                Payment Failed
              </Title>
              <Text
                size={isMobile ? "md" : "lg"}
                style={{ color: theme.colors.gray[3] }}
                maw={500}
              >
                We couldn't process your payment. Don't worry, no charges were made to your account.
              </Text>
            </Stack>

            {/* Error Details */}
            <Alert
              icon={<IconAlertCircle size={16} />}
              color="red"
              variant="light"
              style={{ width: "100%" }}
            >
              <Stack gap="xs">
                <Text size="sm" fw={500}>
                  Error Details:
                </Text>
                <Text size="sm">{errorMessage}</Text>
                {errorCode && (
                  <Text size="xs" c="dimmed">
                    Error Code: {errorCode}
                  </Text>
                )}
              </Stack>
            </Alert>

            {/* Common Issues */}
            <Paper
              p={isMobile ? "md" : "lg"}
              radius="md"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                width: "100%",
              }}
            >
              <Group justify="center" mb="sm">
                <ThemeIcon
                  size="md"
                  radius="md"
                  variant="light"
                  color="yellow"
                >
                  <IconHelpCircle size={18} />
                </ThemeIcon>
                <Text
                  fw={600}
                  style={{ color: theme.white }}
                  size={isMobile ? "sm" : "md"}
                >
                  Common Issues
                </Text>
              </Group>
              <Stack gap="xs">
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • Payment was cancelled during checkout
                </Text>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • Insufficient funds or declined card
                </Text>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • Network connection issues
                </Text>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • Browser or security software blocking the payment
                </Text>
              </Stack>
            </Paper>

            {/* Action Buttons */}
            <Stack gap="md" style={{ width: "100%" }}>
              <Button
                size={isMobile ? "md" : "lg"}
                fullWidth
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
                leftSection={<IconRefresh size={isMobile ? 16 : 18} />}
                onClick={handleRetryPayment}
              >
                Try Payment Again
              </Button>
              
              <Group grow>
                <Button
                  size={isMobile ? "sm" : "md"}
                  variant="outline"
                  leftSection={<IconArrowLeft size={isMobile ? 14 : 16} />}
                  onClick={handleGoBack}
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: theme.white,
                  }}
                >
                  Go Back
                </Button>
                <Button
                  size={isMobile ? "sm" : "md"}
                  variant="subtle"
                  leftSection={<IconHome size={isMobile ? 14 : 16} />}
                  onClick={handleGoHome}
                  style={{ color: theme.colors.gray[4] }}
                >
                  Go Home
                </Button>
              </Group>
            </Stack>

            {/* Support Info */}
            <Stack gap="xs" align="center">
              <Text
                size="sm"
                style={{ color: theme.colors.gray[4] }}
                ta="center"
              >
                Still having trouble?
              </Text>
              <Button
                variant="subtle"
                size="sm"
                onClick={handleContactSupport}
                style={{ color: theme.colors.blue[4] }}
              >
                Contact Support
              </Button>
              <Text
                size="xs"
                style={{ color: theme.colors.gray[5] }}
                ta="center"
              >
                Or email us at{" "}
                <Text
                  component="a"
                  href="mailto:support@incomingclass.com"
                  style={{ color: theme.colors.blue[4] }}
                >
                  support@incomingclass.com
                </Text>
              </Text>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentErrorPage; 