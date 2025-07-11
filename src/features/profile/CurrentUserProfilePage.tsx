import React, { useState } from 'react';
import {
  Container,
  Stack,
  Box,
  Skeleton,
  SimpleGrid,
  rem,
} from '@mantine/core';
import { useProfileData, useProfileEditing } from './hooks';


import ModernProfileHeader from './components/ModernProfileHeader';
import CurrentUserTabNavigation from './components/CurrentUserTabNavigation';
import ProfileOverviewTab from './components/ProfileOverviewTab';
import MyPostsTab from './components/MyPostsTab';

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

 

  // Compute derived values from User data
  const fullName = profileData.firstName && profileData.lastName 
    ? `${profileData.firstName} ${profileData.lastName}` 
    : profileData.email;
  const designation = profileData.major 
    ? `${profileData.major} Student` 
    : 'University Student';

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
          <ModernProfileHeader
            name={fullName}
            designation={designation}
            profilePicture={profileData.profilePicture || ''}
            hometown={profileData.hometown || ''}
            bio={profileData.bio || ''}
            isPremium={profileData.isPremium || false}
            isEditable={true}
          />
        
        {/* Modern Tab Navigation */}
          <CurrentUserTabNavigation
            activeTab={activeTab}
            onTabChange={(value) => setActiveTab(value as string)}
          />
        
        {/* Tab Content */}
        {activeTab === 'overview' && (
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
        )}
        
        {activeTab === 'posts' && (
            <MyPostsTab />
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