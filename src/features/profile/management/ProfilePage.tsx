import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Tabs, 
  Title, 
  Text, 
  Box, 
  Avatar, 
  Group, 
  Button, 
  Divider,
  TextInput,
  Textarea,
  Select,
  Grid,
  FileInput
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUser, IconSchool, IconBriefcase, IconSettings, IconPencil, IconUpload } from '@tabler/icons-react';
import { useAuthStore } from '../../../store/auth.store';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string | null>('personal');

  const form = useForm({
    initialValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: '',
      phoneNumber: '',
      collegeName: (typeof user?.college === 'object' && user?.college?.name) || '',
      major: '',
      graduationYear: '',
      gpa: '',
      jobTitle: '',
      company: '',
      workExperience: '',
      skills: ''
    },
  });

  const handleSaveProfile = (values: typeof form.values) => {
    console.log('Saving profile:', values);
    // In a real app, this would call an API to update the profile
  };

  return (
    <Container size="xl" py="xl">
      <Paper shadow="md" radius="lg" p={0} withBorder>
        {/* Profile Header */}
        <Box 
          p="xl" 
          style={{ 
            background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
            color: 'white',
            borderTopLeftRadius: 'inherit',
            borderTopRightRadius: 'inherit',
            position: 'relative'
          }}
        >
          <Group justify="space-between">
            <Group>
              <Avatar 
                src={user?.profilePicture || "https://i.pravatar.cc/150?img=10"} 
                size={100} 
                radius={100}
                style={{ border: '3px solid white' }}
              />
              <Box>
                <Title order={2}>{user?.firstName} {user?.lastName}</Title>
                <Text>{user?.email}</Text>
                {(typeof user?.college === 'object' && user?.college?.name) && (
                  <Text size="sm">Student at {typeof user?.college === 'object' && user?.college?.name}</Text>
                )}
              </Box>
            </Group>
            <Button 
              variant="white" 
              leftSection={<IconPencil size={14} />}
              color="dark"
            >
              Edit Cover
            </Button>
          </Group>
        </Box>

        {/* Profile Content */}
        <Tabs value={activeTab} onChange={setActiveTab} style={{ padding: '0 20px' }}>
          <Tabs.List grow>
            <Tabs.Tab value="personal" leftSection={<IconUser size={16} />}>
              Personal
            </Tabs.Tab>
            <Tabs.Tab value="education" leftSection={<IconSchool size={16} />}>
              Education
            </Tabs.Tab>
            <Tabs.Tab value="career" leftSection={<IconBriefcase size={16} />}>
              Career
            </Tabs.Tab>
            <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>
              Settings
            </Tabs.Tab>
          </Tabs.List>

          <Box p="md">
            {/* Personal Information Tab */}
            <Tabs.Panel value="personal">
              <form onSubmit={form.onSubmit(handleSaveProfile)}>
                <Title order={3} mb="md">Personal Information</Title>
                <Divider mb="lg" />
                
                <Grid>
                  <Grid.Col span={12}>
                    <Group justify="center" mb="lg">
                      <Box style={{ textAlign: 'center' }}>
                        <Avatar 
                          src={user?.profilePicture || "https://i.pravatar.cc/150?img=10"} 
                          size={120} 
                          radius={120}
                          mb="sm"
                        />
                        <FileInput
                          placeholder="Change profile picture"
                          leftSection={<IconUpload size={14} />}
                          accept="image/png,image/jpeg"
                          style={{ maxWidth: 250, margin: '0 auto' }}
                        />
                      </Box>
                    </Group>
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="First Name"
                      placeholder="Enter your first name"
                      required
                      mb="md"
                      {...form.getInputProps('firstName')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Last Name"
                      placeholder="Enter your last name"
                      required
                      mb="md"
                      {...form.getInputProps('lastName')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <TextInput
                      label="Email"
                      placeholder="Enter your email"
                      required
                      mb="md"
                      disabled
                      {...form.getInputProps('email')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Phone Number"
                      placeholder="Enter your phone number"
                      mb="md"
                      {...form.getInputProps('phoneNumber')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Location"
                      placeholder="City, State"
                      mb="md"
                      {...form.getInputProps('location')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Textarea
                      label="Bio"
                      placeholder="Tell us about yourself"
                      minRows={4}
                      mb="md"
                      {...form.getInputProps('bio')}
                    />
                  </Grid.Col>
                </Grid>
                
                <Group justify="flex-end" mt="lg">
                  <Button type="submit" color="blue">Save Changes</Button>
                </Group>
              </form>
            </Tabs.Panel>

            {/* Education Tab */}
            <Tabs.Panel value="education">
              <form onSubmit={form.onSubmit(handleSaveProfile)}>
                <Title order={3} mb="md">Education Information</Title>
                <Divider mb="lg" />
                
                <Grid>
                  <Grid.Col span={12}>
                    <TextInput
                      label="College/University Name"
                      placeholder="Enter your college name"
                      mb="md"
                      {...form.getInputProps('collegeName')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Major"
                      placeholder="Enter your major"
                      mb="md"
                      {...form.getInputProps('major')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Select
                      label="Graduation Year"
                      placeholder="Select graduation year"
                      data={Array.from({ length: 10 }, (_, i) => ({ 
                        value: `${new Date().getFullYear() + i}`, 
                        label: `${new Date().getFullYear() + i}` 
                      }))}
                      mb="md"
                      {...form.getInputProps('graduationYear')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <TextInput
                      label="GPA"
                      placeholder="Enter your GPA"
                      mb="md"
                      {...form.getInputProps('gpa')}
                    />
                  </Grid.Col>
                </Grid>
                
                <Group justify="flex-end" mt="lg">
                  <Button type="submit" color="blue">Save Changes</Button>
                </Group>
              </form>
            </Tabs.Panel>

            {/* Career Tab */}
            <Tabs.Panel value="career">
              <form onSubmit={form.onSubmit(handleSaveProfile)}>
                <Title order={3} mb="md">Career Information</Title>
                <Divider mb="lg" />
                
                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Job Title"
                      placeholder="Enter your job title"
                      mb="md"
                      {...form.getInputProps('jobTitle')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Company"
                      placeholder="Enter your company name"
                      mb="md"
                      {...form.getInputProps('company')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <Textarea
                      label="Work Experience"
                      placeholder="Describe your work experience"
                      minRows={4}
                      mb="md"
                      {...form.getInputProps('workExperience')}
                    />
                  </Grid.Col>
                  
                  <Grid.Col span={12}>
                    <TextInput
                      label="Skills"
                      placeholder="Enter your skills (comma separated)"
                      mb="md"
                      {...form.getInputProps('skills')}
                    />
                  </Grid.Col>
                </Grid>
                
                <Group justify="flex-end" mt="lg">
                  <Button type="submit" color="blue">Save Changes</Button>
                </Group>
              </form>
            </Tabs.Panel>

            {/* Settings Tab */}
            <Tabs.Panel value="settings">
              <Title order={3} mb="md">Account Settings</Title>
              <Divider mb="lg" />
              
              <Box mb="xl">
                <Title order={4} mb="md">Password</Title>
                <Button color="blue">Change Password</Button>
              </Box>
              
              <Box mb="xl">
                <Title order={4} mb="md">Notifications</Title>
                <Text mb="md">Manage your notification preferences</Text>
                <Button color="blue">Manage Notifications</Button>
              </Box>
              
              <Box mb="xl">
                <Title order={4} mb="md" c="red">Danger Zone</Title>
                <Text mb="md">Delete your account permanently</Text>
                <Button color="red" variant="outline">Delete Account</Button>
              </Box>
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 