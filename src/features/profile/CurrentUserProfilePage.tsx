import React, { useState, lazy, Suspense } from 'react';
import {
  Container,
  Stack,
  useMantineTheme,
  Box,
  Skeleton,
  SimpleGrid,
  rem,
} from '@mantine/core';
import { useProfileData, useProfileEditing } from './hooks';
import { glassCardStyles } from './utils/glassStyles';

// Lazy load components for code splitting
const ModernProfileHeader = lazy(() => import('./components/ModernProfileHeader'));
const ModernTabNavigation = lazy(() => import('./components/ModernTabNavigation'));
const ProfileOverviewTab = lazy(() => import('./components/ProfileOverviewTab'));
const PostsTab = lazy(() => import('./components/PostsTab'));

const CurrentUserProfilePage: React.FC = () => {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Custom hooks for data and editing logic
  const { profileData, setProfileData, userPosts, isLoading, user } = useProfileData();
  const {
    editStates,
    setEditStates,
    loadingStates,
    toggleEditState,
    handleSaveBio,
    handleSaveAcademic,
    handleSaveTraits,
    handleSaveInterests,
    handleSaveContact,
  } = useProfileEditing(profileData, setProfileData);

  // Loading skeleton for initial page load
  if (!profileData) {
    return (
      <Box 
        style={{ 
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100vh',
          padding: rem(16),
        }}
      >
        <Container size="lg" py="md">
          <Stack gap="sm">
            <Skeleton height={180} radius="xl" />
            <SimpleGrid cols={3} spacing="xs">
              <Skeleton height={100} radius="xl" />
              <Skeleton height={100} radius="xl" />
              <Skeleton height={100} radius="xl" />
            </SimpleGrid>
            <Skeleton height={200} radius="xl" />
          </Stack>
        </Container>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box 
        style={{ 
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '100vh',
          padding: rem(16),
        }}
      >
        <Container size="lg" py="md">
          <Stack gap="sm">
            <Skeleton height={180} radius="xl" />
            <SimpleGrid cols={3} spacing="xs">
              <Skeleton height={100} radius="xl" />
              <Skeleton height={100} radius="xl" />
              <Skeleton height={100} radius="xl" />
            </SimpleGrid>
            <Skeleton height={200} radius="xl" />
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box 
      style={{ 
        background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        minHeight: '100vh',
        padding: rem(16),
        position: 'relative',
      }}
    >
      <Container size="lg" py="md">
        {/* Modern Profile Header */}
        <Suspense fallback={<Skeleton height={180} radius="xl" mb="md" />}>
          <ModernProfileHeader
            name={profileData.name}
            designation={profileData.designation}
            profilePicture={profileData.profilePicture}
            hometown={profileData.location.hometown}
            bio={profileData.bio}
            isPremium={profileData.isPremium}
            profileCompletion={profileData.profileCompletion}
            userId={user?.id}
          />
        </Suspense>
        
        {/* Modern Tab Navigation */}
        <Suspense fallback={<Skeleton height={50} radius="xl" mb="md" />}>
          <ModernTabNavigation
            activeTab={activeTab}
            onTabChange={(value) => setActiveTab(value as string)}
          />
        </Suspense>
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
          <Suspense fallback={
            <Stack gap="md">
              <Skeleton height={200} radius="xl" />
              <Skeleton height={200} radius="xl" />
            </Stack>
          }>
            <ProfileOverviewTab
              profileData={profileData}
              user={user}
              editStates={editStates}
              loadingStates={loadingStates}
              setEditStates={setEditStates}
              toggleEditState={toggleEditState}
              handleSaveBio={handleSaveBio}
              handleSaveAcademic={handleSaveAcademic}
              handleSaveTraits={handleSaveTraits}
              handleSaveInterests={handleSaveInterests}
              handleSaveContact={handleSaveContact}
            />
          </Suspense>
        )}
        
        {activeTab === 'posts' && (
          <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
            <Suspense fallback={<Skeleton height={300} radius="md" />}>
              <PostsTab
                posts={userPosts}
                isLoading={isLoading}
                isCurrentUser={true}
              />
            </Suspense>
          </Box>
        )}
      </Container>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default CurrentUserProfilePage; 