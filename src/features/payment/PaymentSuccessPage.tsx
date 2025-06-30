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
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate, useSearchParams } from "react-router";
import {
  IconCheck,
  IconBrandInstagram,
  IconHome,
  IconUser,
} from "@tabler/icons-react";
import { showSuccess } from "../../utils";
import { useAuthStore } from "../../store/auth.store";
import ROUTES from "../../constants/routes";

const PaymentSuccessPage: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    // Log page entry
 
    console.log("📊 Success page analytics:", {
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

    // Extract URL parameters for tracking
    const sessionId = searchParams.get("session_id");
    const paymentIntentId = searchParams.get("payment_intent");
    
    if (sessionId) {
      console.log("💳 Payment session details:", {
        sessionId,
        paymentIntentId,
        timestamp: new Date().toISOString()
      });
    }

    // Refresh user data to get updated payment status
    const refreshUserData = async () => {
      try {
 
        await fetchUser();
 
      } catch (error) {
        console.error("❌ PaymentSuccessPage: Failed to refresh user data:", error);
      }
    };

    refreshUserData();

    // Show success notification when page loads
    showSuccess(
      "Payment successful! Your post will be featured on your university's Instagram page within 24 hours!"
    );

    // Log success notification
 

    // Redirect based on whether the user has completed their profile
    const user = useAuthStore.getState().user;
    if (user) {
      if (user.isProfileCompleted) {
 
        navigate('/');
      } else {
 
        navigate('/profile-completion');
      }
    } else {
      // Fallback if user data isn't available for some reason
 
      navigate('/');
    }
  }, [searchParams, isMobile, fetchUser]);

  const handleGoToFeed = () => {
 
 
    navigate(ROUTES.DASHBOARD);
  };

  const handleGoToProfile = () => {
 
 
    navigate(ROUTES.DASHBOARD);
  };

  const handleGoHome = () => {
 
 
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #1a0030 50%, #000000 100%)",
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
            {/* Success Icon */}
            <ThemeIcon
              size={isMobile ? 80 : 100}
              radius="50%"
              variant="gradient"
              gradient={{ from: "green", to: "teal" }}
            >
              <IconCheck size={isMobile ? 40 : 50} />
            </ThemeIcon>

            {/* Success Message */}
            <Stack gap="md" align="center">
              <Title
                order={1}
                size={isMobile ? "h2" : "h1"}
                style={{ color: theme.white }}
              >
                Payment Successful! 🎉
              </Title>
              <Text
                size={isMobile ? "md" : "lg"}
                style={{ color: theme.colors.gray[3] }}
                maw={500}
              >
                Thank you for your payment! Your post will be featured on your
                university's Instagram page within 24 hours.
              </Text>
            </Stack>

            {/* Instagram Feature Info */}
            <Paper
              p={isMobile ? "md" : "lg"}
              radius="md"
              style={{
                background: "rgba(74, 93, 253, 0.1)",
                border: "1px solid rgba(74, 93, 253, 0.2)",
                width: "100%",
              }}
            >
              <Group justify="center" mb="sm">
                <ThemeIcon
                  size="md"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                >
                  <IconBrandInstagram size={18} />
                </ThemeIcon>
                <Text
                  fw={600}
                  style={{ color: theme.white }}
                  size={isMobile ? "sm" : "md"}
                >
                  What Happens Next?
                </Text>
              </Group>
              <Stack gap="xs">
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • Your post will be reviewed and optimized for maximum engagement
                </Text>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • We'll post it during peak engagement hours for your university
                </Text>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • You'll receive a notification once it's live on Instagram
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
                leftSection={<IconHome size={isMobile ? 16 : 18} />}
                onClick={handleGoToFeed}
              >
                Go to Feed
              </Button>
              
              <Group grow>
                <Button
                  size={isMobile ? "sm" : "md"}
                  variant="outline"
                  leftSection={<IconUser size={isMobile ? 14 : 16} />}
                  onClick={handleGoToProfile}
                  style={{
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: theme.white,
                  }}
                >
                  View Profile
                </Button>
                <Button
                  size={isMobile ? "sm" : "md"}
                  variant="subtle"
                  onClick={handleGoHome}
                  style={{ color: theme.colors.gray[4] }}
                >
                  Go Home
                </Button>
              </Group>
            </Stack>

            {/* Support Info */}
            <Text
              size="xs"
              style={{ color: theme.colors.gray[5] }}
              ta="center"
            >
              Questions? Contact us at{" "}
              <Text
                component="a"
                href="mailto:support@incomingclass.com"
                style={{ color: theme.colors.blue[4] }}
              >
                support@incomingclass.com
              </Text>
            </Text>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default PaymentSuccessPage; 