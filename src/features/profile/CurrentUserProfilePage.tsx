import React, { useState, lazy, Suspense } from 'react';
import {
  Container,
  Stack,
  Box,
  Skeleton,
  SimpleGrid,
  rem,
} from '@mantine/core';
import { useProfileData, useProfileEditing } from './hooks';

// Lazy load components for code splitting
const ModernProfileHeader = lazy(() => import('./components/ModernProfileHeader'));
const CurrentUserTabNavigation = lazy(() => import('./components/CurrentUserTabNavigation'));
const ProfileOverviewTab = lazy(() => import('./components/ProfileOverviewTab'));
const MyPostsTab = lazy(() => import('./components/MyPostsTab'));

const CurrentUserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Custom hooks for data and editing logic
  const { profileData, setProfileData, user } = useProfileData();
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

  console.log("ptroflifleDapt",profileData);
  
  // Compute derived values from User data
  const fullName = profileData.firstName && profileData.lastName 
    ? `${profileData.firstName} ${profileData.lastName}` 
    : profileData.email;
  const designation = profileData.major 
    ? `${profileData.major} Student` 
    : 'University Student';
  const profileCompletion = profileData.isProfileCompleted ? 100 : 75;

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
            name={fullName}
            designation={designation}
            profilePicture={profileData.profilePicture || ''}
            hometown={profileData.hometown || ''}
            bio={profileData.bio || ''}
            isPremium={profileData.isPremium || false}
            profileCompletion={profileCompletion}
            userId={user?.id || user?._id || ''}
          />
        </Suspense>
        
        {/* Modern Tab Navigation */}
        <Suspense fallback={<Skeleton height={50} radius="xl" mb="md" />}>
          <CurrentUserTabNavigation
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
          <Suspense fallback={
            <Stack gap="md">
              <Skeleton height={200} radius="xl" />
              <Skeleton height={200} radius="xl" />
            </Stack>
          }>
            <MyPostsTab
               
            />
          </Suspense>
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