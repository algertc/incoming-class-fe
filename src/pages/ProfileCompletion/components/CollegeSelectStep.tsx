import React, { useState } from "react";
import { Paper, Stack, Button, Text, LoadingOverlay } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import CollegeSearchSelect from "./CollegeSearchSelect";
import { useUpdateCurrentUserProfile } from "../../../hooks/api";
import { useAuthStore } from "../../../store/auth.store";
import { ProfileStage } from "../../../models/user.model";
import { showError, showSuccess } from "../../../utils";
import styles from "./BasicInfo.module.css";

const CollegeSelectStep: React.FC = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { mutateAsync: updateProfile, isPending } = useUpdateCurrentUserProfile();
  const { user } = useAuthStore();
  const initialCollegeName = (() => {
    if (!user?.college) return "";
    return typeof user.college === "string"
      ? user.college
      : user.college.name ?? "";
  })();

  const [collegeName, setCollegeName] = useState<string>(initialCollegeName);
  const [collegeId, setCollegeId] = useState<string | undefined>(
    typeof user?.college === "object" ? user.college.id ?? user.college._id : undefined
  );
  const [submitting, setSubmitting] = useState(false);

  const handleCollegeChange = (name: string, id?: string) => {
    setCollegeName(name);
    setCollegeId(id);
  };

  const handleNext = async () => {
    if (!collegeName && !collegeId) {
      showError("Please select your college before proceeding.");
      return;
    }
    try {
      setSubmitting(true);
      const response = await updateProfile({
        college: collegeId ?? collegeName,
        university: collegeName,
        profileStage: ProfileStage.UPLOAD_PHOTOS,
      });
      
      if (!response.status) {
        throw new Error(response.errorMessage?.message || "Failed to save college");
      }
      
      showSuccess("College saved successfully!");
    } catch (err) {
      showError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const loading = submitting || isPending;

  return (
    <Paper
      className={`${styles.container} ${isMobile ? styles.containerMobile : ""}`}
      p={isMobile ? "sm" : "xl"}
      radius="md"
      style={isMobile ? { height: "100%", display: "flex", flexDirection: "column" } : {}}
    >
      <LoadingOverlay visible={loading} overlayProps={{ blur: 2 }} />
      <Stack gap={isMobile ? "sm" : "md"} style={{ flex: 1 }}>
        <Text c="white" className={`${styles.title} ${isMobile ? styles.titleMobile : ""}`} size={isMobile ? "md" : "lg"} fw={600}>
          Select Your College
        </Text>
        <CollegeSearchSelect
          label="University"
          placeholder="Search and select your university"
          value={collegeName}
          onChange={handleCollegeChange}
          required
          size={isMobile ? "sm" : "md"}
          classNames={{
            label: styles.label,
            input: `${styles.input} ${isMobile ? styles.inputMobile : ""}`,
            dropdown: styles.dropdown,
            option: styles.item,
          }}
        />
        <Button
          onClick={handleNext}
          size={isMobile ? "md" : "lg"}
          className={styles.nextButton}
          loading={loading}
          c="white"
          fullWidth={isMobile}
          mt="md"
        >
          Next Step
        </Button>
      </Stack>
    </Paper>
  );
};

export default CollegeSelectStep; 