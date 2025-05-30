import React from 'react';
import {
  Card,
  Group,
  ThemeIcon,
  Title,
  Divider,
  Text,
  ActionIcon,
  Anchor,
  useMantineTheme
} from '@mantine/core';
import { 
  IconUser, 
  IconEdit, 
  IconMapPin, 
  IconMail, 
  IconBrandInstagram, 
  IconBrandSnapchat 
} from '@tabler/icons-react';

interface ContactInfoProps {
  hometown: string;
  country: string;
  email: string;
  instagram: string;
  snapchat: string;
  isEditable?: boolean;
  onEdit?: () => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  hometown,
  country,
  email,
  instagram,
  snapchat,
  isEditable = false,
  onEdit = () => console.log('Edit contact info')
}) => {
  const theme = useMantineTheme();
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
      <Group mb="md" justify="space-between">
        <Group>
          <ThemeIcon size="lg" radius="md" color="indigo">
            <IconUser size={20} />
          </ThemeIcon>
          <Title order={4} c="white">Contact Information</Title>
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
      
      <Group mb="md" align="flex-start">
        <ThemeIcon color="indigo" size="md" radius="xl">
          <IconMapPin size={16} />
        </ThemeIcon>
        <div>
          <Text fw={500} size="sm" c="white">Location</Text>
          <Text c="gray.4" size="sm">
            {hometown}, {country}
          </Text>
        </div>
      </Group>
      
      <Group mb="md" align="flex-start">
        <ThemeIcon color="indigo" size="md" radius="xl">
          <IconMail size={16} />
        </ThemeIcon>
        <div>
          <Text fw={500} size="sm" c="white">Email</Text>
          <Text c="gray.4" size="sm">
            {email}
          </Text>
        </div>
      </Group>
      
      <Divider my="md" label="Social Profiles" labelPosition="center" c="gray.5" />
      
      <Group>
        <Anchor href={`https://instagram.com/${instagram.replace('@', '')}`} target="_blank" c="indigo.4">
          <Group>
            <IconBrandInstagram size={16} />
            <Text size="sm">{instagram}</Text>
          </Group>
        </Anchor>
        
        <Anchor href={`https://snapchat.com/add/${snapchat.replace('@', '')}`} target="_blank" c="indigo.4">
          <Group>
            <IconBrandSnapchat size={16} />
            <Text size="sm">{snapchat}</Text>
          </Group>
        </Anchor>
      </Group>
    </Card>
  );
};

export default ContactInfo; 