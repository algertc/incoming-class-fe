import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Grid,
  Stack,
  useMantineTheme
} from '@mantine/core';
import {
  IconUser,
  IconPhoto
} from '@tabler/icons-react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router';
import type { Post } from '../../features/feed/components/PostCard';

// Component imports
import ProfileBanner from './components/ProfileBanner';
import AcademicInfo from './components/AcademicInfo';
import TraitsPreferences from './components/TraitsPreferences';
import InterestsCard from './components/InterestsCard';
import ContactInfo from './components/ContactInfo';
import BioCard from './components/BioCard';
import PostsTab from './components/PostsTab';

// Extended user type to add profile completion fields
interface ExtendedUser {
  major?: string;
  hometown?: string;
  instagram?: string;
  snapchat?: string;
  lookingForRoommate?: boolean;
}

const CurrentUserProfilePage: React.FC = () => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock user posts data - in a real app, this would come from an API
  const [userPosts] = useState<Post[]>([
    {
      id: 'user-post-1',
      author: {
        id: user?.id || 'current-user',
        name: user ? `${user.firstName} ${user.lastName}` : 'Your Name',
        avatar: user?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        verified: true
      },
      content: 'Looking for roommates for the upcoming semester! I\'m a CS major and I\'m clean, organized, and respectful of quiet hours. DM me if interested!',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      likes: 15,
      comments: 3,
      shares: 2
    },
    {
      id: 'user-post-2',
      author: {
        id: user?.id || 'current-user',
        name: user ? `${user.firstName} ${user.lastName}` : 'Your Name',
        avatar: user?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        verified: true
      },
      content: 'Just aced my final exams! So ready for summer break. Anyone planning to take summer courses?',
      images: ['https://images.unsplash.com/photo-1623966759174-3b464b0bd50c?q=80&w=1000&auto=format&fit=crop'],
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      likes: 42,
      comments: 8,
      shares: 1
    }
  ]);
  
  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate('/login');
    }
    
    // Simulate loading posts
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);
  
  // Treat user as extended user with additional profile properties
  const extendedUser = user as unknown as ExtendedUser & typeof user;
  
  // This would come from the user's profile completion data in a real application
  const mockProfileData = {
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop',
    academic: {
      major: extendedUser?.major || 'Computer Science',
      university: 'Stanford University',
      batch: '2021-2025',
    },
    traits: {
      sleepSchedule: 'Night Owl',
      cleanliness: 'Organized',
      guests: 'With Notice',
      studying: 'Library',
      substances: 'No Substances',
    },
    personality: ['Extrovert', 'Creative', 'Adventurous'],
    physicalActivity: ['Working Out', 'Running', 'Tennis'],
    pastimes: ['Video Games', 'Reading', 'Music', 'Travel'],
    food: ['Coffee', 'Pizza', 'Mexican'],
    location: {
      hometown: extendedUser?.hometown || 'California',
      country: 'USA'
    },
    contact: {
      instagram: extendedUser?.instagram || '@username',
      snapchat: extendedUser?.snapchat || '@username',
    },
    lookingForRoommate: extendedUser?.lookingForRoommate || false
  };

  // Merge real user data with mock data
  const profileData = {
    ...mockProfileData,
    name: user ? `${user.firstName} ${user.lastName}` : 'Your Name',
    profileImage: user?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    bio: user?.bio || 'Add a bio to tell others about yourself.',
    designation: mockProfileData.academic.major ? `${mockProfileData.academic.major} Student` : 'University Student'
  };

  // Render the overview tab content
  const renderOverviewTab = () => (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack>
          <BioCard 
            bio={profileData.bio}
            isEditable={true}
          />
          <AcademicInfo 
            major={profileData.academic.major}
            university={profileData.academic.university}
            batch={profileData.academic.batch}
            hometown={profileData.location.hometown}
            lookingForRoommate={profileData.lookingForRoommate}
            isEditable={true}
          />
          <TraitsPreferences 
            sleepSchedule={profileData.traits.sleepSchedule}
            cleanliness={profileData.traits.cleanliness}
            guests={profileData.traits.guests}
            studying={profileData.traits.studying}
            substances={profileData.traits.substances}
            personality={profileData.personality}
            isEditable={true}
          />
        </Stack>
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack>
          <ContactInfo 
            hometown={profileData.location.hometown}
            country={profileData.location.country}
            email={user?.email || 'email@university.edu'}
            instagram={profileData.contact.instagram}
            snapchat={profileData.contact.snapchat}
            isEditable={true}
          />
          <InterestsCard 
            physicalActivity={profileData.physicalActivity}
            pastimes={profileData.pastimes}
            food={profileData.food}
            isEditable={true}
          />
        </Stack>
      </Grid.Col>
    </Grid>
  );

  return (
    <Container size="100%" py="xl" style={{ background: theme.colors.dark[8] }}>
      {/* Profile Banner */}
      <ProfileBanner
        name={profileData.name}
        designation={profileData.designation}
        profileImage={profileData.profileImage}
        isCurrentUser={true}
      />
      
      {/* Tab Navigation */}
      <Paper shadow="sm" withBorder radius="md" p="md" mb="xl" bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
        <Tabs 
          value={activeTab} 
          onChange={(value) => setActiveTab(value as string)}
          color="indigo"
          radius="md"
          style={{ overflow: 'visible' }}
        >
          <Tabs.List>
            <Tabs.Tab 
              value="overview" 
              leftSection={<IconUser size={16} />}
              style={{ fontWeight: activeTab === 'overview' ? 600 : 400, color: activeTab === 'overview' ? theme.colors.indigo[4] : theme.colors.gray[4] }}
            >
              Overview
            </Tabs.Tab>
            <Tabs.Tab 
              value="posts" 
              leftSection={<IconPhoto size={16} />}
              style={{ fontWeight: activeTab === 'posts' ? 600 : 400, color: activeTab === 'posts' ? theme.colors.indigo[4] : theme.colors.gray[4] }}
            >
              Posts
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'posts' && (
        <PostsTab
          posts={userPosts}
          isLoading={isLoading}
          isCurrentUser={true}
        />
      )}
    </Container>
  );
};

export default CurrentUserProfilePage; 