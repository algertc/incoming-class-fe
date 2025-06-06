import React, { useState, useEffect } from 'react';
import {
  Card,
  Group,
  ThemeIcon,
  Title,
  Divider,
  Text,
  ActionIcon,
  useMantineTheme,
  Textarea,
  Button,
  Box
} from '@mantine/core';
import { IconUser, IconEdit, IconCheck, IconX } from '@tabler/icons-react';

interface BioCardProps {
  bio: string;
  isEditable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (bio: string) => void;
  onCancel?: () => void;
}

const BioCard: React.FC<BioCardProps> = ({
  bio,
  isEditable = false,
  isEditing = false,
  onEdit = () => console.log('Edit bio'),
  onSave = () => console.log('Save bio'),
  onCancel = () => console.log('Cancel edit')
}) => {
  const theme = useMantineTheme();
  const [editedBio, setEditedBio] = useState(bio);

  useEffect(() => {
    setEditedBio(bio);
  }, [bio]);

  const handleSave = () => {
    if (editedBio.trim() !== bio) {
      onSave(editedBio.trim());
    } else {
      onCancel();
    }
  };

  const handleCancel = () => {
    setEditedBio(bio);
    onCancel();
  };
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
      <Group mb="md" justify="space-between">
        <Group>
          <ThemeIcon size="lg" radius="md" color="indigo">
            <IconUser size={20} />
          </ThemeIcon>
          <Title order={4} c="white">About Me</Title>
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
          <Textarea
            value={editedBio}
            onChange={(event) => setEditedBio(event.currentTarget.value)}
            placeholder="Tell others about yourself..."
            minRows={3}
            maxRows={6}
            autosize
            styles={{
              input: {
                backgroundColor: theme.colors.dark[6],
                borderColor: theme.colors.dark[4],
                color: 'white',
                '&:focus': {
                  borderColor: theme.colors.indigo[5],
                },
              },
            }}
          />
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
        <Text c="gray.4" size="md" style={{ lineHeight: 1.6 }}>
          {bio}
        </Text>
      )}
    </Card>
  );
};

export default BioCard; 