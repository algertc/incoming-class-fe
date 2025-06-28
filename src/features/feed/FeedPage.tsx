import React, { useState, useEffect } from "react";
import { Box, Container, Grid } from "@mantine/core";
import { useAuthStore } from "../../store/auth.store";
import { useSearchParams } from "react-router";
import { PremiumFeatures } from "../../components/Feed/PremiumFeatures/PremiumFeatures";
import AnimatedBackground from "./components/AnimatedBackground";
import FeedContent from "./components/FeedContent";
import { MobileSearchBar } from "./components/MobileSearchBar";
import FiltersModal from "../../components/common/FiltersModal";
import CollegeFeedModal from "./components/CollegeFeedModal";
import { useFeedStore } from "../../store/feed.store";
import { PremiumSubscriptionModal } from "../../components/common/PremiumSubscriptionModal";

// Optimized CSS for responsive design and iOS Safari
const responsiveStyles = `
  @media (max-width: 768px) {
    .desktop-only {
      display: none !important;
    }
    
    
  }
  
  @media (min-width: 769px) {
    /* search bar should show on desktop too, so keeping mobile-only unused */
  }
  
  .ios-optimized {
   
  }
`;

const FeedPage: React.FC = () => {
  const { user } = useAuthStore();
  console.log("log auth state", user);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersModalOpen, setIsFiltersModalOpen] = useState(false);
  const [collegeFeedModalOpen, setCollegeFeedModalOpen] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const { filters, setCollegeFromHero, refreshFeed } = useFeedStore();

  // Centralized state for the premium modal
  const [premiumModalOpened, setPremiumModalOpened] = useState(false);
  const [premiumModalTrigger, setPremiumModalTrigger] = useState<string>("filters");

  const handleOpenPremiumModal = (trigger: string) => {
    setIsFiltersModalOpen(false); // Close other modals
    setPremiumModalTrigger(trigger);
    setPremiumModalOpened(true);
  };

  // A college must be selected for guest or non-premium users
  const isGuestOrNonPremium = !user || !user.isSubscribed;
  const hasNoCollegeFilter = !filters.college || filters.college === 'all';
  const needsCollegeSelection = isGuestOrNonPremium && hasNoCollegeFilter;

  // This effect enforces the college selection rule
  useEffect(() => {
    if (needsCollegeSelection) {
      // Close any other modals before showing the college selection one
      if (isFiltersModalOpen) {
        setIsFiltersModalOpen(false);
      }
      setCollegeFeedModalOpen(true);
    }
  }, [needsCollegeSelection, isFiltersModalOpen]);

  // Refresh feed when user authentication state changes
  useEffect(() => {
    // Only refresh if user ID actually changed (login/logout)
    const currentUserId = user?.id;
    console.log('FeedPage: User ID changed, refreshing feed. User ID:', currentUserId);
    refreshFeed();
  }, [user?.id, refreshFeed]); // Only depend on user ID change

  // Check if user came from hero section college select
  useEffect(() => {
    const collegeId = searchParams.get('collegeId');
    const collegeName = searchParams.get('collegeName');
    const from = searchParams.get('from');
    
    if (collegeId && collegeName && from === 'hero') {
      setSelectedCollege(collegeName);
      setCollegeFeedModalOpen(true);
      
      // Apply the college filter using the college ID directly
      setCollegeFromHero(collegeId);
      console.log('Applied college filter for:', collegeName, 'with ID:', collegeId);
      
      // Clean up URL parameters after showing modal
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('collegeId');
      newSearchParams.delete('collegeName');
      newSearchParams.delete('from');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, setCollegeFromHero]);

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
        {/* Search bar & toggle always visible */}
        <Box mb="md">
          <MobileSearchBar onFiltersClick={() => setIsFiltersModalOpen(true)} />
        </Box>

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: shouldShowPremiumFeatures ? 9 : 12 }}>
            <FeedContent />
          </Grid.Col>

          {shouldShowPremiumFeatures && (
            <Grid.Col span={{ base: 12, md: 3 }} className="desktop-only">
              <PremiumFeatures />
            </Grid.Col>
          )}
        </Grid>
      </Container>

      <FiltersModal
        open={isFiltersModalOpen}
        onClose={() => setIsFiltersModalOpen(false)}
        onPremiumRequest={handleOpenPremiumModal}
      />
      
      {/* College Feed Modal */}
      <CollegeFeedModal
        opened={collegeFeedModalOpen}
        onClose={() => {
          setCollegeFeedModalOpen(false)
         
        }}
        collegeName={selectedCollege}
        mode={needsCollegeSelection ? 'selection' : 'welcome'}
      />

      {/* Centralized Premium Modal */}
      <PremiumSubscriptionModal
        opened={premiumModalOpened}
        onClose={() => setPremiumModalOpened(false)}
        trigger={premiumModalTrigger}
      />
    </Box>
  );
};

export default FeedPage;