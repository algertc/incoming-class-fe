import React, { useEffect } from 'react';
import {
  Card,
  Group,
  Title,
  Divider,
  Grid,
  Text,
  Badge,
  ActionIcon,
  useMantineTheme,
  Select,
  MultiSelect,
  Button,
  Box,
  ThemeIcon,
} from '@mantine/core';
import { IconUser, IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import { useForm, yupResolver } from '@mantine/form';
import * as yup from 'yup';

const traitsSchema = yup.object().shape({
  sleepSchedule: yup.string().required('Sleep schedule is required'),
  cleanliness: yup.string().required('Cleanliness preference is required'),
  guests: yup.string().required('Guests preference is required'),
  studying: yup.string().required('Studying preference is required'),
  substances: yup.string().required('Substances preference is required'),
  personality: yup.array().of(yup.string()).min(1, 'Select at least one personality trait'),
});

const sleepOptions = ['Early Bird', 'Night Owl', 'Flexible'];
const cleanlinessOptions = ['Very Clean', 'Average', 'Relaxed'];
const guestOptions = ['Over Whenever', 'With Notice', 'Rarely'];
const studyingOptions = ['Around Campus', 'In Room', 'Library', 'Flexible'];
const substanceOptions = ['Fine with Drinking', 'Fine with Smoking', 'Fine with Both', 'No Substances'];
const personalityOptions = [
  'Introvert', 'Extrovert', 'Spontaneous', 'Organized',
  'Creative', 'Analytical', 'Adventurous', 'Cautious',
];

interface TraitsPreferencesProps {
  sleepSchedule: string;
  cleanliness: string;
  guests: string;
  studying: string;
  substances: string;
  personality: string[];
  isEditable: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const TraitsPreferences: React.FC<TraitsPreferencesProps> = ({
  sleepSchedule,
  cleanliness,
  guests,
  studying,
  substances,
  personality,
  isEditable,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: {
      sleepSchedule,
      cleanliness,
      guests,
      studying,
      substances,
      personality,
    },
    validate: yupResolver(traitsSchema),
  });

  useEffect(() => {
    form.setValues({
      sleepSchedule,
      cleanliness,
      guests,
      studying,
      substances,
      personality,
    });
  }, [sleepSchedule, cleanliness, guests, studying, substances, personality, isEditing]);

  const handleSave = async () => {
    if (await form.validate()) {
      return;
    }
    await onSave(form.values);
  };
  
  const handleCancel = () => {
    form.reset();
    onCancel();
  }

  const selectStyles = {
    label: { color: 'white', fontWeight: 500 },
    input: {
      backgroundColor: theme.colors.dark[6],
      borderColor: theme.colors.dark[4],
      color: 'white',
      '&:focus': {
        borderColor: theme.colors.indigo[5],
      },
    },
    dropdown: {
      backgroundColor: theme.colors.dark[6],
      borderColor: theme.colors.dark[4],
    },
    item: {
      '&[data-selected]': {
        backgroundColor: theme.colors.indigo[6],
      },
      '&[data-hovered]': {
        backgroundColor: theme.colors.dark[5],
      },
    },
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
      <Group mb="md" justify="space-between">
        <Group>
          <ThemeIcon size="lg" radius="md" color="indigo">
            <IconUser size={20} />
          </ThemeIcon>
          <Title order={4} c="white">Traits & Preferences</Title>
        </Group>
        {isEditable && !isEditing && (
          <ActionIcon
            color="indigo"
            variant="light"
            onClick={onEdit}
          >
            <IconEdit size={18} />
          </ActionIcon>
        )}
        {isEditing && (
          <Group gap="xs">
            <ActionIcon
              color="green"
              variant="light"
              onClick={handleSave}
            >
              <IconCheck size={18} />
            </ActionIcon>
            <ActionIcon
              color="red"
              variant="light"
              onClick={handleCancel}
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>
        )}
      </Group>
      <Divider mb="md" color={theme.colors.dark[5]} />

      {isEditing ? (
        <Box>
          <Grid>
            <Grid.Col span={6}>
              <Select label="Sleep Schedule" data={sleepOptions} {...form.getInputProps('sleepSchedule')} styles={selectStyles} mb="sm" />
              <Select label="Cleanliness" data={cleanlinessOptions} {...form.getInputProps('cleanliness')} styles={selectStyles} mb="sm" />
              <Select label="Guests" data={guestOptions} {...form.getInputProps('guests')} styles={selectStyles} mb="sm" />
            </Grid.Col>
            
            <Grid.Col span={6}>
              <Select label="Studying" data={studyingOptions} {...form.getInputProps('studying')} styles={selectStyles} mb="sm" />
              <Select label="Substances" data={substanceOptions} {...form.getInputProps('substances')} styles={selectStyles} mb="sm" />
            </Grid.Col>
            
            <Grid.Col span={12} mt="md">
              <MultiSelect
                label="Personality Traits"
                data={personalityOptions}
                {...form.getInputProps('personality')}
                placeholder="Select personality traits"
                styles={selectStyles}
                maxValues={5}
              />
            </Grid.Col>
          </Grid>
          
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={handleCancel}>
              Cancel
            </Button>
            <Button color="indigo" onClick={handleSave}>
              Save Changes
            </Button>
          </Group>
        </Box>
      ) : (
        <Grid>
          <Grid.Col span={6}>
            <Text fw={500} size="sm" c="white">Sleep Schedule</Text>
            <Text c="gray.4" mb="sm">{sleepSchedule}</Text>
            
            <Text fw={500} size="sm" c="white">Cleanliness</Text>
            <Text c="gray.4" mb="sm">{cleanliness}</Text>
            
            <Text fw={500} size="sm" c="white">Guests</Text>
            <Text c="gray.4" mb="sm">{guests}</Text>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Text fw={500} size="sm" c="white">Studying</Text>
            <Text c="gray.4" mb="sm">{studying}</Text>
            
            <Text fw={500} size="sm" c="white">Substances</Text>
            <Text c="gray.4" mb="sm">{substances}</Text>
          </Grid.Col>
          
          <Grid.Col span={12} mt="md">
            <Text fw={500} size="sm" c="white" mb="sm">Personality</Text>
            <Group>
              {personality.map((trait) => (
                <Badge key={trait} size="md" color="violet" variant="filled">
                  {trait}
                </Badge>
              ))}
            </Group>
          </Grid.Col>
        </Grid>
      )}
    </Card>
  );
};

export default TraitsPreferences; 