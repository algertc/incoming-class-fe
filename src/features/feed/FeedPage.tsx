import React, { useState } from "react";
import { Box, Container, Grid, Button, Text, Group } from "@mantine/core";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router";
import { FiltersSidebar } from "../../components/Feed/FiltersSidebar/FiltersSidebar";
import { PremiumFeatures } from "../../components/Feed/PremiumFeatures/PremiumFeatures";
import AnimatedBackground from "./components/AnimatedBackground";
import FeedContent from "./components/FeedContent";
import { MobileSearchBar } from "./components/MobileSearchBar";
import FiltersModal from "../../components/common/FiltersModal";

// Optimized CSS for responsive design and iOS Safari
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
  
  .ios-optimized {
   
  }
`;

const FeedPage: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);

  // Show premium features if user is not logged in OR if user is logged in but not subscribed
  const shouldShowPremiumFeatures = !user || !user.isSubscribed;

  return (
    <Box
      className="ios-optimized"
      style={{
        backgroundColor: "#101720",
        minHeight: "100vh",
        position: "relative",
        WebkitOverflowScrolling: 'touch' // Enable momentum scrolling on iOS
      }}
    >
      <style>{responsiveStyles}</style>
      
      <AnimatedBackground />

      <Container size="xl" px={{ base: 16, sm: 32, md: 32 }} py={{ base: 20, sm: 30, md: 40 }}>
        {!user ? (
          <Box>
            <Box
              className="ios-optimized"
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(5px)", // Reduced blur for better performance
                WebkitBackdropFilter: "blur(5px)", // iOS support
                borderRadius: "8px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: "24px",
                marginBottom: 32,
                textAlign: "center"
              }}
            >
              <Text size="xl" fw={600} c="white" mb="md">
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
                  className="ios-optimized"
                >
                  Sign Up
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  size="md"
                  onClick={() => navigate("/login")}
                  className="ios-optimized"
                >
                  Log In
                </Button>
              </Group>
            </Box>
            
            <Box className="mobile-only mobile-optimized">
              <MobileSearchBar onFiltersClick={() => setIsFiltersModalOpen(true)} />
            </Box>
            
            <Grid gutter="xl">
              <Grid.Col span={{ base: 12, md: 3 }} className="desktop-only">
                <FiltersSidebar />
              </Grid.Col>
              
              <Grid.Col span={{ base: 12, md: shouldShowPremiumFeatures ? 6 : 9 }}>
                <FeedContent />
              </Grid.Col>
              
              {shouldShowPremiumFeatures && (
                <Grid.Col span={{ base: 12, md: 3 }} className="desktop-only">
                  <PremiumFeatures />
                </Grid.Col>
              )}
            </Grid>
          </Box>
        ) : (
          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 3 }} className="desktop-only">
              <FiltersSidebar />
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: shouldShowPremiumFeatures ? 6 : 9 }}>
              <Box className="mobile-only mobile-optimized">
                <MobileSearchBar onFiltersClick={() => setIsFiltersModalOpen(true)} />
              </Box>
              <FeedContent />
            </Grid.Col>
            
            {shouldShowPremiumFeatures && (
              <Grid.Col span={{ base: 12, md: 3 }} className="desktop-only">
                <PremiumFeatures />
              </Grid.Col>
            )}
          </Grid>
        )}
      </Container>

      <FiltersModal
            open={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
      />
    </Box>
  );
};

export default FeedPage;