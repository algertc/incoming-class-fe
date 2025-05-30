import React from 'react';
import {
  Card,
  Group,
  ThemeIcon,
  Title,
  Divider,
  Text,
  ActionIcon,
  useMantineTheme
} from '@mantine/core';
import { IconUser, IconEdit } from '@tabler/icons-react';

interface BioCardProps {
  bio: string;
  isEditable?: boolean;
  onEdit?: () => void;
}

const BioCard: React.FC<BioCardProps> = ({
  bio,
  isEditable = false,
  onEdit = () => console.log('Edit bio')
}) => {
  const theme = useMantineTheme();
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
      <Group mb="md" justify="space-between">
        <Group>
          <ThemeIcon size="lg" radius="md" color="indigo">
            <IconUser size={20} />
          </ThemeIcon>
          <Title order={4} c="white">About Me</Title>
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
      
      <Text c="gray.4" size="md" style={{ lineHeight: 1.6 }}>
        {bio}
      </Text>
    </Card>
  );
};

export default BioCard; 