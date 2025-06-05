import React, { useState } from 'react';
import { 
  Container, 
  Stepper, 
  Group, 
  Button, 
  Paper,
  Title,
  rem,
  useMantineTheme,
  Box,
  Text
} from '@mantine/core';
import { IconPhoto, IconUser, IconTags, IconEye, IconCreditCard } from '@tabler/icons-react';
import { useNavigate } from 'react-router';
import PhotoUpload from './components/PhotoUpload';
import BasicInfo from './components/BasicInfo';
import TraitsPreferences from './components/TraitsPreferences';
import ProfilePreview from './components/ProfilePreview';
import Payment from './components/Payment';
import styles from './ProfileCompletion.module.css';
import ROUTES from '../../constants/routes';

const ProfileCompletion: React.FC = () => {
  const [active, setActive] = useState(0);
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const nextStep = () => setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

  const steps = [
    {
      title: 'Photos',
      description: 'Upload your best photos',
      icon: <IconPhoto style={{ width: rem(18), height: rem(18) }} />,
    },
    {
      title: 'Basic Info',
      description: 'Tell us about yourself',
      icon: <IconUser style={{ width: rem(18), height: rem(18) }} />,
    },
    {
      title: 'Traits & Preferences',
      description: 'What makes you unique',
      icon: <IconTags style={{ width: rem(18), height: rem(18) }} />,
    },
    {
      title: 'Preview',
      description: 'See how it looks',
      icon: <IconEye style={{ width: rem(18), height: rem(18) }} />,
    },
    {
      title: 'Payment',
      description: 'Complete your profile',
      icon: <IconCreditCard style={{ width: rem(18), height: rem(18) }} />,
    },
  ];

  const handlePaymentComplete = () => {
    // After payment is completed, navigate to app dashboard
    navigate(ROUTES.DASHBOARD);
  };

  const getStepTitle = () => {
    return steps[active].title;
  };

  const getStepDescription = () => {
    return steps[active].description;
  };

  return (
    <Box className={styles.container}>
      <Container size="lg" className={styles.innerContainer}>
        <Paper className={styles.paper} radius="lg">
          <Title order={1} className={styles.title}>
            Complete Your Profile
          </Title>
          
          <Text className={styles.subtitle}>
            Let's create your amazing profile in just a few steps
          </Text>

          <Stepper
            active={active}
            onStepClick={setActive}
            allowNextStepsSelect={false}
            size="md"
            color="blue"
            className={styles.stepper}
            styles={{
              stepBody: {
                display: active < 4 ? 'none' : 'flex',
              },
              stepIcon: {
                borderColor: 'rgba(255, 255, 255, 0.2)',
                backgroundColor: 'rgba(20, 20, 30, 0.6)',
                color: theme.white,
                '&[data-progress]': {
                  borderColor: theme.colors.blue[6],
                  backgroundColor: theme.colors.blue[6],
                },
                '&[data-completed]': {
                  borderColor: theme.colors.blue[5],
                  backgroundColor: theme.colors.blue[5],
                },
              },
              step: {
                padding: '0 10px',
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
          
          <Box className={styles.stepHeader}>
            <Title order={2} className={styles.stepTitle}>{getStepTitle()}</Title>
            <Text className={styles.stepDescription}>{getStepDescription()}</Text>
          </Box>

          <Box className={styles.contentWrapper}>
            <Box className={styles.stepContent}>
              {active === 0 && <PhotoUpload onComplete={nextStep} />}
              {active === 1 && <BasicInfo onComplete={nextStep} />}
              {active === 2 && <TraitsPreferences onComplete={nextStep} />}
              {active === 3 && <ProfilePreview onComplete={nextStep} />}
              {active === 4 && <Payment onComplete={handlePaymentComplete} />}
            </Box>
          </Box>

          <Group justify="space-between" className={styles.navigation}>
            <Button
              variant="filled"
              onClick={prevStep}
              disabled={active === 0}
              className={styles.backButton}
              size="lg"
              radius="md"
              color="cyan"
             
            >
              Back
            </Button>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfileCompletion; 