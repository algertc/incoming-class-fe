import React, { useState, useEffect } from 'react';
import {
  Card,
  Group,
  ThemeIcon,
  Text,
  ActionIcon,
  Stack,
  Box,
  Divider,
  useMantineTheme,
  rem,
  TextInput,
  Button,
} from '@mantine/core';
import {
  IconUser,
  IconEdit,
  IconSchool,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { InstagramIcon, SnapchatIcon } from './icons';
import { glassCardStyles } from '../utils/glassStyles';

interface ContactData {
  instagram: string;
  snapchat: string;
  university: string;
  batch: string;
}

interface ModernContactCardProps {
  contactData: ContactData;
  isEditable?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: (data: { instagram: string; snapchat: string }) => void;
  onCancel?: () => void;
}

const ModernContactCard: React.FC<ModernContactCardProps> = ({
  contactData,
  isEditable = false,
  isEditing = false,
  onEdit = () => console.log('Edit contact info'),
  onSave = () => console.log('Save contact info'),
  onCancel = () => console.log('Cancel edit')
}) => {
  const theme = useMantineTheme();
  const [editedData, setEditedData] = useState({
    instagram: contactData.instagram,
    snapchat: contactData.snapchat
  });

  useEffect(() => {
    setEditedData({
      instagram: contactData.instagram,
      snapchat: contactData.snapchat
    });
  }, [contactData.instagram, contactData.snapchat]);

  const handleSave = () => {
    onSave({
      instagram: editedData.instagram,
      snapchat: editedData.snapchat
    });
  };

  const handleCancel = () => {
    setEditedData({
      instagram: contactData.instagram,
      snapchat: contactData.snapchat
    });
    onCancel();
  };

  const contacts = [
    // { 
    //   icon: (props: { size: number }) => <IconMail {...props} />, 
    //   label: 'Email', 
    //   value: contactData.email, 
    //   color: 'blue', 
    //   editable: false 
    // },
    { 
      icon: (props: { size: number }) => <InstagramIcon size={props.size} />, 
      label: 'Instagram', 
      value: contactData.instagram, 
      color: 'pink', 
      editable: true 
    },
    { 
      icon: (props: { size: number }) => <SnapchatIcon size={props.size} />, 
      label: 'Snapchat', 
      value: contactData.snapchat, 
      color: 'yellow', 
      editable: true 
    },
  ];

  const inputStyles = {
    label: { color: 'white', fontWeight: 500, fontSize: '11px' },
    input: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
      fontSize: '13px',
      padding: rem(6),
      minHeight: rem(28),
      '&:focus': {
        borderColor: theme.colors.pink[5],
      },
    },
  };

  return (
    <Card
      p="lg"
      mb="md"
      style={{
        ...glassCardStyles(theme, 'accent'),
      }}
    >
      <Group mb="md" gap="sm">
        <ThemeIcon color="pink" variant="light" size="lg" radius="xl">
          <IconUser size={20} />
        </ThemeIcon>
        <Box style={{ flex: 1 }}>
          <Text fw={700} c="white" size="sm">Quick Connect</Text>
          <Text size="xs" c="dimmed">Stay in touch</Text>
        </Box>
        {isEditable && !isEditing && (
          <ActionIcon variant="light" color="pink" radius="xl" onClick={onEdit}>
            <IconEdit size={16} />
          </ActionIcon>
        )}
        {isEditing && (
          <Group gap="xs">
            <ActionIcon variant="light" color="green" radius="xl" onClick={handleSave}>
              <IconCheck size={16} />
            </ActionIcon>
            <ActionIcon variant="light" color="red" radius="xl" onClick={handleCancel}>
              <IconX size={16} />
            </ActionIcon>
          </Group>
        )}
      </Group>

      <Stack gap="sm">
        {contacts.map((contact, index) => (
          <Group key={index} gap="sm" style={{ padding: rem(8), borderRadius: rem(8), background: 'rgba(255, 255, 255, 0.05)' }}>
            <ThemeIcon size="sm" variant="light" color={contact.color} radius="xl">
              {contact.icon({ size: 14 })}
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              {isEditing && contact.editable ? (
                <TextInput
                  label={contact.label}
                  value={contact.label === 'Instagram' ? editedData.instagram : editedData.snapchat}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    if (contact.label === 'Instagram') {
                      setEditedData(prev => ({ ...prev, instagram: value }));
                    } else {
                      setEditedData(prev => ({ ...prev, snapchat: value }));
                    }
                  }}
                  placeholder={`Enter ${contact.label} handle`}
                  styles={inputStyles}
                  size="xs"
                />
              ) : (
                <>
                  <Text size="xs" c="dimmed">{contact.label}</Text>
                  {contact.label === 'Instagram' && contact.value ? (
                    <Text
                      size="sm"
                      c="white"
                      fw={500}
                      component="a"
                      href={`https://www.instagram.com/${contact.value.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        textDecoration: 'none',
                        cursor: 'pointer',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {contact.value}
                    </Text>
                  ) : (
                  <Text size="sm" c="white" fw={500}>{contact.value}</Text>
                  )}
                </>
              )}
            </Box>
          </Group>
        ))}
        
        <Divider my="xs" color="rgba(255, 255, 255, 0.1)" />
        
        <Group gap="sm" style={{ padding: rem(8), borderRadius: rem(8), background: 'rgba(255, 255, 255, 0.05)' }}>
          <ThemeIcon size="sm" variant="light" color="teal" radius="xl">
            <IconSchool size={14} />
          </ThemeIcon>
          <Box style={{ flex: 1 }}>
            <Text size="xs" c="dimmed">University</Text>
            <Text size="sm" c="white" fw={500}>{contactData.university}</Text>
            <Text size="xs" c="dimmed">{contactData.batch}</Text>
          </Box>
        </Group>
      </Stack>

      {isEditing && (
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" size="xs" onClick={handleCancel}>
            Cancel
          </Button>
          <Button color="pink" size="xs" onClick={handleSave}>
            Save Changes
          </Button>
        </Group>
      )}
    </Card>
  );
};

export default ModernContactCard; 