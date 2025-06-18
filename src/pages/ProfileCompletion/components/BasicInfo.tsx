import React from "react";
import {
  TextInput,
  Select,
  Textarea,
  Checkbox,
  Group,
  Button,
  Stack,
  Text,
  rem,
  Paper,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrandInstagram, IconBrandSnapchat } from "@tabler/icons-react";
import { useUpdateCurrentUserProfile } from "../../../hooks/api";
import { ProfileStage } from "../../../models/user.model";
import { profileBasicInfoSchema, profileBasicInfoInitialValues } from "../../../forms";
import { showSuccess, showError } from "../../../utils";
import CollegeSearchSelect from "./CollegeSearchSelect";
import styles from "./BasicInfo.module.css";

interface BasicInfoProps {
  onComplete: () => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ onComplete }) => {
  const { mutateAsync: updateProfile, isPending } = useUpdateCurrentUserProfile();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const form = useForm({
    initialValues: profileBasicInfoInitialValues,
    validate: yupResolver(profileBasicInfoSchema)
  });

  const handleSubmit = async (values: typeof form.values) => {
    try {
      const profileData={...values,collegeGraduationYear:values.batch,profileStage:ProfileStage.PREFERENCES}
      const response = await updateProfile(profileData);

      if (!response.status) {
        throw new Error(response.errorMessage?.message || 'Failed to update profile');
      }
      console.log("form stage 1 , ",values);
      

      showSuccess("Profile information saved successfully!");
      onComplete(); // Move to next step in the UI
    } catch (error) {
      showError((error as Error).message);
    }
  };

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
      <form onSubmit={form.onSubmit(handleSubmit)} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Stack gap={isMobile ? "xs" : "md"} style={{ flex: 1 }}>
          <Text className={`${styles.title} ${isMobile ? styles.titleMobile : ''}`} size={isMobile ? "md" : "lg"} fw={600}>
            Tell Us About Yourself
          </Text>

          <TextInput
            required
            label="Instagram Handle"
            placeholder="@username"
            leftSection={
              <IconBrandInstagram style={{ width: rem(16), height: rem(16) }} />
            }
            {...form.getInputProps("instagram")}
            classNames={{
              label: styles.label,
              input: `${styles.input} ${isMobile ? styles.inputMobile : ''}`,
            }}
            size={isMobile ? "sm" : "md"}
          />

          <TextInput
            label="Snapchat Handle"
            placeholder="@username"
            leftSection={
              <IconBrandSnapchat style={{ width: rem(16), height: rem(16) }} />
            }
            {...form.getInputProps("snapchat")}
            classNames={{
              label: styles.label,
              input: `${styles.input} ${isMobile ? styles.inputMobile : ''}`,
            }}
            size={isMobile ? "sm" : "md"}
          />

          <Select
            required
            label="Major"
            placeholder="Select your major"
            data={[
              "Computer Science",
              "Business",
              "Engineering",
              "Psychology",
              "Biology",
              "Mathematics",
              "Economics",
              "Marketing",
              "Political Science",
              "Communications",
              "Education",
              "Other",
            ]}
            {...form.getInputProps("major")}
            classNames={{
              label: styles.label,
              input: `${styles.input} ${isMobile ? styles.inputMobile : ''}`,
              dropdown: styles.dropdown,
              option: styles.item,
            }}
            size={isMobile ? "sm" : "md"}
          />

                    <CollegeSearchSelect
            label="University"
            placeholder="Select your university"
            value={form.values.university}
            onChange={(value) => form.setFieldValue("university", value)}
            error={typeof form.errors.university === 'string' ? form.errors.university : undefined}
            required
            size={isMobile ? "sm" : "md"}
            classNames={{
              label: styles.label,
              input: `${styles.input} ${isMobile ? styles.inputMobile : ''}`,
              dropdown: styles.dropdown,
              option: styles.item,
            }}
          />

          <Select
            required
            label="Batch/Year"
            placeholder="Select your year"
            data={[
              "2024",
              "2025",
              "2026", 
              "2027",
              "2028"
            ]}
            {...form.getInputProps("batch")}
            classNames={{
              label: styles.label,
              input: `${styles.input} ${isMobile ? styles.inputMobile : ''}`,
              dropdown: styles.dropdown,
              option: styles.item,
            }}
            size={isMobile ? "sm" : "md"}
          />

          <Select
            required
            label="Hometown"
            placeholder="Select your state"
            searchable
            data={[
              "Alabama",
              "Alaska",
              "Arizona",
              "Arkansas",
              "California",
              "Colorado",
              "Connecticut",
              "Delaware",
              "Florida",
              "Georgia",
              "Hawaii",
              "Idaho",
              "Illinois",
              "Indiana",
              "Iowa",
              "Kansas",
              "Kentucky",
              "Louisiana",
              "Maine",
              "Maryland",
              "Massachusetts",
              "Michigan",
              "Minnesota",
              "Mississippi",
              "Missouri",
              "Montana",
              "Nebraska",
              "Nevada",
              "New Hampshire",
              "New Jersey",
              "New Mexico",
              "New York",
              "North Carolina",
              "North Dakota",
              "Ohio",
              "Oklahoma",
              "Oregon",
              "Pennsylvania",
              "Rhode Island",
              "South Carolina",
              "South Dakota",
              "Tennessee",
              "Texas",
              "Utah",
              "Vermont",
              "Virginia",
              "Washington",
              "West Virginia",
              "Wisconsin",
              "Wyoming",
            ]}
            {...form.getInputProps("hometown")}
            classNames={{
              label: styles.label,
              input: `${styles.input} ${isMobile ? styles.inputMobile : ''}`,
              dropdown: styles.dropdown,
              option: styles.item,
            }}
            size={isMobile ? "sm" : "md"}
          />

          <Textarea
            required
            label="Short Bio"
            placeholder="Tell us about yourself..."
            minRows={isMobile ? 3 : 4}
            {...form.getInputProps("bio")}
            classNames={{
              label: styles.label,
              input: `${styles.input} ${isMobile ? styles.inputMobile : ''}`,
            }}
            size={isMobile ? "sm" : "md"}
          />

          <Checkbox
            label="Looking for a roommate"
            {...form.getInputProps("lookingForRoommate", { type: "checkbox" })}
            classNames={{
              label: styles.label,
              input: styles.input,
            }}
            size={isMobile ? "sm" : "md"}
          />

          <Group justify="center" mt={isMobile ? "md" : "xl"} mb={isMobile ? "sm" : 0}>
            <Button
              type="submit"
              size={isMobile ? "md" : "lg"}
              loading={isPending}
              className={styles.nextButton}
              fullWidth={isMobile}
            >
              Next Step
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default BasicInfo;
