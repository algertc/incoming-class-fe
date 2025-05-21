import React from 'react';
import {
  Group,
  Button,
  Stack,
  Text,
  rem,
  Paper,
  Image,
  Box,
  Avatar,
  Divider,
  Badge,
} from '@mantine/core';
import { IconBrandInstagram, IconBrandSnapchat } from '@tabler/icons-react';
import styles from './ProfilePreview.module.css';

interface ProfilePreviewProps {
  onComplete: () => void;
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ onComplete }) => {
  // Mock data - replace with actual data from your state management
  const mockProfile = {
    photos: [
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D',
    ],
    instagram: '@johndoe',
    snapchat: '@johndoe',
    major: 'Computer Science',
    hometown: 'California',
    bio: 'Passionate about technology and design. Love hiking and photography. Always up for new adventures!',
    traits: {
      sleepSchedule: 'Night Owl',
      cleanliness: 'Neat Freak',
      guests: 'Over Whenever',
      studying: 'Around Campus',
      substances: 'Fine with Drinking',
      personality: ['Extrovert', 'Creative', 'Adventurous'],
      physicalActivity: ['Working Out', 'Basketball'],
      pastimes: ['Art', 'Fashion', 'Video Games'],
      food: ['Coffee', 'Sushi'],
      other: ['Studying Abroad', 'Looking for a Roommate'],
    },
  };

  return (
    <Stack gap="xl">
      <Text className={styles.title} size="lg" fw={600}>
        Preview Your Profile
      </Text>

      {/* Instagram Preview */}
      <Paper className={styles.previewContainer} p="xl" radius="md">
        <Text className={styles.sectionTitle} fw={600}>
          Instagram Preview
        </Text>
        <Box className={styles.instagramPreview}>
          <Stack gap="md">
            <Group>
              <Avatar
                src={mockProfile.photos[0]}
                size="lg"
                radius="xl"
                style={{ border: '2px solid white' }}
              />
              <div>
                <Text className={styles.userInfo} fw={600}>
                  {mockProfile.instagram}
                </Text>
                <Text className={styles.userInfo} size="sm">
                  {mockProfile.major} • {mockProfile.hometown}
                </Text>
              </div>
            </Group>
            <Text className={styles.userInfo}>{mockProfile.bio}</Text>
            <div className={styles.photoGrid}>
              {mockProfile.photos.map((photo, index) => (
                <Image
                  key={index}
                  src={photo}
                  className={styles.photo}
                />
              ))}
            </div>
          </Stack>
        </Box>
      </Paper>

      {/* College Feed Preview */}
      <Paper className={styles.previewContainer} p="xl" radius="md">
        <Text className={styles.sectionTitle} fw={600}>
          College Feed Preview
        </Text>
        <Stack gap="md">
          <Group>
            <Avatar
              src={mockProfile.photos[0]}
              size="lg"
              radius="xl"
            />
            <div style={{ flex: 1 }}>
              <Text className={styles.userInfo} fw={600}>
                {mockProfile.instagram}
              </Text>
              <Group gap="xs">
                <Badge color="blue" variant="light">
                  {mockProfile.major}
                </Badge>
                <Badge color="grape" variant="light">
                  {mockProfile.hometown}
                </Badge>
              </Group>
            </div>
          </Group>

          <Text className={styles.userInfo}>{mockProfile.bio}</Text>

          <Divider className={styles.divider} />

          <Stack gap="xs">
            <Text className={styles.sectionTitle} size="sm">
              Lifestyle
            </Text>
            <Group gap="xs">
              {Object.entries(mockProfile.traits)
                .filter(([key]) => ['sleepSchedule', 'cleanliness', 'guests', 'studying', 'substances'].includes(key))
                .map(([key, value]) => (
                  <Badge key={key} color="blue" variant="light">
                    {value}
                  </Badge>
                ))}
            </Group>
          </Stack>

          <Stack gap="xs">
            <Text className={styles.sectionTitle} size="sm">
              Interests
            </Text>
            <Group gap="xs">
              {[
                ...mockProfile.traits.personality,
                ...mockProfile.traits.physicalActivity,
                ...mockProfile.traits.pastimes,
                ...mockProfile.traits.food,
              ].map((trait) => (
                <Badge key={trait} color="grape" variant="light">
                  {trait}
                </Badge>
              ))}
            </Group>
          </Stack>

          <Group gap="xs">
            <IconBrandInstagram className={styles.socialIcon} style={{ width: rem(20), height: rem(20) }} />
            <Text className={styles.userInfo} size="sm">
              {mockProfile.instagram}
            </Text>
            {mockProfile.snapchat && (
              <>
                <IconBrandSnapchat className={styles.socialIcon} style={{ width: rem(20), height: rem(20) }} />
                <Text className={styles.userInfo} size="sm">
                  {mockProfile.snapchat}
                </Text>
              </>
            )}
          </Group>
        </Stack>
      </Paper>

      <Group justify="center" mt="xl">
        <Button
          size="lg"
          onClick={onComplete}
          className={styles.nextButton}
        >
          Continue to Payment
        </Button>
      </Group>
    </Stack>
  );
};

export default ProfilePreview; 