import React from 'react';
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
  useMantineTheme
} from '@mantine/core';
import { IconDeviceLaptop, IconEdit } from '@tabler/icons-react';

interface InterestsCardProps {
  physicalActivity: string[];
  pastimes: string[];
  food: string[];
  isEditable?: boolean;
  onEdit?: () => void;
}

const InterestsCard: React.FC<InterestsCardProps> = ({
  physicalActivity,
  pastimes,
  food,
  isEditable = false,
  onEdit = () => console.log('Edit interests')
}) => {
  const theme = useMantineTheme();
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
      <Group mb="md" justify="space-between">
        <Group>
          <ThemeIcon size="lg" radius="md" color="indigo">
            <IconDeviceLaptop size={20} />
          </ThemeIcon>
          <Title order={4} c="white">Interests</Title>
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
      </Stack>
    </Card>
  );
};

export default InterestsCard; 