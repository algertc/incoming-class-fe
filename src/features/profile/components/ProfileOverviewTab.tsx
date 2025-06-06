import React from 'react';
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
import type { User } from '../../../models/user.model';
import type { 
  AcademicData, 
  TraitsData, 
  InterestsData, 
  ContactData 
} from '../hooks/useProfileEditing';

// Lazy load components for code splitting
import { lazy, Suspense } from 'react';

const BioCard = lazy(() => import('./BioCard'));
const AcademicInfo = lazy(() => import('./AcademicInfo'));
const TraitsPreferences = lazy(() => import('./TraitsPreferences'));
const InterestsCard = lazy(() => import('./InterestsCard'));
const ModernContactCard = lazy(() => import('./ModernContactCard'));

interface ProfileOverviewTabProps {
  profileData: ProfileData;
  user: User | null;
  editStates: {
    bio: boolean;
    academic: boolean;
    traits: boolean;
    interests: boolean;
    contact: boolean;
  };
  loadingStates: {
    bio: boolean;
    academic: boolean;
    traits: boolean;
    interests: boolean;
    contact: boolean;
  };
  setEditStates: React.Dispatch<React.SetStateAction<{
    bio: boolean;
    academic: boolean;
    traits: boolean;
    interests: boolean;
    contact: boolean;
  }>>;
  toggleEditState: (section: 'bio' | 'academic' | 'traits' | 'interests' | 'contact') => void;
  handleSaveBio: (newBio: string) => Promise<void>;
  handleSaveAcademic: (academicData: AcademicData) => Promise<void>;
  handleSaveTraits: (traitsData: TraitsData) => Promise<void>;
  handleSaveInterests: (interestsData: InterestsData) => Promise<void>;
  handleSaveContact: (contactData: ContactData) => Promise<void>;
}

const ProfileOverviewTab: React.FC<ProfileOverviewTabProps> = ({
  profileData,
  user,
  editStates,
  loadingStates,
  setEditStates,
  toggleEditState,
  handleSaveBio,
  handleSaveAcademic,
  handleSaveTraits,
  handleSaveInterests,
  handleSaveContact,
}) => {
  const theme = useMantineTheme();

  // Prepare contact data for the contact card
  const contactData = {
    email: user?.email || 'email@university.edu',
    instagram: profileData.contact.instagram,
    snapchat: profileData.contact.snapchat,
    university: profileData.academic.university,
    batch: profileData.academic.batch,
  };

  return (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack gap="md">
          {loadingStates.bio ? (
            <ProfileComponentSkeleton height={120} />
          ) : (
            <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
              <Suspense fallback={<ProfileComponentSkeleton height={120} />}>
                <BioCard 
                  bio={profileData.bio}
                  isEditable={true}
                  isEditing={editStates.bio}
                  onEdit={() => toggleEditState('bio')}
                  onSave={handleSaveBio}
                  onCancel={() => setEditStates(prev => ({ ...prev, bio: false }))}
                />
              </Suspense>
            </Box>
          )}
          
          {loadingStates.academic ? (
            <ProfileComponentSkeleton height={180} />
          ) : (
            <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
              <Suspense fallback={<ProfileComponentSkeleton height={180} />}>
                <AcademicInfo 
                  major={profileData.academic.major}
                  university={profileData.academic.university}
                  batch={profileData.academic.batch}
                  hometown={profileData.location.hometown}
                  lookingForRoommate={profileData.lookingForRoommate}
                  isEditable={true}
                  isEditing={editStates.academic}
                  onEdit={() => toggleEditState('academic')}
                  onSave={handleSaveAcademic}
                  onCancel={() => setEditStates(prev => ({ ...prev, academic: false }))}
                />
              </Suspense>
            </Box>
          )}
          
          {loadingStates.traits ? (
            <ProfileComponentSkeleton height={280} />
          ) : (
            <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
              <Suspense fallback={<ProfileComponentSkeleton height={280} />}>
                <TraitsPreferences 
                  sleepSchedule={profileData.traits.sleepSchedule}
                  cleanliness={profileData.traits.cleanliness}
                  guests={profileData.traits.guests}
                  studying={profileData.traits.studying}
                  substances={profileData.traits.substances}
                  personality={profileData.personality}
                  isEditable={true}
                  isEditing={editStates.traits}
                  onEdit={() => toggleEditState('traits')}
                  onSave={handleSaveTraits}
                  onCancel={() => setEditStates(prev => ({ ...prev, traits: false }))}
                />
              </Suspense>
            </Box>
          )}
        </Stack>
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, md: 4 }}>
        {loadingStates.contact || loadingStates.interests ? (
          <ProfileContactSkeleton />
        ) : (
          <Stack gap="md">
            <Suspense fallback={<ProfileComponentSkeleton height={150} />}>
              <ModernContactCard 
                contactData={contactData} 
                isEditable={true}
                isEditing={editStates.contact}
                onEdit={() => toggleEditState('contact')}
                onSave={handleSaveContact}
                onCancel={() => setEditStates(prev => ({ ...prev, contact: false }))}
              />
            </Suspense>
            <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
              <Suspense fallback={<ProfileComponentSkeleton height={200} />}>
                <InterestsCard 
                  physicalActivity={profileData.physicalActivity}
                  pastimes={profileData.pastimes}
                  food={profileData.food}
                  isEditable={true}
                  isEditing={editStates.interests}
                  onEdit={() => toggleEditState('interests')}
                  onSave={handleSaveInterests}
                  onCancel={() => setEditStates(prev => ({ ...prev, interests: false }))}
                />
              </Suspense>
            </Box>
          </Stack>
        )}
      </Grid.Col>
    </Grid>
  );
};

export default ProfileOverviewTab; 