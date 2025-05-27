import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Stepper, 
  Group, 
  Button, 
  Paper,
  Title,
  rem,
  useMantineTheme,
  Box
} from '@mantine/core';
import { IconPhoto, IconUser, IconTags, IconEye, IconCreditCard } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import PhotoUpload from '../../pages/ProfileCompletion/components/PhotoUpload';
import BasicInfo from '../../pages/ProfileCompletion/components/BasicInfo';
import TraitsPreferences from '../../pages/ProfileCompletion/components/TraitsPreferences';
import ProfilePreview from '../../pages/ProfileCompletion/components/ProfilePreview';
import Payment from '../../pages/ProfileCompletion/components/Payment';
import styles from '../../pages/ProfileCompletion/ProfileCompletion.module.css';
import ROUTES from '../../constants/routes';
import { useAuthStore } from '../../store/auth.store';
import { ProfileStage } from '../../models/user.model';
import { withProfileStageGuard } from './withProfileStageGuard';

const ProfileCompletion: React.FC = () => {
  const [active, setActive] = useState(0);
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();

  // Initialize active step based on user's profileStage
  useEffect(() => {
    if (user?.profileStage) {
      switch (user.profileStage) {
        case ProfileStage.UPLOAD_PHOTOS:
          setActive(0);
          break;
        case ProfileStage.ABOUT_YOU:
          setActive(1);
          break;
        case ProfileStage.PREFERENCES:
          setActive(2);
          break;
        case ProfileStage.PROFILE_PREVIEW:
          setActive(3);
          break;
        case ProfileStage.PAYMENT:
          setActive(4);
          break;
        default:
          setActive(0);
      }
    }
  }, [user]);

  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const steps = [
    {
      title: 'Photos',
      description: 'Upload your best photos',
      icon: <IconPhoto style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.UPLOAD_PHOTOS,
    },
    {
      title: 'Basic Info',
      description: 'Tell us about yourself',
      icon: <IconUser style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.ABOUT_YOU,
    },
    {
      title: 'Traits & Preferences',
      description: 'What makes you unique',
      icon: <IconTags style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.PREFERENCES,
    },
    {
      title: 'Preview',
      description: 'See how it looks',
      icon: <IconEye style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.PROFILE_PREVIEW,
    },
    {
      title: 'Payment',
      description: 'Complete your profile',
      icon: <IconCreditCard style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.PAYMENT,
    },
  ];

  // Handle completion of a step
  const handleStepComplete = async (stepIndex: number) => {
    // Update profileStage in the backend based on current step
    // This implementation assumes that the components handle the API calls to update the profile stage
    console.log("step index  : ",stepIndex);
    
    nextStep();
    
    // Refresh user data to get updated profileStage
    await fetchUser();
  };

  // Handle payment completion
  const handlePaymentComplete = async () => {
    // After payment is completed, navigate to app dashboard
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <Box className={styles.container}>
      <Container size="md">
        <Paper className={styles.paper} radius="lg" p="xl">
          <Title order={1} className={styles.title}>
            Complete Your Profile
          </Title>

          <Stepper
            active={active}
            onStepClick={setActive}
            allowNextStepsSelect={false}
            size="md"
            color="blue"
            styles={{
              stepBody: {
                display: 'none',
              },
              stepIcon: {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                color: theme.white,
                '&[data-progress]': {
                  borderColor: theme.colors.blue[6],
                  backgroundColor: theme.colors.blue[6],
                },
              },
              step: {
                '&[data-progress]': {
                  color: theme.white,
                },
              },
              separator: {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                '&[data-active]': {
                  backgroundColor: theme.colors.blue[6],
                },
              },
            }}
          >
            {steps.map((step) => (
              <Stepper.Step
                key={step.title}
                label={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </Stepper>

          <Box mt={40}>
            {active === 0 && <PhotoUpload onComplete={() => handleStepComplete(0)} />}
            {active === 1 && <BasicInfo onComplete={() => handleStepComplete(1)} />}
            {active === 2 && <TraitsPreferences onComplete={() => handleStepComplete(2)} />}
            {active === 3 && <ProfilePreview onComplete={() => handleStepComplete(3)} />}
            {active === 4 && <Payment onComplete={handlePaymentComplete} />}
          </Box>

          <Group justify="space-between" mt="xl">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={active === 0}
              className={styles.backButton}
            >
              Back
            </Button>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
};

// Wrap with the guard HOC
export default withProfileStageGuard(ProfileCompletion); 