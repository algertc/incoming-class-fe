import React from 'react';
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
} from '@mantine/core';
import {
  IconUser,
  IconEdit,
  IconMail,
  IconBrandInstagram,
  IconBrandSnapchat,
  IconSchool,
} from '@tabler/icons-react';
import { glassCardStyles } from '../utils/glassStyles';

interface ContactData {
  email: string;
  instagram: string;
  snapchat: string;
  university: string;
  batch: string;
}

interface ModernContactCardProps {
  contactData: ContactData;
  onEdit?: () => void;
}

const ModernContactCard: React.FC<ModernContactCardProps> = ({
  contactData,
  onEdit = () => console.log('Edit contact info'),
}) => {
  const theme = useMantineTheme();

  const contacts = [
    { icon: IconMail, label: 'Email', value: contactData.email, color: 'blue' },
    { icon: IconBrandInstagram, label: 'Instagram', value: contactData.instagram, color: 'pink' },
    { icon: IconBrandSnapchat, label: 'Snapchat', value: contactData.snapchat, color: 'yellow' },
  ];

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
        <ActionIcon variant="light" color="pink" radius="xl" onClick={onEdit}>
          <IconEdit size={16} />
        </ActionIcon>
      </Group>

      <Stack gap="sm">
        {contacts.map((contact, index) => (
          <Group key={index} gap="sm" style={{ padding: rem(8), borderRadius: rem(8), background: 'rgba(255, 255, 255, 0.05)' }}>
            <ThemeIcon size="sm" variant="light" color={contact.color} radius="xl">
              <contact.icon size={14} />
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              <Text size="xs" c="dimmed">{contact.label}</Text>
              <Text size="sm" c="white" fw={500}>{contact.value}</Text>
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
    </Card>
  );
};

export default ModernContactCard; 