import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Tabs, 
  Title, 
  Text, 
  Box, 
  Switch,
  Group, 
  Button, 
  Divider,
  TextInput,
  PasswordInput,
  Select,
  Stack,
  Accordion,
  Alert
} from '@mantine/core';
import { 
  IconShield, 
  IconBell, 
  IconDeviceDesktop, 
  IconBuildingBank, 
  IconExclamationCircle, 
  IconCheck
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string | null>('account');
  const [passwordChanged, setPasswordChanged] = useState(false);

  const passwordForm = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      confirmPassword: (value, values) => 
        value !== values.newPassword ? 'Passwords do not match' : null,
      newPassword: (value) => 
        value.length < 8 ? 'Password must be at least 8 characters' : null,
    }
  });

  const notificationForm = useForm({
    initialValues: {
      emailNotifications: true,
      marketingEmails: false,
      newConnectionAlerts: true,
      messageNotifications: true,
      appNotifications: true
    }
  });

  const privacyForm = useForm({
    initialValues: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      allowMessaging: true,
      dataSharing: false
    }
  });

  const handlePasswordChange = (values: typeof passwordForm.values) => {
    console.log('Changing password:', values);
    // In a real app, this would call an API to change the password
    setPasswordChanged(true);
    setTimeout(() => setPasswordChanged(false), 3000);
    passwordForm.reset();
  };

  const handleNotificationSave = (values: typeof notificationForm.values) => {
    console.log('Saving notification settings:', values);
    // In a real app, this would call an API to update notification settings
  };

  const handlePrivacySave = (values: typeof privacyForm.values) => {
    console.log('Saving privacy settings:', values);
    // In a real app, this would call an API to update privacy settings
  };

  return (
    <Container size="lg" py="xl">
      <Paper shadow="md" p="xl" radius="md" withBorder>
        <Title order={2} mb="lg">Settings</Title>
        
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List mb="md">
            <Tabs.Tab value="account" leftSection={<IconBuildingBank size={16} />}>
              Account
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="privacy" leftSection={<IconShield size={16} />}>
              Privacy
            </Tabs.Tab>
            <Tabs.Tab value="appearance" leftSection={<IconDeviceDesktop size={16} />}>
              Appearance
            </Tabs.Tab>
          </Tabs.List>

          {/* Account Settings */}
          <Tabs.Panel value="account">
            <Title order={3} mb="md">Account Settings</Title>
            <Divider mb="lg" />
            
            <Box mb="xl">
              <Title order={4} mb="md">Personal Information</Title>
              <Text c="dimmed" size="sm" mb="md">
                Manage your basic account information
              </Text>
              <Button color="blue" variant="outline" component="a" href="/profile/management">
                Manage Profile
              </Button>
            </Box>
            
            <Box mb="xl">
              <Title order={4} mb="md">Password</Title>
              {passwordChanged && (
                <Alert 
                  icon={<IconCheck size={16} />} 
                  title="Success!" 
                  color="green" 
                  mb="md"
                >
                  Your password has been changed successfully.
                </Alert>
              )}
              <form onSubmit={passwordForm.onSubmit(handlePasswordChange)}>
                <Stack>
                  <PasswordInput
                    label="Current Password"
                    placeholder="Enter your current password"
                    required
                    {...passwordForm.getInputProps('currentPassword')}
                  />
                  <PasswordInput
                    label="New Password"
                    placeholder="Enter your new password"
                    required
                    {...passwordForm.getInputProps('newPassword')}
                  />
                  <PasswordInput
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    required
                    {...passwordForm.getInputProps('confirmPassword')}
                  />
                  <Group justify="flex-end">
                    <Button type="submit" color="blue">
                      Change Password
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Box>
            
            <Box mb="xl">
              <Title order={4} mb="md" c="red">Danger Zone</Title>
              <Text c="dimmed" size="sm" mb="md">
                Permanently delete your account and all of your content.
              </Text>
              <Accordion>
                <Accordion.Item value="delete-account">
                  <Accordion.Control>
                    <Group>
                      <IconExclamationCircle color="red" />
                      <Text c="red">Delete Account</Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text mb="md">
                      This action cannot be undone. This will permanently delete your account
                      and remove your data from our servers.
                    </Text>
                    <TextInput
                      placeholder="Type 'DELETE' to confirm"
                      mb="md"
                      required
                    />
                    <Button color="red">
                      Permanently Delete Account
                    </Button>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Box>
          </Tabs.Panel>

          {/* Notification Settings */}
          <Tabs.Panel value="notifications">
            <Title order={3} mb="md">Notification Settings</Title>
            <Divider mb="lg" />
            
            <form onSubmit={notificationForm.onSubmit(handleNotificationSave)}>
              <Stack>
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>Email Notifications</Text>
                    <Text size="sm" c="dimmed">Receive email notifications</Text>
                  </Box>
                  <Switch 
                    {...notificationForm.getInputProps('emailNotifications', { type: 'checkbox' })}
                  />
                </Group>
                
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>Marketing Emails</Text>
                    <Text size="sm" c="dimmed">Receive marketing and promotional emails</Text>
                  </Box>
                  <Switch 
                    {...notificationForm.getInputProps('marketingEmails', { type: 'checkbox' })}
                  />
                </Group>
                
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>New Connection Alerts</Text>
                    <Text size="sm" c="dimmed">Get notified when someone connects with you</Text>
                  </Box>
                  <Switch 
                    {...notificationForm.getInputProps('newConnectionAlerts', { type: 'checkbox' })}
                  />
                </Group>
                
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>Message Notifications</Text>
                    <Text size="sm" c="dimmed">Get notified when you receive a message</Text>
                  </Box>
                  <Switch 
                    {...notificationForm.getInputProps('messageNotifications', { type: 'checkbox' })}
                  />
                </Group>
                
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>App Notifications</Text>
                    <Text size="sm" c="dimmed">Receive in-app notifications</Text>
                  </Box>
                  <Switch 
                    {...notificationForm.getInputProps('appNotifications', { type: 'checkbox' })}
                  />
                </Group>
                
                <Group justify="flex-end" mt="md">
                  <Button type="submit" color="blue">
                    Save Notification Settings
                  </Button>
                </Group>
              </Stack>
            </form>
          </Tabs.Panel>

          {/* Privacy Settings */}
          <Tabs.Panel value="privacy">
            <Title order={3} mb="md">Privacy Settings</Title>
            <Divider mb="lg" />
            
            <form onSubmit={privacyForm.onSubmit(handlePrivacySave)}>
              <Stack>
                <Select
                  label="Profile Visibility"
                  description="Who can see your profile"
                  placeholder="Select visibility"
                  data={[
                    { value: 'public', label: 'Public' },
                    { value: 'connections', label: 'Connections Only' },
                    { value: 'private', label: 'Private' }
                  ]}
                  {...privacyForm.getInputProps('profileVisibility')}
                />
                
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>Show Email</Text>
                    <Text size="sm" c="dimmed">Display your email on your profile</Text>
                  </Box>
                  <Switch 
                    {...privacyForm.getInputProps('showEmail', { type: 'checkbox' })}
                  />
                </Group>
                
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>Show Phone Number</Text>
                    <Text size="sm" c="dimmed">Display your phone number on your profile</Text>
                  </Box>
                  <Switch 
                    {...privacyForm.getInputProps('showPhone', { type: 'checkbox' })}
                  />
                </Group>
                
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>Allow Messaging</Text>
                    <Text size="sm" c="dimmed">Allow other users to message you</Text>
                  </Box>
                  <Switch 
                    {...privacyForm.getInputProps('allowMessaging', { type: 'checkbox' })}
                  />
                </Group>
                
                <Group justify="space-between">
                  <Box>
                    <Text fw={500}>Data Sharing</Text>
                    <Text size="sm" c="dimmed">Share your data with our partners</Text>
                  </Box>
                  <Switch 
                    {...privacyForm.getInputProps('dataSharing', { type: 'checkbox' })}
                  />
                </Group>
                
                <Group justify="flex-end" mt="md">
                  <Button type="submit" color="blue">
                    Save Privacy Settings
                  </Button>
                </Group>
              </Stack>
            </form>
          </Tabs.Panel>

          {/* Appearance Settings */}
          <Tabs.Panel value="appearance">
            <Title order={3} mb="md">Appearance Settings</Title>
            <Divider mb="lg" />
            
            <Box mb="xl">
              <Title order={4} mb="md">Theme</Title>
              <Group>
                <Button variant="outline" color="blue">Light</Button>
                <Button variant="filled" color="dark">Dark</Button>
                <Button variant="outline" color="gray">System</Button>
              </Group>
            </Box>
            
            <Box mb="xl">
              <Title order={4} mb="md">Text Size</Title>
              <Select
                placeholder="Select text size"
                data={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium (Default)' },
                  { value: 'large', label: 'Large' }
                ]}
                defaultValue="medium"
              />
            </Box>
            
            <Box>
              <Title order={4} mb="md">Layout Density</Title>
              <Select
                placeholder="Select layout density"
                data={[
                  { value: 'compact', label: 'Compact' },
                  { value: 'normal', label: 'Normal (Default)' },
                  { value: 'comfortable', label: 'Comfortable' }
                ]}
                defaultValue="normal"
              />
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default SettingsPage; 