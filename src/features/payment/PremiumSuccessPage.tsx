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
  List,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate, useSearchParams } from "react-router";
import {
  IconCheck,
  IconCrown,
  IconHome,
  IconUser,
  IconFilter,
  IconEye,
  IconHeartHandshake,
  IconLock,
} from "@tabler/icons-react";
import { showSuccess } from "../../utils";
import { useAuthStore } from "../../store/auth.store";
import ROUTES from "../../constants/routes";

const PremiumSuccessPage: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    // Log page entry
    console.log("🎉 PremiumSuccessPage: User landed on success page");
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
      console.log("💳 Premium subscription session details:", {
        sessionId,
        paymentIntentId,
        timestamp: new Date().toISOString()
      });
    }

    // Refresh user data to get updated subscription status
    const refreshUserData = async () => {
      try {
        console.log("🔄 PremiumSuccessPage: Refreshing user data to get updated subscription status");
        await fetchUser();
        console.log("✅ PremiumSuccessPage: User data refreshed successfully");
      } catch (error) {
        console.error("❌ PremiumSuccessPage: Failed to refresh user data:", error);
      }
    };

    refreshUserData();

    // Show success notification when page loads
    showSuccess(
      "Welcome to Premium! Your account has been upgraded with exclusive features."
    );

    // Log success notification
    console.log("🔔 Premium success notification displayed");
  }, [searchParams, isMobile, fetchUser]);

  const handleGoToFeed = () => {
    console.log("🏠 PremiumSuccessPage: User clicked 'Go to Feed'");
    console.log("📍 Navigation: /app");
    navigate(ROUTES.DASHBOARD);
  };

  const handleGoToProfile = () => {
    console.log("👤 PremiumSuccessPage: User clicked 'View Profile'");
    console.log("📍 Navigation: /app");
    navigate(ROUTES.DASHBOARD);
  };

  const handleGoHome = () => {
    console.log("🏡 PremiumSuccessPage: User clicked 'Go Home'");
    console.log("📍 Navigation: /app");
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
              gradient={{ from: "indigo", to: "cyan" }}
            >
              <IconCrown size={isMobile ? 40 : 50} />
            </ThemeIcon>

            {/* Success Message */}
            <Stack gap="md" align="center">
              <Title
                order={1}
                size={isMobile ? "h2" : "h1"}
                style={{ color: theme.white }}
              >
                Welcome to Premium! 🎉
              </Title>
              <Text
                size={isMobile ? "md" : "lg"}
                style={{ color: theme.colors.gray[3] }}
                maw={500}
              >
                Thank you for upgrading! Your account now has access to all premium features
                and exclusive benefits.
              </Text>
            </Stack>

            {/* Premium Features Info */}
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
                  <IconCrown size={18} />
                </ThemeIcon>
                <Text
                  fw={600}
                  style={{ color: theme.white }}
                  size={isMobile ? "sm" : "md"}
                >
                  Your Premium Benefits
                </Text>
              </Group>
              <List
                spacing="xs"
                style={{alignItems: "flex-start",textAlign: "left"}}
                icon={
                  <ThemeIcon color="blue" size="sm" radius="xl">
                    <IconCheck size={12} />
                  </ThemeIcon>
                }
              >
                <List.Item icon={
                  <ThemeIcon color="blue" size="sm" radius="xl">
                    <IconFilter size={12} />
                  </ThemeIcon>
                }
                c="white"
                >
                  Advanced matching filters
                </List.Item>
                <List.Item 
                c="white"
                icon={
                  <ThemeIcon color="blue" size="sm" radius="xl">
                    <IconEye size={12} />
                  </ThemeIcon>
                }>
                  View unlimited profiles
                </List.Item>
                <List.Item 
                c="white"
                icon={
                  <ThemeIcon color="blue" size="sm" radius="xl">
                    <IconHeartHandshake size={12} />
                  </ThemeIcon>
                }>
                  Priority matching algorithm
                </List.Item>
                <List.Item 
                c="white"
                icon={
                  <ThemeIcon color="blue" size="sm" radius="xl">
                    <IconLock size={12} />
                  </ThemeIcon>
                }>
                  Edit your profile anytime
                </List.Item>
              </List>
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
                Try Premium Features
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

export default PremiumSuccessPage; 