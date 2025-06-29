import React, { Suspense } from 'react';
import {
  Grid,
  Stack,
  Box,
  useMantineTheme,
  rem,
} from '@mantine/core';
import { glassCardStyles } from '../utils/glassStyles';
import { ProfileComponentSkeleton, ProfileContactSkeleton } from './ProfileSkeleton';
import type { User } from '../../../models/user.model';

// Import components directly to avoid lazy loading cache issues
import BioCard from './BioCard';
import AcademicInfo from './AcademicInfo';
import TraitsPreferences from './TraitsPreferences';
import InterestsCard from './InterestsCard';
import ModernContactCard from './ModernContactCard';

interface StudentProfileOverviewTabProps {
  profileData: User;
  isLoading?: boolean;
}

const StudentProfileOverviewTab: React.FC<StudentProfileOverviewTabProps> = ({
  profileData,
  isLoading = false
}) => {
  const theme = useMantineTheme();

  // Prepare contact data for the contact card
  const contactData = {
    // email: profileData.email || 'email@university.edu',
    instagram: profileData.instagram || '@username',
    snapchat: profileData.snapchat || '@username',
    university: profileData.university || 'University',
    batch: profileData.collegeGraduationYear || 'Not specified',
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
            <BioCard 
              bio={profileData.bio || 'This student has not added a bio yet.'}
              isEditable={false}
            />
          </Box>
          
          <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
            <AcademicInfo 
              major={profileData.major || 'Not specified'}
              university={profileData.university || 'University'}
              batch={profileData.collegeGraduationYear || 'Not specified'}
              hometown={profileData.hometown || 'Not specified'}
              lookingForRoommate={false} // This field doesn't exist in User interface
              isEditable={false}
            />
          </Box>
          
          <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
            <TraitsPreferences 
              sleepSchedule={profileData.sleepSchedule || 'Not specified'}
              cleanliness={profileData.cleanliness || 'Not specified'}
              guests={profileData.guests || 'Not specified'}
              studying="Library" // This field doesn't exist in User interface
              substances={profileData.substances || 'Not specified'}
              personality={profileData.personality || []}
              isEditable={false}
            />
          </Box>
        </Stack>
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack gap="md">
          <ModernContactCard 
            contactData={contactData} 
            isEditable={false}
          />
          <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
            <InterestsCard 
              physicalActivity={profileData.physicalActivity || []}
              pastimes={profileData.pastimes || []}
              food={profileData.food || []}
              isEditable={false}
            />
          </Box>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default StudentProfileOverviewTab; 