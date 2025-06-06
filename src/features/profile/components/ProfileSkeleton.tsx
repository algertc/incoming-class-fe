import React from 'react';
import {
  Box,
  Skeleton,
  Stack,
  SimpleGrid,
  useMantineTheme,
  rem,
} from '@mantine/core';
import { glassCardStyles } from '../utils/glassStyles';

interface ProfileSkeletonProps {
  height?: number;
}

export const ProfileComponentSkeleton: React.FC<ProfileSkeletonProps> = ({ height = 200 }) => {
  const theme = useMantineTheme();
  
  return (
    <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
      <Stack gap="md">
        <Skeleton height={24} width="40%" radius="md" />
        <Skeleton height={1} radius="md" />
        <Stack gap="sm">
          <Skeleton height={20} width="25%" radius="md" />
          <Skeleton height={16} width="60%" radius="md" />
          <Skeleton height={20} width="30%" radius="md" />
          <Skeleton height={16} width="75%" radius="md" />
        </Stack>
        {height > 200 && (
          <Stack gap="sm" mt="md">
            <Skeleton height={20} width="35%" radius="md" />
            <SimpleGrid cols={3} spacing="xs">
              <Skeleton height={32} radius="xl" />
              <Skeleton height={32} radius="xl" />
              <Skeleton height={32} radius="xl" />
            </SimpleGrid>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export const ProfileContactSkeleton: React.FC = () => {
  const theme = useMantineTheme();
  
  return (
    <Stack gap="md">
      <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
        <Stack gap="md">
          <Skeleton height={24} width="60%" radius="md" />
          <Skeleton height={1} radius="md" />
          <Stack gap="sm">
            <Skeleton height={16} width="40%" radius="md" />
            <Skeleton height={14} width="70%" radius="md" />
            <Skeleton height={16} width="45%" radius="md" />
            <Skeleton height={14} width="60%" radius="md" />
          </Stack>
        </Stack>
      </Box>
      <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(20) }}>
        <Stack gap="md">
          <Skeleton height={24} width="50%" radius="md" />
          <Skeleton height={1} radius="md" />
          <Stack gap="sm">
            <Skeleton height={16} width="60%" radius="md" />
            <SimpleGrid cols={4} spacing="xs">
              <Skeleton height={28} radius="xl" />
              <Skeleton height={28} radius="xl" />
              <Skeleton height={28} radius="xl" />
              <Skeleton height={28} radius="xl" />
            </SimpleGrid>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}; 