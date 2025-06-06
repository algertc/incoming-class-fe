import React, { lazy, Suspense } from 'react';
import {
  Grid,
  Stack,
  Box,
  useMantineTheme,
  rem,
} from '@mantine/core';
import { glassCardStyles } from '../utils/glassStyles';
import { ProfileComponentSkeleton, ProfileContactSkeleton } from './ProfileSkeleton';
import type { ProfileData } from '../hooks/useProfileData';

// Lazy load components for code splitting
const BioCard = lazy(() => import('./BioCard'));
const AcademicInfo = lazy(() => import('./AcademicInfo'));
const TraitsPreferences = lazy(() => import('./TraitsPreferences'));
const InterestsCard = lazy(() => import('./InterestsCard'));
const ModernContactCard = lazy(() => import('./ModernContactCard'));

interface StudentProfileOverviewTabProps {
  profileData: ProfileData;
  isLoading?: boolean;
}

const StudentProfileOverviewTab: React.FC<StudentProfileOverviewTabProps> = ({
  profileData,
  isLoading = false,
}) => {
  const theme = useMantineTheme();

  // Prepare contact data for the contact card
  const contactData = {
    email: `${profileData.name.toLowerCase().replace(' ', '.')}@university.edu`,
    instagram: profileData.contact.instagram,
    snapchat: profileData.contact.snapchat,
    university: profileData.academic.university,
    batch: profileData.academic.batch,
  };

  if (isLoading) {
    return (
      <Grid gutter="md">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="md">
            <ProfileComponentSkeleton height={120} />
            <ProfileComponentSkeleton height={180} />
            <ProfileComponentSkeleton height={280} />
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <ProfileContactSkeleton />
        </Grid.Col>
      </Grid>
    );
  }

  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack gap="md">
          <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
            <Suspense fallback={<ProfileComponentSkeleton height={120} />}>
              <BioCard 
                bio={profileData.bio}
                isEditable={false}
              />
            </Suspense>
          </Box>
          
          <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
            <Suspense fallback={<ProfileComponentSkeleton height={180} />}>
              <AcademicInfo 
                major={profileData.academic.major}
                university={profileData.academic.university}
                batch={profileData.academic.batch}
                hometown={profileData.location.hometown}
                lookingForRoommate={profileData.lookingForRoommate}
                isEditable={false}
              />
            </Suspense>
          </Box>
          
          <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
            <Suspense fallback={<ProfileComponentSkeleton height={280} />}>
              <TraitsPreferences 
                sleepSchedule={profileData.traits.sleepSchedule}
                cleanliness={profileData.traits.cleanliness}
                guests={profileData.traits.guests}
                studying={profileData.traits.studying}
                substances={profileData.traits.substances}
                personality={profileData.personality}
                isEditable={false}
              />
            </Suspense>
          </Box>
        </Stack>
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack gap="md">
          <Suspense fallback={<ProfileComponentSkeleton height={150} />}>
            <ModernContactCard 
              contactData={contactData} 
              isEditable={false}
            />
          </Suspense>
          <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
            <Suspense fallback={<ProfileComponentSkeleton height={200} />}>
              <InterestsCard 
                physicalActivity={profileData.physicalActivity}
                pastimes={profileData.pastimes}
                food={profileData.food}
                isEditable={false}
              />
            </Suspense>
          </Box>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default StudentProfileOverviewTab; 