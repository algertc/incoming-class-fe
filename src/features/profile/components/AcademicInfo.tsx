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
  TextInput,
  Switch,
  Button,
  Box
} from '@mantine/core';
import { IconSchool, IconEdit, IconCheck, IconX } from '@tabler/icons-react';

interface AcademicInfoProps {
  major: string;
  university: string;
  batch: string;
  hometown: string;
  lookingForRoommate?: boolean;
  isEditable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (data: {
    academic: { major: string; university: string; batch: string };
    location: { hometown: string };
    lookingForRoommate: boolean;
  }) => void;
  onCancel?: () => void;
}

const AcademicInfo: React.FC<AcademicInfoProps> = ({
  major,
  university,
  batch,
  hometown,
  lookingForRoommate = false,
  isEditable = false,
  isEditing = false,
  onEdit = () => console.log('Edit academic info'),
  onSave = () => console.log('Save academic info'),
  onCancel = () => console.log('Cancel edit')
}) => {
  const theme = useMantineTheme();
  const [editedData, setEditedData] = useState({
    major,
    university,
    batch,
    hometown,
    lookingForRoommate
  });

  useEffect(() => {
    setEditedData({
      major,
      university,
      batch,
      hometown,
      lookingForRoommate
    });
  }, [major, university, batch, hometown, lookingForRoommate]);

  const handleSave = () => {
    onSave({
      academic: {
        major: editedData.major,
        university: editedData.university,
        batch: editedData.batch
      },
      location: {
        hometown: editedData.hometown
      },
      lookingForRoommate: editedData.lookingForRoommate
    });
  };

  const handleCancel = () => {
    setEditedData({
      major,
      university,
      batch,
      hometown,
      lookingForRoommate
    });
    onCancel();
  };
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
      <Group mb="md" justify="space-between">
        <Group>
          <ThemeIcon size="lg" radius="md" color="indigo">
            <IconSchool size={20} />
          </ThemeIcon>
          <Title order={4} c="white">Academic Information</Title>
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
              <TextInput
                label="Major"
                value={editedData.major}
                onChange={(event) => setEditedData(prev => ({ ...prev, major: event.currentTarget.value }))}
                styles={{
                  label: { color: 'white', fontWeight: 500 },
                  input: {
                    backgroundColor: theme.colors.dark[6],
                    borderColor: theme.colors.dark[4],
                    color: 'white',
                    '&:focus': {
                      borderColor: theme.colors.indigo[5],
                    },
                  },
                }}
                mb="sm"
              />
              
              <TextInput
                label="University"
                value={editedData.university}
                onChange={(event) => setEditedData(prev => ({ ...prev, university: event.currentTarget.value }))}
                styles={{
                  label: { color: 'white', fontWeight: 500 },
                  input: {
                    backgroundColor: theme.colors.dark[6],
                    borderColor: theme.colors.dark[4],
                    color: 'white',
                    '&:focus': {
                      borderColor: theme.colors.indigo[5],
                    },
                  },
                }}
                mb="sm"
              />
            </Grid.Col>
            
            <Grid.Col span={6}>
              <TextInput
                label="Batch"
                value={editedData.batch}
                onChange={(event) => setEditedData(prev => ({ ...prev, batch: event.currentTarget.value }))}
                styles={{
                  label: { color: 'white', fontWeight: 500 },
                  input: {
                    backgroundColor: theme.colors.dark[6],
                    borderColor: theme.colors.dark[4],
                    color: 'white',
                    '&:focus': {
                      borderColor: theme.colors.indigo[5],
                    },
                  },
                }}
                mb="sm"
              />
              
              <TextInput
                label="Hometown"
                value={editedData.hometown}
                onChange={(event) => setEditedData(prev => ({ ...prev, hometown: event.currentTarget.value }))}
                styles={{
                  label: { color: 'white', fontWeight: 500 },
                  input: {
                    backgroundColor: theme.colors.dark[6],
                    borderColor: theme.colors.dark[4],
                    color: 'white',
                    '&:focus': {
                      borderColor: theme.colors.indigo[5],
                    },
                  },
                }}
                mb="sm"
              />
            </Grid.Col>
            
            <Grid.Col span={12}>
              <Switch
                label="Looking for roommate"
                checked={editedData.lookingForRoommate}
                onChange={(event) => setEditedData(prev => ({ ...prev, lookingForRoommate: event.currentTarget.checked }))}
                color="teal"
                styles={{
                  label: { color: 'white', fontWeight: 500 },
                }}
                mt="md"
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
            <Text fw={500} size="sm" c="white">Major</Text>
            <Text c="gray.4" mb="sm">{major}</Text>
            
            <Text fw={500} size="sm" c="white">University</Text>
            <Text c="gray.4" mb="sm">{university}</Text>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Text fw={500} size="sm" c="white">Batch</Text>
            <Text c="gray.4" mb="sm">{batch}</Text>
            
            <Text fw={500} size="sm" c="white">Hometown</Text>
            <Text c="gray.4" mb="sm">{hometown}</Text>
          </Grid.Col>
          
          {lookingForRoommate && (
            <Grid.Col span={12}>
              <Badge size="lg" color="teal" variant="light" mt="md">
                Looking for roommate
              </Badge>
            </Grid.Col>
          )}
        </Grid>
      )}
    </Card>
  );
};

export default AcademicInfo; 