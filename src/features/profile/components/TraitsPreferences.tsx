import React, { useState, useEffect } from 'react';
import {
  Card,
  Group,
  ThemeIcon,
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
  Box
} from '@mantine/core';
import { IconUser, IconEdit, IconCheck, IconX } from '@tabler/icons-react';

interface TraitsPreferencesProps {
  sleepSchedule: string;
  cleanliness: string;
  guests: string;
  studying: string;
  substances: string;
  personality: string[];
  isEditable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (data: {
    traits: {
      sleepSchedule: string;
      cleanliness: string;
      guests: string;
      studying: string;
      substances: string;
    };
    personality: string[];
  }) => void;
  onCancel?: () => void;
}

const TraitsPreferences: React.FC<TraitsPreferencesProps> = ({
  sleepSchedule,
  cleanliness,
  guests,
  studying,
  substances,
  personality,
  isEditable = false,
  isEditing = false,
  onEdit = () => console.log('Edit traits'),
  onSave,
  onCancel = () => console.log('Cancel edit')
}) => {
  const theme = useMantineTheme();
  const [editedData, setEditedData] = useState({
    sleepSchedule,
    cleanliness,
    guests,
    studying,
    substances,
    personality
  });

  useEffect(() => {
    setEditedData({
      sleepSchedule,
      cleanliness,
      guests,
      studying,
      substances,
      personality
    });
  }, [sleepSchedule, cleanliness, guests, studying, substances, personality]);

  const handleSave = () => {
    if (onSave) {
      onSave({
        traits: {
          sleepSchedule: editedData.sleepSchedule,
          cleanliness: editedData.cleanliness,
          guests: editedData.guests,
          studying: editedData.studying,
          substances: editedData.substances
        },
        personality: editedData.personality
      });
    }
  };

  const handleCancel = () => {
    setEditedData({
      sleepSchedule,
      cleanliness,
      guests,
      studying,
      substances,
      personality
    });
    onCancel();
  };

  // Options for dropdowns
  const sleepOptions = [
    { value: 'Early Bird', label: 'Early Bird' },
    { value: 'Night Owl', label: 'Night Owl' },
    { value: 'Flexible', label: 'Flexible' }
  ];

  const cleanlinessOptions = [
    { value: 'Very Clean', label: 'Very Clean' },
    { value: 'Organized', label: 'Organized' },
    { value: 'Casual', label: 'Casual' }
  ];

  const guestOptions = [
    { value: 'Frequent Guests', label: 'Frequent Guests' },
    { value: 'With Notice', label: 'With Notice' },
    { value: 'Rarely', label: 'Rarely' },
    { value: 'Never', label: 'Never' }
  ];

  const studyingOptions = [
    { value: 'Library', label: 'Library' },
    { value: 'Room', label: 'Room' },
    { value: 'Common Area', label: 'Common Area' },
    { value: 'Cafe', label: 'Cafe' }
  ];

  const substanceOptions = [
    { value: 'No Substances', label: 'No Substances' },
    { value: 'Occasional', label: 'Occasional' },
    { value: 'Social Only', label: 'Social Only' }
  ];

  const personalityOptions = [
    { value: 'Extrovert', label: 'Extrovert' },
    { value: 'Introvert', label: 'Introvert' },
    { value: 'Creative', label: 'Creative' },
    { value: 'Analytical', label: 'Analytical' },
    { value: 'Adventurous', label: 'Adventurous' },
    { value: 'Calm', label: 'Calm' },
    { value: 'Organized', label: 'Organized' },
    { value: 'Spontaneous', label: 'Spontaneous' },
    { value: 'Social', label: 'Social' },
    { value: 'Independent', label: 'Independent' }
  ];

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
    option: {
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
              <Select
                label="Sleep Schedule"
                value={editedData.sleepSchedule}
                onChange={(value) => setEditedData(prev => ({ ...prev, sleepSchedule: value || '' }))}
                data={sleepOptions}
                styles={selectStyles}
                mb="sm"
              />
              
              <Select
                label="Cleanliness"
                value={editedData.cleanliness}
                onChange={(value) => setEditedData(prev => ({ ...prev, cleanliness: value || '' }))}
                data={cleanlinessOptions}
                styles={selectStyles}
                mb="sm"
              />
              
              <Select
                label="Guests"
                value={editedData.guests}
                onChange={(value) => setEditedData(prev => ({ ...prev, guests: value || '' }))}
                data={guestOptions}
                styles={selectStyles}
                mb="sm"
              />
            </Grid.Col>
            
            <Grid.Col span={6}>
              <Select
                label="Studying"
                value={editedData.studying}
                onChange={(value) => setEditedData(prev => ({ ...prev, studying: value || '' }))}
                data={studyingOptions}
                styles={selectStyles}
                mb="sm"
              />
              
              <Select
                label="Substances"
                value={editedData.substances}
                onChange={(value) => setEditedData(prev => ({ ...prev, substances: value || '' }))}
                data={substanceOptions}
                styles={selectStyles}
                mb="sm"
              />
            </Grid.Col>
            
            <Grid.Col span={12} mt="md">
              <MultiSelect
                label="Personality Traits"
                value={editedData.personality}
                onChange={(values) => setEditedData(prev => ({ ...prev, personality: values }))}
                data={personalityOptions}
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