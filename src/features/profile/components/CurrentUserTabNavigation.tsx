import React from 'react';
import {
  Paper,
  Tabs,
  useMantineTheme,
  rem,
} from '@mantine/core';
import {
  IconUser,
  IconPhoto,
} from '@tabler/icons-react';
import { glassCardStyles } from '../utils/glassStyles';

interface CurrentUserTabNavigationProps {
  activeTab: string;
  onTabChange: (value: string | null) => void;
}

const CurrentUserTabNavigation: React.FC<CurrentUserTabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const theme = useMantineTheme();

  return (
    <Paper
      p="md"
      mb="lg"
      style={{
        ...glassCardStyles(theme, 'secondary'),
      }}
    >
      <Tabs 
        value={activeTab} 
        onChange={onTabChange}
        color="blue"
        radius="xl"
        variant="pills"
      >
        <Tabs.List style={{ background: 'rgba(255, 255, 255, 0.05)', padding: rem(4), borderRadius: rem(12) }}>
          <Tabs.Tab 
            value="overview" 
            leftSection={<IconUser size={16} />}
            style={{
              fontWeight: 600,
              color: activeTab === 'overview' ? 'white' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: activeTab === 'overview' ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
              backdropFilter: activeTab === 'overview' ? 'blur(10px)' : 'none',
              borderRadius: rem(8),
              transition: 'all 0.3s ease',
            }}
          >
            Overview
          </Tabs.Tab>
          <Tabs.Tab 
            value="posts" 
            leftSection={<IconPhoto size={16} />}
            style={{
              fontWeight: 600,
              color: activeTab === 'posts' ? 'white' : 'rgba(255, 255, 255, 0.7)',
              backgroundColor: activeTab === 'posts' ? 'rgba(59, 130, 246, 0.8)' : 'transparent',
              backdropFilter: activeTab === 'posts' ? 'blur(10px)' : 'none',
              borderRadius: rem(8),
              transition: 'all 0.3s ease',
            }}
          >
            My Posts
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </Paper>
  );
};

export default CurrentUserTabNavigation; 