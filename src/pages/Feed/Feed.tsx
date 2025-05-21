import React from 'react';
import { Stack, Group, Text, Avatar, Button, Paper, NavLink } from '@mantine/core';
import { IconHome, IconBookmark, IconHistory, IconSettings } from '@tabler/icons-react';
import PostCard from './components/PostCard/PostCard';
import classes from './Feed.module.css';

// Mock data for development
const MOCK_POSTS = [
  {
    id: '1',
    user: {
      username: 'johndoe',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    location: 'Stanford University',
    images: ['https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'],
    caption: 'Just finished my final project for CS101! 🎓 #coding #stanford #computerscience',
    likes: 1234,
    likedBy: ['janesmith', 'mikebrown'],
    comments: [
      {
        id: '1',
        user: {
          username: 'janesmith',
          avatar: 'https://i.pravatar.cc/150?img=2',
        },
        text: 'Great work! 👏',
      },
      {
        id: '2',
        user: {
          username: 'mikebrown',
          avatar: 'https://i.pravatar.cc/150?img=3',
        },
        text: 'What was your project about?',
      },
    ],
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    user: {
      username: 'janesmith',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    location: 'MIT',
    images: ['https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'],
    caption: 'Working on some exciting research in the lab today! 🔬 #research #mit #science',
    likes: 856,
    likedBy: ['johndoe', 'mikebrown'],
    comments: [
      {
        id: '1',
        user: {
          username: 'johndoe',
          avatar: 'https://i.pravatar.cc/150?img=1',
        },
        text: 'Looks amazing! What are you researching?',
      },
    ],
    timestamp: '4 hours ago',
  },
];

// Mock data for suggested connections
const SUGGESTED_CONNECTIONS = [
  {
    id: '1',
    username: 'alexsmith',
    avatar: 'https://i.pravatar.cc/150?img=4',
    university: 'UC Berkeley',
  },
  {
    id: '2',
    username: 'sarahjones',
    avatar: 'https://i.pravatar.cc/150?img=5',
    university: 'Harvard',
  },
  {
    id: '3',
    username: 'mikebrown',
    avatar: 'https://i.pravatar.cc/150?img=6',
    university: 'MIT',
  },
];

const Feed: React.FC = () => {
  return (
    <div className={classes.feedContainer}>
      <div className={classes.layout}>
        {/* Left Sidebar */}
        <div className={classes.leftSidebar}>
          <Paper className={classes.sidebarCard} radius="md" withBorder>
            <Stack gap="xs">
              <NavLink
                label="Home"
                leftSection={<IconHome size={20} />}
                active
                variant="filled"
                color="blue"
              />
              <NavLink
                label="Saved"
                leftSection={<IconBookmark size={20} />}
                variant="subtle"
                color="blue"
              />
              <NavLink
                label="History"
                leftSection={<IconHistory size={20} />}
                variant="subtle"
                color="blue"
              />
              <NavLink
                label="Settings"
                leftSection={<IconSettings size={20} />}
                variant="subtle"
                color="blue"
              />
            </Stack>
          </Paper>
        </div>

        {/* Main Feed */}
        <div className={classes.mainContent}>
          <Stack gap="md">
            {MOCK_POSTS.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Stack>
        </div>

        {/* Right Sidebar */}
        <div className={classes.rightSidebar}>
          <Paper className={classes.sidebarCard} radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text fw={600} size="lg" className={classes.sidebarTitle}>
                Suggested Connections
              </Text>
              <Button variant="subtle" color="blue" size="xs">
                See All
              </Button>
            </Group>

            <Stack gap="md">
              {SUGGESTED_CONNECTIONS.map((user) => (
                <Group key={user.id} justify="space-between">
                  <Group gap="sm">
                    <Avatar src={user.avatar} radius="xl" size="sm" />
                    <div>
                      <Text size="sm" fw={500}>
                        {user.username}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {user.university}
                      </Text>
                    </div>
                  </Group>
                  <Button variant="light" color="blue" size="xs" radius="xl">
                    Connect
                  </Button>
                </Group>
              ))}
            </Stack>
          </Paper>

          <Paper className={classes.sidebarCard} radius="md" withBorder>
            <Text fw={600} size="lg" mb="md" className={classes.sidebarTitle}>
              Trending Topics
            </Text>
            <Stack gap="xs">
              {['#ComputerScience', '#Research', '#Internship', '#Coding'].map((topic) => (
                <Group key={topic} justify="space-between">
                  <Text size="sm" className={classes.topicText}>{topic}</Text>
                  <Text size="xs" c="dimmed">
                    {Math.floor(Math.random() * 1000)} posts
                  </Text>
                </Group>
              ))}
            </Stack>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Feed; 