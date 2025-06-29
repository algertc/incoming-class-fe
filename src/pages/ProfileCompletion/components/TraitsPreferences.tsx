import React, { useState } from 'react';
import {
  Group,
  Button,
  Stack,
  Text,
  Paper,
  Box,
  ScrollArea,
  LoadingOverlay,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useUpdateCurrentUserProfile } from '../../../hooks/api';
import { ProfileStage } from '../../../models/user.model';
import { traitsPreferencesSchema, getTraitsPreferencesInitialValues } from '../../../forms';
import { showSuccess, showError } from '../../../utils';
import { useAuthStore } from '../../../store/auth.store';
import ChipGroup from '../../../components/ChipGroup/ChipGroup';
import styles from './TraitsPreferences.module.css';

interface TraitsPreferencesProps {
  onComplete: () => void;
}

const TraitsPreferences: React.FC<TraitsPreferencesProps> = ({ onComplete }) => {
  const { mutateAsync: updateProfile, isPending } = useUpdateCurrentUserProfile();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const form = useForm({
    initialValues: getTraitsPreferencesInitialValues(user),
    validate: yupResolver(traitsPreferencesSchema)
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsSubmitting(true);
      
      const profileData = {
        
          sleepSchedule: values.sleepSchedule,
          cleanliness: values.cleanliness,
          guests: values.guests,
          studying: values.studying,
          substances: values.substances,
          personality: values.personality,
          physicalActivity: values.physicalActivity,
          pastimes: values.pastimes,
          food: values.food,
          other: values.other,
          campusInvolvement: values.campusInvolvement,
          profileStage: ProfileStage.PROFILE_PREVIEW // Move to next stage
      };
      
      console.log("profile data ", profileData);
      
      const response = await updateProfile(profileData);

      if (!response.status) {
        throw new Error(response.errorMessage?.message || 'Failed to update preferences');
      }
      
      showSuccess("Preferences saved successfully!");
      onComplete(); // Move to next step in the UI
    } catch (error) {
      showError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper 
      className={`${styles.container} ${isMobile ? styles.containerMobile : ''}`} 
      p={isMobile ? "md" : "xl"} 
      radius="md"
      style={{
        ...(isMobile && {
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        })
      }}
    >
      <LoadingOverlay visible={isSubmitting || isPending} overlayProps={{ blur: 2 }} />
      <form 
        onSubmit={form.onSubmit(handleSubmit)}
        style={isMobile ? { height: '100%', display: 'flex', flexDirection: 'column' } : {}}
      >
        <Stack gap={isMobile ? "sm" : "md"} style={isMobile ? { flex: 1, overflow: 'hidden' } : {}}>
          <Text c={"white"} className={`${styles.title} ${isMobile ? styles.titleMobile : ''}`} size={isMobile ? "md" : "lg"} fw={600}>
            Tell Us About Your Preferences
          </Text>

          <ScrollArea 
            h={isMobile ? 300 : undefined} 
            type="auto" 
            className={isMobile ? styles.scrollAreaMobile : ''}
            style={isMobile ? { flex: 1 } : {}}
          >
            <Stack gap={isMobile ? "lg" : "xl"}>
              {/* Lifestyle Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600}>
                  Lifestyle
                </Text>
                <Stack gap="md">
                  {/* Sleep Schedule */}
                  <Text size="sm" fw={500} className={styles.label} c="white">
                    Sleep Schedule
                  </Text>
                  <ChipGroup
                    data={[
                      'Early Bird',
                      'Night Owl',
                      'Flexible',
                    ]}
                    multiple={false}
                    value={form.values.sleepSchedule}
                    onChange={(v) => form.setFieldValue('sleepSchedule', v as string)}
                    error={form.errors.sleepSchedule as string}
                  />

                  {/* Cleanliness */}
                  <Text size="sm" fw={500} className={styles.label} c="white">
                    Cleanliness
                  </Text>
                  <ChipGroup
                    data={['Neat Freak', 'Organized', 'Casual', 'Messy']}
                    multiple={false}
                    value={form.values.cleanliness}
                    onChange={(v) => form.setFieldValue('cleanliness', v as string)}
                    error={form.errors.cleanliness as string}
                  />

                  {/* Guests */}
                  <Text size="sm" fw={500} className={styles.label} c="white">
                    Guests
                  </Text>
                  <ChipGroup
                    data={['Over Whenever', 'With Notice', 'Rarely']}
                    multiple={false}
                    value={form.values.guests}
                    onChange={(v) => form.setFieldValue('guests', v as string)}
                    error={form.errors.guests as string}
                  />

                  {/* Studying */}
                  <Text size="sm" fw={500} className={styles.label} c="white">
                    Studying
                  </Text>
                  <ChipGroup
                    data={['Around Campus', 'In Room', 'Library', 'Flexible']}
                    multiple={false}
                    value={form.values.studying}
                    onChange={(v) => form.setFieldValue('studying', v as string)}
                    error={form.errors.studying as string}
                  />

                  {/* Substances */}
                  <Text size="sm" fw={500} className={styles.label} c="white">
                    Substances
                  </Text>
                  <ChipGroup
                    data={[
                      'Fine with Drinking',
                      'Fine with Smoking',
                      'Fine with Both',
                      'No Substances',
                    ]}
                    multiple={false}
                    value={form.values.substances}
                    onChange={(v) => form.setFieldValue('substances', v as string)}
                    error={form.errors.substances as string}
                  />
                </Stack>
              </Box>

              {/* Personality Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600} c="white">
                  Personality
                </Text>
                <Stack gap="xs">
                  <Text size="sm" fw={500} className={styles.label} c="white">Select your personality traits (at least one)</Text>
                  <ChipGroup
                    data={[
                      'Introvert',
                      'Extrovert',
                      'Spontaneous',
                      'Organized',
                      'Creative',
                      'Analytical',
                      'Adventurous',
                      'Cautious',
                    ]}
                    value={form.values.personality}
                    onChange={(value) => form.setFieldValue('personality', value as string[])}
                    error={form.errors.personality as string}
                  />
                </Stack>
              </Box>

              {/* Physical Activity Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600} c="white">
                  Physical Activity
                </Text>
                <Stack gap="xs">
                  <Text size="sm" fw={500} className={styles.label} c="white">Select your physical activities</Text>
                  <ChipGroup
                    data={[
                      'Working Out',
                      'Basketball',
                      'Running',
                      'Yoga',
                      'Swimming',
                      'Tennis',
                      'Soccer',
                      'Other Sports',
                    ]}
                    value={form.values.physicalActivity}
                    onChange={(value) => form.setFieldValue('physicalActivity', value as string[])}
                  />
                </Stack>
              </Box>

              {/* Pastimes Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600} c="white">
                  Pastimes
                </Text>
                <Stack gap="xs">
                  <Text size="sm" fw={500} className={styles.label} c="white">Select your pastimes (at least one)</Text>
                  <ChipGroup
                    data={[
                      'Art',
                      'Fashion',
                      'Stocks',
                      'Thrifting',
                      'Politics',
                      'Video Games',
                      'Reading',
                      'Music',
                      'Movies',
                      'Travel',
                    ]}
                    value={form.values.pastimes}
                    onChange={(value) => form.setFieldValue('pastimes', value as string[])}
                    error={form.errors.pastimes as string}
                  />
                </Stack>
              </Box>

              {/* Food Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600} c="white">
                  Food Preferences
                </Text>
                <Stack gap="xs">
                  <Text size="sm" fw={500} className={styles.label} c="white">Select your food preferences</Text>
                  <ChipGroup
                    data={[
                      'Coffee',
                      'Tea',
                      'Sushi',
                      'Pizza',
                      'Italian',
                      'Mexican',
                      'Chinese',
                      'Indian',
                      'Vegan',
                      'Vegetarian',
                    ]}
                    value={form.values.food}
                    onChange={(value) => form.setFieldValue('food', value as string[])}
                  />
                </Stack>
              </Box>

              {/* Campus Involvement Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600} c="white">
                  Campus Involvement
                </Text>
                <Stack gap="xs">
                  <Text size="sm" fw={500} className={styles.label} c="white">Select your campus involvement</Text>
                  <ChipGroup
                    data={[
                      'Rushing a fraternity/sorority',
                      'Business fraternity',
                    ]}
                    multiple={false}
                    value={form.values.campusInvolvement}
                    onChange={(value) => form.setFieldValue('campusInvolvement', value as string)}
                    error={form.errors.campusInvolvement as string}
                  />
                </Stack>
              </Box>

              {/* Other Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600} c="white">
                  Other
                </Text>
                <Stack gap="xs">
                  <Text size="sm" fw={500} className={styles.label} c="white">Select other preferences</Text>
                  <ChipGroup
                    data={[
                      'Studying Abroad',
                      'Looking for a Roommate',
                      'Early Graduation',
                      'Part-time Job',
                      'Internship',
                    ]}
                    value={form.values.other}
                    onChange={(value) => form.setFieldValue('other', value as string[])}
                  />
                </Stack>
              </Box>
            </Stack>
          </ScrollArea>

          <Group justify="center" mt={isMobile ? "md" : "xl"}>
            <Button
              type="submit"
              size={isMobile ? "md" : "lg"}
              className={styles.nextButton}
              loading={isSubmitting || isPending}
              c="white"
              fullWidth={isMobile}
            >
              Next Step
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default TraitsPreferences; 