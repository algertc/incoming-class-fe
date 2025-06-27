import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Button, Text, Group } from "@mantine/core";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate, useSearchParams } from "react-router";
import { FiltersSidebar } from "../../components/Feed/FiltersSidebar/FiltersSidebar";
import { PremiumFeatures } from "../../components/Feed/PremiumFeatures/PremiumFeatures";
import AnimatedBackground from "./components/AnimatedBackground";
import FeedContent from "./components/FeedContent";
import { MobileSearchBar } from "./components/MobileSearchBar";
import FiltersModal from "../../components/common/FiltersModal";
import CollegeFeedModal from "./components/CollegeFeedModal";
import { useFeedStore } from "../../store/feed.store";
import { useCollegeSearch } from "../../hooks/api/useColleges";

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
  console.log("log auth state", user);
  
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [collegeFeedModalOpen, setCollegeFeedModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const { setCollegeFromHero, refreshFeed } = useFeedStore();

  // State for college search to find college ID by name
  const [collegeSearchQuery, setCollegeSearchQuery] = useState<string>("");
  const { data: collegeData } = useCollegeSearch({
    search: collegeSearchQuery,
    limit: 10,
    page: 1,
  });

  // Refresh feed when user authentication state changes
  useEffect(() => {
    // Only refresh if user ID actually changed (login/logout)
    const currentUserId = user?.id;
    console.log('FeedPage: User ID changed, refreshing feed. User ID:', currentUserId);
    refreshFeed();
  }, [user?.id, refreshFeed]); // Only depend on user ID change

  // Check if user came from hero section college select
  useEffect(() => {
    const college = searchParams.get('college');
    const from = searchParams.get('from');
    
    if (college && from === 'hero') {
      setSelectedCollege(college);
      setCollegeFeedModalOpen(true);
      
      // Search for the college to get its ID for filtering
      setCollegeSearchQuery(college);
      
      // Clean up URL parameters after showing modal
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('college');
      newSearchParams.delete('from');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Apply college filter when college data is loaded
  useEffect(() => {
    if (selectedCollege && collegeData?.data?.colleges) {
      // Find the college by name (case-insensitive)
      const foundCollege = collegeData.data.colleges.find(
        (college) => college.name.toLowerCase() === selectedCollege.toLowerCase()
      );
      
      if (foundCollege) {
        // Apply the college filter using the college ID
        setCollegeFromHero(foundCollege._id);
        console.log('Applied college filter for:', foundCollege.name, 'with ID:', foundCollege._id);
      }
    }
  }, [selectedCollege, collegeData, setCollegeFromHero]);

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
      
      {/* College Feed Modal */}
      <CollegeFeedModal
        opened={collegeFeedModalOpen}
        onClose={() => {
          setCollegeFeedModalOpen(false)
         
        }}
        collegeName={selectedCollege}
      />
    </Box>
  );
};

export default FeedPage;