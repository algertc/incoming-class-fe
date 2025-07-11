import React, { useState } from "react";
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
  IconBuildingBank,
  IconPhoto,
  IconUser,
  IconTags,
  IconEye,
  IconCreditCard,
} from "@tabler/icons-react";
import CollegeSelectStep from "../../pages/ProfileCompletion/components/CollegeSelectStep";
import PhotoUpload from "../../pages/ProfileCompletion/components/PhotoUpload";
import BasicInfo from "../../pages/ProfileCompletion/components/BasicInfo";
import TraitsPreferences from "../../pages/ProfileCompletion/components/TraitsPreferences";
import ProfilePreview from "../../pages/ProfileCompletion/components/ProfilePreview";
import Payment from "../../pages/ProfileCompletion/components/Payment";
import styles from "../../pages/ProfileCompletion/ProfileCompletion.module.css";
import { useAuthStore } from "../../store/auth.store";
import { ProfileStage } from "../../models/user.model";
import { withProfileStageGuard } from "./withProfileStageGuard";
import { useUpdateCurrentUserProfile } from "../../hooks/api";
import { ScrollToTop } from "../../components/common";
import { showError } from "../../utils";

const stageToIndex = {
  [ProfileStage.COLLEGE_SELECTION]: 0,
  [ProfileStage.UPLOAD_PHOTOS]: 1,
  [ProfileStage.ABOUT_YOU]: 2,
  [ProfileStage.PREFERENCES]: 3,
  [ProfileStage.PROFILE_PREVIEW]: 4,
  [ProfileStage.PAYMENT]: 5,
};

const indexToStage: Record<number, ProfileStage> = {
  0: ProfileStage.COLLEGE_SELECTION,
  1: ProfileStage.UPLOAD_PHOTOS,
  2: ProfileStage.ABOUT_YOU,
  3: ProfileStage.PREFERENCES,
  4: ProfileStage.PROFILE_PREVIEW,
  5: ProfileStage.PAYMENT,
};

const ProfileCompletion: React.FC = () => {
  const [isNavigating, setIsNavigating] = useState(false);
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const { mutateAsync: updateProfile } = useUpdateCurrentUserProfile();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Get current active step from user's profileStage - single source of truth
  const currentStage = user?.profileStage || ProfileStage.COLLEGE_SELECTION;
  const active = stageToIndex[currentStage];

  const prevStep = async () => {
    if (active === 0 || isNavigating) return;

    setIsNavigating(true);
    try {
      const newStage = indexToStage[active - 1];
      const response = await updateProfile({
        profileStage: newStage,
      });

      if (!response.status) {
        throw new Error(
          response.errorMessage?.message || "Failed to update profile stage"
        );
      }
    } catch (error) {
      console.error("Error navigating back:", error);
      showError("Failed to go back. Please try again.");
    } finally {
      setIsNavigating(false);
    }
  };

  const steps = [
    {
      title: "College",
      mobileTitle: "College",
      description: "Select your college",
      icon: <IconBuildingBank style={{ width: rem(18), height: rem(18) }} />,
      stage: ProfileStage.COLLEGE_SELECTION,
    },
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

  return (
    <Box className={styles.container}>
      <ScrollToTop />
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
                  minHeight: 0,
                  height: "calc(100vh - 200px)",
                }),
              }}
            >
              {active === 0 && <CollegeSelectStep />}
              {active === 1 && <PhotoUpload />}
              {active === 2 && <BasicInfo />}
              {active === 3 && <TraitsPreferences />}
              {active === 4 && <ProfilePreview />}
              {active === 5 && <Payment />}
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
              disabled={active === 0 || isNavigating}
              className={styles.backButton}
              size={isMobile ? "md" : "lg"}
              loading={isNavigating}
            >
              Back
            </Button>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
};

export default withProfileStageGuard(ProfileCompletion);
