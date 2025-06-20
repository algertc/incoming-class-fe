import React, { useState, useEffect } from "react";
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
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconPhoto,
  IconUser,
  IconTags,
  IconEye,
  IconCreditCard,
} from "@tabler/icons-react";
// import { useNavigate } from "react-router";
import PhotoUpload from "../../pages/ProfileCompletion/components/PhotoUpload";
import BasicInfo from "../../pages/ProfileCompletion/components/BasicInfo";
import TraitsPreferences from "../../pages/ProfileCompletion/components/TraitsPreferences";
import ProfilePreview from "../../pages/ProfileCompletion/components/ProfilePreview";
import Payment from "../../pages/ProfileCompletion/components/Payment";
import styles from "../../pages/ProfileCompletion/ProfileCompletion.module.css";
// import ROUTES from "../../constants/routes";
import { useAuthStore } from "../../store/auth.store";
import { ProfileStage } from "../../models/user.model";
import { withProfileStageGuard } from "./withProfileStageGuard";

const ProfileCompletion: React.FC = () => {
  const [active, setActive] = useState(0);
  const theme = useMantineTheme();
  // const navigate = useNavigate();
  const { user, fetchUser } = useAuthStore();
  const isMobile = useMediaQuery("(max-width: 768px)");

  console.log("show active step", active);
  

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

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () => {
    console.log('Back button clicked, current step:', active);
    setActive((current) => {
      const newStep = current > 0 ? current - 1 : current;
      console.log('Moving to step:', newStep);
      return newStep;
    });
    // Refresh user data when navigating back to ensure forms are pre-filled
    fetchUser();
  };

  const steps = [
    {
      title: "Photos",
      mobileTitle: "Photos",
      description: "Upload your best photos",
      icon: <IconPhoto style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.UPLOAD_PHOTOS,
    },
    {
      title: "Basic Info",
      mobileTitle: "Info",
      description: "Tell us about yourself",
      icon: <IconUser style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.ABOUT_YOU,
    },
    {
      title: "Traits & Preferences",
      mobileTitle: "Traits",
      description: "What makes you unique",
      icon: <IconTags style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.PREFERENCES,
    },
    {
      title: "Preview",
      mobileTitle: "Preview",
      description: "See how it looks",
      icon: <IconEye style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.PROFILE_PREVIEW,
    },
    {
      title: "Payment",
      mobileTitle: "Pay",
      description: "Complete your profile",
      icon: <IconCreditCard style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.PAYMENT,
    },
  ];

  // Handle completion of a step
  const handleStepComplete = async (stepIndex: number) => {
    // Update profileStage in the backend based on current step
    // This implementation assumes that the components handle the API calls to update the profile stage
    console.log("step index  : ", stepIndex);

    nextStep();

    // Refresh user data to get updated profileStage
    await fetchUser();
  };

  return (
    <Box className={styles.container}>
      <Container
        size={isMobile ? "sm" : "xl"}
        px={isMobile ? "md" : "xl"}
        style={{ width: "100%", maxWidth: isMobile ? "100%" : "1100px" }}
      >
        <Paper
          className={`${styles.paper} ${isMobile ? styles.paperMobile : ""}`}
          radius="lg"
        >
          <Title
            order={1}
            className={`${styles.title} ${isMobile ? styles.titleMobile : ""}`}
          >
            Complete Your Profile
          </Title>

          <Stepper
            active={active}
            allowNextStepsSelect={false}
            size={isMobile ? "xs" : "lg"}
            color="blue"
            styles={{
              stepBody: {
                display: "none",
              },
              stepIcon: {
                borderColor: "rgba(255, 255, 255, 0.2)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: theme.white,
                ...(isMobile && {
                  width: "28px",
                  height: "28px",
                  minWidth: "28px",
                  fontSize: "12px",
                }),
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "[data-progress]": {
                  borderColor: theme.colors.blue[6],
                  backgroundColor: theme.colors.blue[6],
                },
              },
              step: {
                "[data-progress]": {
                  color: theme.white,
                },
              },
              separator: {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                height: "2px",
                margin: isMobile ? "0 8px" : "0 8px",
                "[data-active]": {
                  backgroundColor: theme.colors.blue[6],
                },
              },
              stepLabel: {
                fontSize: isMobile ? "10px" : "14px",
                fontWeight: 500,
                color: "white",
                marginTop: isMobile ? "4px" : "8px",
              },
              stepDescription: {
                fontSize: isMobile ? "8px" : "12px",
                color: "rgba(255, 255, 255, 0.6)",
                marginTop: "2px",
              },
            }}
            className={isMobile ? styles.stepperMobile : ""}
          >
            {steps.map((step) => (
              <Stepper.Step
                key={step.title}
                label={isMobile ? step.mobileTitle : step.title}
                description={isMobile ? "" : step.description}
                icon={
                  isMobile
                    ? React.cloneElement(step.icon, {
                        style: {
                          width: 12,
                          height: 12,
                        },
                      })
                    : step.icon
                }
              />
            ))}
          </Stepper>

          <div
            className={isMobile ? styles.contentMobile : styles.contentWrapper}
          >
            <Box
              mt={isMobile ? 10 : 50}
              p={isMobile ? "sm" : "xl"}
              style={{
                ...(isMobile && {
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  minHeight: 0, // Allow flexbox to shrink
                  height: "calc(100vh - 200px)", // Fixed height for mobile
                }),
              }}
            >
              {active === 0 && (
                <PhotoUpload onComplete={() => handleStepComplete(0)} />
              )}
              {active === 1 && (
                <BasicInfo onComplete={() => handleStepComplete(1)} />
              )}
              {active === 2 && (
                <TraitsPreferences onComplete={() => handleStepComplete(2)} />
              )}
              {active === 3 && (
                <ProfilePreview onComplete={() => handleStepComplete(3)} />
              )}
              {active === 4 && <Payment />}
            </Box>
          </div>

          <Group
            justify="space-between"
            mt="xl"
            className={isMobile ? styles.navigationMobile : ""}
          >
            <Button
              variant="outline"
              onClick={prevStep}
              // disabled={active == 0}
              className={styles.backButton}
              size={isMobile ? "md" : "lg"}
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
