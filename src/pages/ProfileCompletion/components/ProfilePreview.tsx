import React, { useState, useEffect } from 'react';
import {
  Group,
  Button,
  Stack,
  Text,
  Paper,
  Image,
  Box,
  Avatar,
  LoadingOverlay,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useUpdateCurrentUserProfile } from '../../../hooks/api';
import { useCurrentUser } from '../../../hooks/api';
import { ProfileStage } from '../../../models/user.model';
import { showSuccess, showError } from '../../../utils';
import PostCard, { type Post } from '../../../features/feed/components/PostCard';
import styles from './ProfilePreview.module.css';

interface ProfilePreviewProps {
  onComplete: () => void;
}

// Define a type-safe interface for our profile data
interface ProfileData {
  [key: string]: unknown;
  photos?: string[];
  profileImage?: string;
  instagram?: string;
  snapchat?: string;
  major?: string;
  hometown?: string;
  bio?: string;
  traits?: {
    sleepSchedule?: string;
    cleanliness?: string;
    guests?: string;
    studying?: string;
    substances?: string;
    personality?: string[];
    physicalActivity?: string[];
    pastimes?: string[];
    food?: string[];
    other?: string[];
  };
}

const ProfilePreview: React.FC<ProfilePreviewProps> = ({ onComplete }) => {
  const { data: currentUserData, isLoading: isLoadingUser } = useCurrentUser();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateCurrentUserProfile();
  const [userData, setUserData] = useState<ProfileData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    // Only use real user data for the preview
    if (currentUserData?.data) {
      setUserData(currentUserData.data as unknown as ProfileData);
    }
  }, [currentUserData]);

  // Create a mock post for preview using user data
  const createMockPost = (): Post => {
    const name = userData?.instagram?.replace('@', '') || 'John Doe';
    const avatar = userData?.profileImage || userData?.photos?.[0] || 'https://i.pravatar.cc/150?img=1';
    
    // Better image selection for preview
    const getPreviewImages = () => {
      const photos = userData?.photos || [];
      
      if (photos.length === 0) {
        // No photos available - return undefined so PostCard shows text-only post
        return undefined;
      } else if (photos.length === 1) {
        // Single photo - use it (but not the profile image if it's the same)
        return [photos[0]];
      } else if (photos.length === 2) {
        // Two photos - use both
        return photos;
      } else if (photos.length === 3) {
        // Three photos - perfect for grid layout
        return photos;
      } else {
        // More than 3 photos - select a good variety, skip profile image if used as avatar
        const startIndex = userData?.profileImage === photos[0] ? 1 : 0;
        return photos.slice(startIndex, startIndex + 4); // Show up to 4 images
      }
    };
    
    // Create post preview using user's actual bio
    return {
      id: 'preview-post',
      author: {
        id: 'preview-user',
        name: name,
        avatar: avatar,
        verified: false,
      },
      content: userData?.bio || '',
      images: getPreviewImages(),
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Random time within last 24 hours
      likes: Math.floor(Math.random() * 20) + 5, // Random likes between 5-24
      comments: Math.floor(Math.random() * 8) + 2, // Random comments between 2-9
      shares: Math.floor(Math.random() * 5) + 1, // Random shares between 1-5
      isLiked: Math.random() > 0.5, // Random like status
    };
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      
      const data = {
        profileStage: ProfileStage.PAYMENT // Move to next stage
      };
      
      const response = await updateProfile(data);

      if (!response.status) {
        throw new Error(response.errorMessage?.message || 'Failed to update profile stage');
      }
      
      showSuccess("Profile preview confirmed! Moving to payment...");
      onComplete(); // Move to next step in the UI
    } catch (error) {
      showError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingUser || !userData) {
    return <LoadingOverlay visible={true} overlayProps={{ blur: 2 }} />;
  }

  return (
    <Paper 
      className={`${styles.container} ${isMobile ? styles.containerMobile : ''}`} 
      p={isMobile ? "sm" : "xl"} 
      radius="md"
      style={{
        ...(isMobile && {
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        })
      }}
    >
      <LoadingOverlay visible={isSubmitting || isUpdating} overlayProps={{ blur: 2 }} />
        <Stack gap={isMobile ? "sm" : "xl"} style={isMobile ? { flex: 1 } : {}}>
          <Text className={`${styles.title} ${isMobile ? styles.titleMobile : ''}`} size={isMobile ? "md" : "lg"} fw={600}>
            Preview Your Profile
          </Text>

          {/* Instagram Preview */}
          <Paper className={`${styles.previewContainer} ${isMobile ? styles.previewContainerMobile : ''}`} p={isMobile ? "md" : "xl"} radius="md">
            <Text className={`${styles.sectionTitle} ${isMobile ? styles.sectionTitleMobile : ''}`} fw={600}>
              Instagram Preview
            </Text>
            <Box className={`${styles.instagramPreview} ${isMobile ? styles.instagramPreviewMobile : ''}`}>
              <Stack gap={isMobile ? "sm" : "md"}>
                <Group>
                  <Avatar
                    src={userData.profileImage || userData.photos?.[0]}
                    size={isMobile ? "md" : "lg"}
                    radius="xl"
                    style={{ border: '2px solid white' }}
                  />
                  <div>
                    <Text className={`${styles.userInfo} ${isMobile ? styles.userInfoMobile : ''}`} fw={600}>
                      {userData.instagram}
                    </Text>
                    <Text className={`${styles.userInfo} ${isMobile ? styles.userInfoMobile : ''}`} size={isMobile ? "xs" : "sm"}>
                      {userData.major} • {userData.hometown}
                    </Text>
                  </div>
                </Group>
                <Text className={`${styles.userInfo} ${isMobile ? styles.userInfoMobile : ''}`} size={isMobile ? "xs" : "sm"}>{userData.bio}</Text>
                <div className={`${styles.photoGrid} ${isMobile ? styles.photoGridMobile : ''}`}>
                  {(userData.photos || []).map((photo, index) => (
                    <Image
                      key={index}
                      src={photo}
                      className={`${styles.photo} ${isMobile ? styles.photoMobile : ''}`}
                    />
                  ))}
                </div>
              </Stack>
            </Box>
          </Paper>

        {/* College Feed Preview - Using consistent PostCard component from feed */}
        <Box>
          <Text className={`${styles.sectionTitle} ${isMobile ? styles.sectionTitleMobile : ''}`} fw={600} mb={isMobile ? "sm" : "md"}>
              College Feed Preview
            </Text>
          <Text size={isMobile ? "xs" : "sm"} c="dimmed" mb={isMobile ? "sm" : "md"}>
            This is how your posts will appear to other students in the college feed
                  </Text>
          <PostCard post={createMockPost()} />
        </Box>

          <Group justify="center" mt={isMobile ? "sm" : "xl"}>
            <Button
            onClick={handleSubmit}
              size={isMobile ? "md" : "lg"}
              loading={isSubmitting || isUpdating}
              className={styles.nextButton}
              c="white"
              fullWidth={isMobile}
            >
              Continue to Payment
            </Button>
          </Group>
        </Stack>
    </Paper>
  );
};

export default ProfilePreview; 