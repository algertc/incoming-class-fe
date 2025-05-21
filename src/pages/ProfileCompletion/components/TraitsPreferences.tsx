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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import ChipGroup from '../../../components/ChipGroup/ChipGroup';
import styles from './TraitsPreferences.module.css';

interface TraitsPreferencesProps {
  onComplete: () => void;
}

const TraitsPreferences: React.FC<TraitsPreferencesProps> = ({ onComplete }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      sleepSchedule: '',
      cleanliness: '',
      guests: '',
      studying: '',
      substances: '',
      personality: [] as string[],
      physicalActivity: [] as string[],
      pastimes: [] as string[],
      food: [] as string[],
      other: [] as string[],
    },
    validate: {
      sleepSchedule: (value) => (!value ? 'Sleep schedule is required' : null),
      cleanliness: (value) => (!value ? 'Cleanliness preference is required' : null),
      guests: (value) => (!value ? 'Guest preference is required' : null),
      studying: (value) => (!value ? 'Studying preference is required' : null),
      substances: (value) => (!value ? 'Substance preference is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    try {
      // TODO: Save to backend
      console.log(values);
      onComplete();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper className={styles.container} p="xl" radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text className={styles.title} size="lg" fw={600}>
            Tell Us About Your Preferences
          </Text>

          <ScrollArea h={400} type="auto">
            <Stack gap="xl">
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
                      option: styles.item,
                    }}
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
                      option: styles.item,
                    }}
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
                      option: styles.item,
                    }}
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
                      option: styles.item,
                    }}
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
                      option: styles.item,
                    }}
                  />
                </Stack>
              </Box>

              {/* Personality Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600}>
                  Personality
                </Text>
                <Stack gap="xs">
                  
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
                  />
                </Stack>
              </Box>

              {/* Physical Activity Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600}>
                  Physical Activity
                </Text>
                <Stack gap="xs">
                 
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
                <Text className={styles.sectionTitle} fw={600}>
                  Pastimes
                </Text>
                <Stack gap="xs">
                
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
                  />
                </Stack>
              </Box>

              {/* Food Section */}
              <Box>
                <Text className={styles.sectionTitle} fw={600}>
                  Food Preferences
                </Text>
                <Stack gap="xs">
                
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
                <Text className={styles.sectionTitle} fw={600}>
                  Other
                </Text>
                <Stack gap="xs">
                  <Text size="sm" fw={500}>Select other preferences</Text>
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

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              size="lg"
              loading={isSubmitting}
              className={styles.nextButton}
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