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
import { IconSchool, IconEdit } from '@tabler/icons-react';

interface AcademicInfoProps {
  major: string;
  university: string;
  batch: string;
  hometown: string;
  lookingForRoommate?: boolean;
  isEditable?: boolean;
  onEdit?: () => void;
}

const AcademicInfo: React.FC<AcademicInfoProps> = ({
  major,
  university,
  batch,
  hometown,
  lookingForRoommate = false,
  isEditable = false,
  onEdit = () => console.log('Edit academic info')
}) => {
  const theme = useMantineTheme();
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
      <Group mb="md" justify="space-between">
        <Group>
          <ThemeIcon size="lg" radius="md" color="indigo">
            <IconSchool size={20} />
          </ThemeIcon>
          <Title order={4} c="white">Academic Information</Title>
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
    </Card>
  );
};

export default AcademicInfo; 