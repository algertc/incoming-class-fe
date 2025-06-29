import React, { useState, useEffect } from 'react';
import {
  Card,
  Group,
  ThemeIcon,
  Title,
  Divider,
  Text,
  Badge,
  ActionIcon,
  Stack,
  Box,
  useMantineTheme,
  MultiSelect,
  Select,
  Button
} from '@mantine/core';
import { IconDeviceLaptop, IconEdit, IconCheck, IconX } from '@tabler/icons-react';

interface InterestsCardProps {
  physicalActivity: string[];
  pastimes: string[];
  food: string[];
  campusInvolvement?: string;
  isEditable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (data: {
    physicalActivity: string[];
    pastimes: string[];
    food: string[];
    campusInvolvement?: string;
  }) => void;
  onCancel?: () => void;
}

const InterestsCard: React.FC<InterestsCardProps> = ({
  physicalActivity,
  pastimes,
  food,
  campusInvolvement = '',
  isEditable = false,
  isEditing = false,
  onEdit = () => console.log('Edit interests'),
  onSave = () => console.log('Save interests'),
  onCancel = () => console.log('Cancel edit')
}) => {
  const theme = useMantineTheme();
  const [editedData, setEditedData] = useState({
    physicalActivity,
    pastimes,
    food,
    campusInvolvement
  });

  useEffect(() => {
    setEditedData({
      physicalActivity,
      pastimes,
      food,
      campusInvolvement
    });
  }, [physicalActivity, pastimes, food, campusInvolvement]);

  const handleSave = () => {
    onSave({
      physicalActivity: editedData.physicalActivity,
      pastimes: editedData.pastimes,
      food: editedData.food,
      campusInvolvement: editedData.campusInvolvement
    });
  };

  const handleCancel = () => {
    setEditedData({
      physicalActivity,
      pastimes,
      food,
      campusInvolvement
    });
    onCancel();
  };

  // Options for different categories
  const physicalActivityOptions = [
    { value: 'Working Out', label: 'Working Out' },
    { value: 'Running', label: 'Running' },
    { value: 'Tennis', label: 'Tennis' },
    { value: 'Basketball', label: 'Basketball' },
    { value: 'Swimming', label: 'Swimming' },
    { value: 'Yoga', label: 'Yoga' },
    { value: 'Hiking', label: 'Hiking' },
    { value: 'Cycling', label: 'Cycling' },
    { value: 'Soccer', label: 'Soccer' },
    { value: 'Baseball', label: 'Baseball' },
    { value: 'Golf', label: 'Golf' },
    { value: 'Rock Climbing', label: 'Rock Climbing' }
  ];

  const pastimeOptions = [
    { value: 'Video Games', label: 'Video Games' },
    { value: 'Reading', label: 'Reading' },
    { value: 'Music', label: 'Music' },
    { value: 'Travel', label: 'Travel' },
    { value: 'Movies', label: 'Movies' },
    { value: 'Art', label: 'Art' },
    { value: 'Photography', label: 'Photography' },
    { value: 'Cooking', label: 'Cooking' },
    { value: 'Dancing', label: 'Dancing' },
    { value: 'Writing', label: 'Writing' },
    { value: 'Board Games', label: 'Board Games' },
    { value: 'Podcasts', label: 'Podcasts' }
  ];

  const foodOptions = [
    { value: 'Coffee', label: 'Coffee' },
    { value: 'Pizza', label: 'Pizza' },
    { value: 'Mexican', label: 'Mexican' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' },
    { value: 'Indian', label: 'Indian' },
    { value: 'Thai', label: 'Thai' },
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Vegan', label: 'Vegan' },
    { value: 'BBQ', label: 'BBQ' },
    { value: 'Seafood', label: 'Seafood' }
  ];

  const campusInvolvementOptions = [
    { value: 'Rushing a fraternity/sorority', label: 'Rushing a fraternity/sorority' },
    { value: 'Business fraternity', label: 'Business fraternity' },
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
            <IconDeviceLaptop size={20} />
          </ThemeIcon>
          <Title order={4} c="white">Interests</Title>
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
          <Stack gap="lg">
            <MultiSelect
              label="Physical Activity"
              value={editedData.physicalActivity}
              onChange={(values) => setEditedData(prev => ({ ...prev, physicalActivity: values }))}
              data={physicalActivityOptions}
              placeholder="Select physical activities"
              styles={selectStyles}
              maxValues={8}
            />
            
            <MultiSelect
              label="Pastimes"
              value={editedData.pastimes}
              onChange={(values) => setEditedData(prev => ({ ...prev, pastimes: values }))}
              data={pastimeOptions}
              placeholder="Select pastimes"
              styles={selectStyles}
              maxValues={8}
            />
            
            <MultiSelect
              label="Food Preferences"
              value={editedData.food}
              onChange={(values) => setEditedData(prev => ({ ...prev, food: values }))}
              data={foodOptions}
              placeholder="Select food preferences"
              styles={selectStyles}
              maxValues={8}
            />
            
            <Select
              label="Campus Involvement"
              value={editedData.campusInvolvement}
              onChange={(value: string | null) => setEditedData(prev => ({ ...prev, campusInvolvement: value || '' }))}
              data={campusInvolvementOptions}
              placeholder="Select campus involvement"
              styles={selectStyles}
              clearable
            />
          </Stack>
          
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
        <Stack gap="lg">
          <Box>
            <Text fw={500} size="sm" c="white" mb="sm">Physical Activity</Text>
            <Group>
              {physicalActivity.map(activity => (
                <Badge 
                  key={activity} 
                  size="md" 
                  radius="sm" 
                  color="indigo" 
                  variant="outline"
                >
                  {activity}
                </Badge>
              ))}
            </Group>
          </Box>
          
          <Box>
            <Text fw={500} size="sm" c="white" mb="sm">Pastimes</Text>
            <Group>
              {pastimes.map(pastime => (
                <Badge 
                  key={pastime} 
                  size="md" 
                  radius="sm" 
                  color="blue" 
                  variant="outline"
                >
                  {pastime}
                </Badge>
              ))}
            </Group>
          </Box>
          
          <Box>
            <Text fw={500} size="sm" c="white" mb="sm">Food</Text>
            <Group>
              {food.map(item => (
                <Badge 
                  key={item} 
                  size="md" 
                  radius="sm" 
                  color="cyan" 
                  variant="outline"
                >
                  {item}
                </Badge>
              ))}
            </Group>
          </Box>
          
          {campusInvolvement && (
            <Box>
              <Text fw={500} size="sm" c="white" mb="sm">Campus Involvement</Text>
              <Badge 
                size="md" 
                radius="sm" 
                color="violet" 
                variant="outline"
              >
                {campusInvolvement}
              </Badge>
            </Box>
          )}
        </Stack>
      )}
    </Card>
  );
};

export default InterestsCard; 