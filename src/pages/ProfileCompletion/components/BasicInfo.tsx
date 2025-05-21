import React, { useState } from 'react';
import {
  TextInput,
  Select,
  Textarea,
  Checkbox,
  Group,
  Button,
  Stack,
  Text,
  rem,
  useMantineTheme,
  Paper,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrandInstagram, IconBrandSnapchat } from '@tabler/icons-react';
import styles from './BasicInfo.module.css';

interface BasicInfoProps {
  onComplete: () => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ onComplete }) => {
  const theme = useMantineTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      instagram: '',
      snapchat: '',
      major: '',
      hometown: '',
      bio: '',
      lookingForRoommate: false,
    },
    validate: {
      instagram: (value) => (!value ? 'Instagram handle is required' : null),
      major: (value) => (!value ? 'Major is required' : null),
      hometown: (value) => (!value ? 'Hometown is required' : null),
      bio: (value) => {
        if (!value) return 'Bio is required';
        if (value.length < 20) return 'Bio must be at least 20 characters';
        return null;
      },
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
            Tell Us About Yourself
          </Text>

          <TextInput
            required
            label="Instagram Handle"
            placeholder="@username"
            leftSection={<IconBrandInstagram style={{ width: rem(16), height: rem(16) }} />}
            {...form.getInputProps('instagram')}
            classNames={{
              label: styles.label,
              input: styles.input,
            }}
          />

          <TextInput
            label="Snapchat Handle"
            placeholder="@username"
            leftSection={<IconBrandSnapchat style={{ width: rem(16), height: rem(16) }} />}
            {...form.getInputProps('snapchat')}
            classNames={{
              label: styles.label,
              input: styles.input,
            }}
          />

          <Select
            required
            label="Major"
            placeholder="Select your major"
            data={[
              'Computer Science',
              'Business',
              'Engineering',
              'Psychology',
              'Biology',
              'Other',
            ]}
            {...form.getInputProps('major')}
            classNames={{
              label: styles.label,
              input: styles.input,
              dropdown: styles.dropdown,
              option: styles.item,
            }}
          />

          <Select
            required
            label="Hometown"
            placeholder="Select your state"
            searchable
            data={[
              'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
              'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
              'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
              'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
              'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
              'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
              'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
              'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
              'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
              'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
            ]}
            {...form.getInputProps('hometown')}
            classNames={{
              label: styles.label,
              input: styles.input,
              dropdown: styles.dropdown,
              option: styles.item,
            }}
          />

          <Textarea
            required
            label="Short Bio"
            placeholder="Tell us about yourself..."
            minRows={4}
            {...form.getInputProps('bio')}
            classNames={{
              label: styles.label,
              input: styles.input,
            }}
          />

          <Checkbox
            label="Looking for a roommate"
            {...form.getInputProps('lookingForRoommate', { type: 'checkbox' })}
            classNames={{
              label: styles.label,
              input: styles.input,
            }}
          />

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

export default BasicInfo; 