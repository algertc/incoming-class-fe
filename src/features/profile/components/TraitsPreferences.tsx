import React from 'react';
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
  useMantineTheme
} from '@mantine/core';
import { IconUser, IconEdit } from '@tabler/icons-react';

interface TraitsPreferencesProps {
  sleepSchedule: string;
  cleanliness: string;
  guests: string;
  studying: string;
  substances: string;
  personality: string[];
  isEditable?: boolean;
  onEdit?: () => void;
}

const TraitsPreferences: React.FC<TraitsPreferencesProps> = ({
  sleepSchedule,
  cleanliness,
  guests,
  studying,
  substances,
  personality,
  isEditable = false,
  onEdit = () => console.log('Edit traits')
}) => {
  const theme = useMantineTheme();
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
      <Group mb="md" justify="space-between">
        <Group>
          <ThemeIcon size="lg" radius="md" color="indigo">
            <IconUser size={20} />
          </ThemeIcon>
          <Title order={4} c="white">Traits & Preferences</Title>
        </Group>
        {isEditable && (
          <ActionIcon
            color="indigo"
            variant="light"
            onClick={onEdit}
          >
            <IconEdit size={18} />
          </ActionIcon>
        )}
      </Group>
      <Divider mb="md" color={theme.colors.dark[5]} />
      
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
    </Card>
  );
};

export default TraitsPreferences; 