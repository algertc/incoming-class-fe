import React from 'react';
import {
  SimpleGrid,
  Card,
  ThemeIcon,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  IconEye,
  IconUsers,
  IconPhoto,
} from '@tabler/icons-react';
import { glassCardStyles } from '../utils/glassStyles';

interface StatsData {
  profileViews: number;
  connections: number;
  posts: number;
}

interface ModernStatsCardsProps {
  stats: StatsData;
}

const ModernStatsCards: React.FC<ModernStatsCardsProps> = ({ stats }) => {
  const theme = useMantineTheme();

  const statsConfig = [
    { icon: IconEye, label: 'Views', value: stats.profileViews, color: 'blue' },
    { icon: IconUsers, label: 'Connections', value: stats.connections, color: 'grape' },
    { icon: IconPhoto, label: 'Posts', value: stats.posts, color: 'orange' },
  ];

  return (
    <SimpleGrid cols={3} spacing="xs" mb="lg">
      {statsConfig.map((stat, index) => (
        <Card
          key={index}
          p="md"
          style={{
            ...glassCardStyles(theme, 'secondary'),
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <ThemeIcon
            size="lg"
            radius="xl"
            variant="light"
            color={stat.color}
            mb="xs"
            mx="auto"
            style={{
              background: `rgba(${stat.color === 'blue' ? '59, 130, 246' : stat.color === 'grape' ? '147, 51, 234' : '249, 115, 22'}, 0.2)`,
              backdropFilter: 'blur(10px)',
            }}
          >
            <stat.icon size={20} />
          </ThemeIcon>
          <Text fw={700} size="xl" c="white">{stat.value}</Text>
          <Text size="xs" c="dimmed">{stat.label}</Text>
        </Card>
      ))}
    </SimpleGrid>
  );
};

export default ModernStatsCards; 