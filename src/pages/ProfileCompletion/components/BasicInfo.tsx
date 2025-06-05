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
import { IconBrandInstagram, IconBrandSnapchat } from "@tabler/icons-react";
import { useUpdateCurrentUserProfile } from "../../../hooks/api";
import { ProfileStage } from "../../../models/user.model";
import { profileBasicInfoSchema, profileBasicInfoInitialValues } from "../../../forms";
import { showSuccess, showError } from "../../../utils";
import styles from "./BasicInfo.module.css";

interface BasicInfoProps {
  onComplete: () => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ onComplete }) => {
  const { mutateAsync: updateProfile, isPending } = useUpdateCurrentUserProfile();

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
    <Paper className={styles.container} p="xl" radius="md">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Text className={styles.title} size="lg" fw={600}>
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
              input: styles.input,
            }}
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
              input: styles.input,
            }}
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
              input: styles.input,
              dropdown: styles.dropdown,
              option: styles.item,
            }}
          />

          <Select
            required
            label="University"
            placeholder="Select your university"
            searchable
            data={[
              "Harvard University",
              "Stanford University",
              "MIT",
              "University of California, Berkeley",
              "University of Michigan",
              "New York University",
              "Columbia University",
              "Yale University",
              "Princeton University",
              "Other"
            ]}
            {...form.getInputProps("university")}
            classNames={{
              label: styles.label,
              input: styles.input,
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
              input: styles.input,
              dropdown: styles.dropdown,
              option: styles.item,
            }}
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
              input: styles.input,
              dropdown: styles.dropdown,
              option: styles.item,
            }}
          />

          <Textarea
            required
            label="Short Bio"
            placeholder="Tell us about yourself..."
            minRows={4}
            {...form.getInputProps("bio")}
            classNames={{
              label: styles.label,
              input: styles.input,
            }}
          />

          <Checkbox
            label="Looking for a roommate"
            {...form.getInputProps("lookingForRoommate", { type: "checkbox" })}
            classNames={{
              label: styles.label,
              input: styles.input,
            }}
          />

          <Group justify="center" mt="xl">
            <Button
              type="submit"
              size="lg"
              loading={isPending}
              className={styles.nextButton}
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
