import React, { useState, useEffect } from 'react';
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
  Checkbox,
  LoadingOverlay,
} from '@mantine/core';
import { IconBrandInstagram, IconBrandSnapchat } from '@tabler/icons-react';
import { useForm, yupResolver } from '@mantine/form';
import { useMediaQuery } from '@mantine/hooks';
import { useUpdateCurrentUserProfile } from '../../../hooks/api';
import { useCurrentUser } from '../../../hooks/api';
import { ProfileStage } from '../../../models/user.model';
import { profilePreviewSchema, profilePreviewInitialValues } from '../../../forms';
import { showSuccess, showError } from '../../../utils';
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
  
  const form = useForm({
    initialValues: profilePreviewInitialValues,
    validate: yupResolver(profilePreviewSchema)
  });

  useEffect(() => {
    // If we have user data, use it for the preview
    if (currentUserData?.data) {
      setUserData(currentUserData.data as unknown as ProfileData);
    } else {
      // Otherwise, use mock data
      setUserData({
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
      });
    }
  }, [currentUserData]);

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
      <form 
        onSubmit={form.onSubmit(handleSubmit)}
        style={isMobile ? { height: '100%', display: 'flex', flexDirection: 'column' } : {}}
      >
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

          {/* College Feed Preview */}
          <Paper className={`${styles.previewContainer} ${isMobile ? styles.previewContainerMobile : ''}`} p={isMobile ? "md" : "xl"} radius="md">
            <Text className={`${styles.sectionTitle} ${isMobile ? styles.sectionTitleMobile : ''}`} fw={600}>
              College Feed Preview
            </Text>
            <Stack gap={isMobile ? "sm" : "md"}>
              <Group>
                <Avatar
                  src={userData.profileImage || userData.photos?.[0]}
                  size={isMobile ? "md" : "lg"}
                  radius="xl"
                />
                <div style={{ flex: 1 }}>
                  <Text className={`${styles.userInfo} ${isMobile ? styles.userInfoMobile : ''}`} fw={600}>
                    {userData.instagram}
                  </Text>
                  <Group gap="xs">
                    <Badge color="blue" variant="light" size={isMobile ? "xs" : "sm"}>
                      {userData.major}
                    </Badge>
                    <Badge color="grape" variant="light" size={isMobile ? "xs" : "sm"}>
                      {userData.hometown}
                    </Badge>
                  </Group>
                </div>
              </Group>

              <Text className={`${styles.userInfo} ${isMobile ? styles.userInfoMobile : ''}`} size={isMobile ? "xs" : "sm"}>{userData.bio}</Text>

              <Divider className={styles.divider} />

              <Stack gap="xs">
                <Text className={`${styles.sectionTitle} ${isMobile ? styles.sectionTitleMobile : ''}`} size={isMobile ? "xs" : "sm"}>
                  Lifestyle
                </Text>
                <Group gap="xs">
                  {userData.traits && Object.entries(userData.traits)
                    .filter(([key]) => ['sleepSchedule', 'cleanliness', 'guests', 'studying', 'substances'].includes(key))
                    .map(([key, value]) => (
                      <Badge key={key} color="blue" variant="light" size={isMobile ? "xs" : "sm"}>
                        {value as string}
                      </Badge>
                    ))}
                </Group>
              </Stack>

              <Stack gap="xs">
                <Text className={`${styles.sectionTitle} ${isMobile ? styles.sectionTitleMobile : ''}`} size={isMobile ? "xs" : "sm"}>
                  Interests
                </Text>
                <Group gap="xs">
                  {userData.traits && [
                    ...(userData.traits.personality || []),
                    ...(userData.traits.physicalActivity || []),
                    ...(userData.traits.pastimes || []),
                    ...(userData.traits.food || []),
                  ].slice(0, isMobile ? 6 : undefined).map((trait) => (
                    <Badge key={trait} color="grape" variant="light" size={isMobile ? "xs" : "sm"}>
                      {trait}
                    </Badge>
                  ))}
                  {isMobile && userData.traits && [
                    ...(userData.traits.personality || []),
                    ...(userData.traits.physicalActivity || []),
                    ...(userData.traits.pastimes || []),
                    ...(userData.traits.food || []),
                  ].length > 6 && (
                    <Badge color="gray" variant="light" size="xs">
                      +{[
                        ...(userData.traits.personality || []),
                        ...(userData.traits.physicalActivity || []),
                        ...(userData.traits.pastimes || []),
                        ...(userData.traits.food || []),
                      ].length - 6} more
                    </Badge>
                  )}
                </Group>
              </Stack>

              <Group gap="xs">
                <IconBrandInstagram className={styles.socialIcon} style={{ width: rem(isMobile ? 16 : 20), height: rem(isMobile ? 16 : 20) }} />
                <Text className={`${styles.userInfo} ${isMobile ? styles.userInfoMobile : ''}`} size={isMobile ? "xs" : "sm"}>
                  {userData.instagram}
                </Text>
                {userData.snapchat && (
                  <>
                    <IconBrandSnapchat className={styles.socialIcon} style={{ width: rem(isMobile ? 16 : 20), height: rem(isMobile ? 16 : 20) }} />
                    <Text className={`${styles.userInfo} ${isMobile ? styles.userInfoMobile : ''}`} size={isMobile ? "xs" : "sm"}>
                      {userData.snapchat}
                    </Text>
                  </>
                )}
              </Group>
            </Stack>
          </Paper>

          <Checkbox
            label="I confirm that I have reviewed my profile and it looks good"
            color="blue"
            {...form.getInputProps('reviewConfirmed', { type: 'checkbox' })}
            styles={{ 
              label: { 
                color: 'white',
                fontSize: isMobile ? '12px' : '14px'
              } 
            }}
            size={isMobile ? "sm" : "md"}
          />

          <Group justify="center" mt={isMobile ? "sm" : "xl"}>
            <Button
              type="submit"
              size={isMobile ? "md" : "lg"}
              loading={isSubmitting || isUpdating}
              className={styles.nextButton}
              c="white"
              disabled={!form.values.reviewConfirmed}
              fullWidth={isMobile}
            >
              Continue to Payment
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default ProfilePreview; 