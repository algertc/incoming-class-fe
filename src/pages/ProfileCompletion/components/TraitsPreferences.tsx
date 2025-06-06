import React, { useState } from 'react';
import {
  Group,
  Button,
  Stack,
  Text,
  Paper,
  Select,
  Box,
  ScrollArea,
  LoadingOverlay,
} from '@mantine/core';
import { useForm, yupResolver } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useUpdateCurrentUserProfile } from '../../../hooks/api';
import { ProfileStage } from '../../../models/user.model';
import { traitsPreferencesSchema, traitsPreferencesInitialValues } from '../../../forms';
import { showSuccess, showError } from '../../../utils';
import ChipGroup from '../../../components/ChipGroup/ChipGroup';
import styles from './TraitsPreferences.module.css';

interface TraitsPreferencesProps {
  onComplete: () => void;
}

const TraitsPreferences: React.FC<TraitsPreferencesProps> = ({ onComplete }) => {
  const { mutateAsync: updateProfile, isPending } = useUpdateCurrentUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const form = useForm({
    initialValues: traitsPreferencesInitialValues,
    validate: yupResolver(traitsPreferencesSchema)
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      setIsSubmitting(true);
      
      const profileData = {
        traits: {
          sleepSchedule: values.sleepSchedule,
          cleanliness: values.cleanliness,
          guests: values.guests,
          studying: values.studying,
          substances: values.substances,
          personality: values.personality,
          physicalActivity: values.physicalActivity,
          pastimes: values.pastimes,
          food: values.food,
          other: values.other
        },
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
                  <Select
                    required
                    label="Sleep Schedule"
                    placeholder="Select your sleep schedule"
                    data={[
                      'Early Bird',
                      'Night Owl',
                      'Flexible',
                    ]}
                    {...form.getInputProps('sleepSchedule')}
                    classNames={{
                      input: styles.input,
                      dropdown: styles.dropdown,
                      label: styles.label,
                      option: styles.item,
                    }}
                    c="white"
                  />

                  <Select
                    required
                    label="Cleanliness"
                    placeholder="Select your cleanliness preference"
                    data={[
                      'Neat Freak',
                      'Organized',
                      'Casual',
                      'Messy',
                    ]}
                    {...form.getInputProps('cleanliness')}
                    classNames={{
                      input: styles.input,
                      dropdown: styles.dropdown,
                      label: styles.label,
                      option: styles.item,
                    }}
                    c="white"
                  />

                  <Select
                    required
                    label="Guests"
                    placeholder="Select your guest preference"
                    data={[
                      'Over Whenever',
                      'With Notice',
                      'Rarely',
                    ]}
                    {...form.getInputProps('guests')}
                    classNames={{
                      input: styles.input,
                      dropdown: styles.dropdown,
                      label: styles.label,
                      option: styles.item,
                    }}
                    c="white"
                  />

                  <Select
                    required
                    label="Studying"
                    placeholder="Select your studying preference"
                    data={[
                      'Around Campus',
                      'In Room',
                      'Library',
                      'Flexible',
                    ]}
                    {...form.getInputProps('studying')}
                    classNames={{
                      input: styles.input,
                      dropdown: styles.dropdown,
                      label: styles.label,
                      option: styles.item,
                    }}
                    c="white"
                  />

                  <Select
                    required
                    label="Substances"
                    placeholder="Select your substance preference"
                    data={[
                      'Fine with Drinking',
                      'Fine with Smoking',
                      'Fine with Both',
                      'No Substances',
                    ]}
                    {...form.getInputProps('substances')}
                    classNames={{
                      input: styles.input,
                      dropdown: styles.dropdown,
                      label: styles.label,
                      option: styles.item,
                    }}
                    c="white"
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
                    onChange={(value) => form.setFieldValue('personality', value)}
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
                    onChange={(value) => form.setFieldValue('physicalActivity', value)}
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
                    onChange={(value) => form.setFieldValue('pastimes', value)}
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
                    onChange={(value) => form.setFieldValue('food', value)}
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
                    onChange={(value) => form.setFieldValue('other', value)}
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