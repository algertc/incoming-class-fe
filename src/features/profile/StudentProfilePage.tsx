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
import { useParams } from 'react-router';
import type { Post } from '../../features/feed/components/PostCard';

// Component imports
import ProfileBanner from './components/ProfileBanner';
import AcademicInfo from './components/AcademicInfo';
import TraitsPreferences from './components/TraitsPreferences';
import InterestsCard from './components/InterestsCard';
import ContactInfo from './components/ContactInfo';
import BioCard from './components/BioCard';
import PostsTab from './components/PostsTab';

const StudentProfilePage: React.FC = () => {
  const theme = useMantineTheme();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock student posts data - in a real app, this would come from an API based on the student ID
  const [studentPosts] = useState<Post[]>([
    {
      id: 'student-post-1',
      author: {
        id: id || 'student-id',
        name: 'Rachel Rose',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        verified: true
      },
      content: 'Just finished my ML project! This semester has been intense but so worth it. #MachineLearning #CS',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      likes: 28,
      comments: 5,
      shares: 2
    },
    {
      id: 'student-post-2',
      author: {
        id: id || 'student-id',
        name: 'Rachel Rose',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
        verified: true
      },
      content: 'Looking for study partners for the upcoming finals week! Anyone in CS350 want to form a group?',
      images: ['https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop'],
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      likes: 42,
      comments: 12,
      shares: 3
    }
  ]);
  
  // This would fetch the profile data of the student with the given ID in a real application
  useEffect(() => {
    // Example: Fetch user profile data based on id
    console.log(`Fetching profile for user ID: ${id}`);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  // Mock data for the student profile
  const mockProfileData = {
    coverImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2000&auto=format&fit=crop',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
    name: 'Rachel Rose',
    academic: {
      major: 'Computer Science',
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
      hometown: 'California',
      country: 'USA'
    },
    contact: {
      email: 'rachel.rose@university.edu',
      instagram: '@rachelrose',
      snapchat: '@rrose',
    },
    bio: 'Computer Science student passionate about AI and machine learning. I enjoy hiking, photography, and exploring new places in my spare time.',
    lookingForRoommate: true
  };

  // Create the profile data object
  const profileData = {
    ...mockProfileData,
    designation: mockProfileData.academic.major ? `${mockProfileData.academic.major} Student` : 'University Student'
  };

  // Render the overview tab content
  const renderOverviewTab = () => (
    <Grid gutter="md">
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack>
          <BioCard 
            bio={profileData.bio}
            isEditable={false}
          />
          <AcademicInfo 
            major={profileData.academic.major}
            university={profileData.academic.university}
            batch={profileData.academic.batch}
            hometown={profileData.location.hometown}
            lookingForRoommate={profileData.lookingForRoommate}
            isEditable={false}
          />
          <TraitsPreferences 
            sleepSchedule={profileData.traits.sleepSchedule}
            cleanliness={profileData.traits.cleanliness}
            guests={profileData.traits.guests}
            studying={profileData.traits.studying}
            substances={profileData.traits.substances}
            personality={profileData.personality}
            isEditable={false}
          />
        </Stack>
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack>
          <ContactInfo 
            hometown={profileData.location.hometown}
            country={profileData.location.country}
            email={profileData.contact.email}
            instagram={profileData.contact.instagram}
            snapchat={profileData.contact.snapchat}
            isEditable={false}
          />
          <InterestsCard 
            physicalActivity={profileData.physicalActivity}
            pastimes={profileData.pastimes}
            food={profileData.food}
            isEditable={false}
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
        isCurrentUser={false}
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
          posts={studentPosts}
          isLoading={isLoading}
          isCurrentUser={false}
          userName={profileData.name}
        />
      )}
    </Container>
  );
};

export default StudentProfilePage; 