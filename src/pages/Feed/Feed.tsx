import React, { useEffect, useState } from "react";
import { Box, Container, Grid, useMantineTheme, Stack, Button, Text, Group } from "@mantine/core";
import { LeftSidebar } from "../../components/Feed/LeftSidebar/LeftSidebar";
import { FeedContent } from "../../components/Feed/FeedContent/FeedContent";
import { RightSidebar } from "../../components/Feed/RightSidebar/RightSidebar";
import { AnimatedBackground } from "../../components/Feed/AnimatedBackground/AnimatedBackground";
import { FiltersSidebar } from "../../components/Feed/FiltersSidebar/FiltersSidebar";
import { PremiumFeatures } from "../../components/Feed/PremiumFeatures/PremiumFeatures";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router";

// CSS for responsive design
const responsiveStyles = `
  @media (max-width: 768px) {
    .desktop-only {
      display: none !important;
    }
  }
  
  @media (min-width: 769px) {
    .mobile-only {
      display: none !important;
    }
  }
`;

const Feed: React.FC = () => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Box
      style={{
        backgroundColor: theme.colors.dark[9],
        minHeight: "100vh",
        position: "relative",
        paddingTop: 90, // Account for fixed header
      }}
    >
      {/* Add responsive CSS */}
      <style>{responsiveStyles}</style>
      
      {/* Animated background for visual appeal */}
      <AnimatedBackground />

      <Container size="xl" px={{ base: 16, sm: 32, md: 32 }} py={40}>
        {!user ? (
          // Unauthenticated view - Show limited feed with login prompt
          <Box>
            <Box
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)",
                borderRadius: theme.radius.md,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: theme.spacing.xl,
                marginBottom: 40,
                textAlign: "center",
              }}
            >
              <Text size="xl" fw={600} c={theme.white} mb="md">
                Join the Conversation
              </Text>
              <Text c="dimmed" mb="xl">
                Sign up or log in to connect with other students, share your experiences, and get personalized content.
              </Text>
              <Group justify="center" gap="md">
                <Button
                  variant="filled"
                  color="blue"
                  size="md"
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  size="md"
                  onClick={() => navigate("/login")}
                >
                  Log In
                </Button>
              </Group>
            </Box>
            
            {/* Three column layout for unauthenticated users */}
            <Grid gutter={{ base: 24, sm: 32, md: 48 }}>
              {/* Left Column - Filters & Search - Hidden on mobile */}
              <Grid.Col span={{ base: 12, md: 3, lg: 3 }} className="desktop-only">
                <FiltersSidebar />
              </Grid.Col>

              {/* Middle Column - Feed Content */}
              <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                <FeedContent loading={loading} />
              </Grid.Col>

              {/* Right Column - Premium Features - Hidden on mobile */}
              <Grid.Col span={{ base: 12, md: 3, lg: 3 }} className="desktop-only">
                <PremiumFeatures />
              </Grid.Col>
            </Grid>
          </Box>
        ) : (
          // Authenticated view - Show full feed with sidebars
          <Grid gutter={{ base: 24, sm: 32, md: 48 }}>
            {/* Left Column - Filters & Search - Hidden on mobile */}
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }} className="desktop-only">
              <FiltersSidebar />
              <Box mt={40}>
                <LeftSidebar user={user} />
              </Box>
            </Grid.Col>

            {/* Middle Column - Feed Content */}
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <FeedContent loading={loading} />
            </Grid.Col>

            {/* Right Column - Premium Features & Network - Hidden on mobile */}
            <Grid.Col span={{ base: 12, md: 3, lg: 3 }} className="desktop-only">
              <PremiumFeatures />
              <Box mt={40}>
                <RightSidebar />
              </Box>
            </Grid.Col>
          </Grid>
        )}

        {/* Mobile Bottom Navigation - Only shown on mobile for authenticated users */}
        {user && (
          <Box
            className="mobile-only"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "12px 0",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              backdropFilter: "blur(10px)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              zIndex: 100,
            }}
          >
            <Stack>
              {/* Mobile navigation will be added here */}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Feed; 