import React, { useState } from 'react';
import {
  Text,
  Group,
  ActionIcon,
  Button,
  Select,
  Card,
  ThemeIcon,
  Title,
  Divider,
  Grid,
  Badge,
  useMantineTheme,
  Box,
  TextInput,
  Modal,
  Stack,
  Spoiler,
} from '@mantine/core';
import { IconSchool, IconEdit, IconCheck, IconX } from '@tabler/icons-react';
import { useForm, yupResolver } from '@mantine/form';
import * as yup from 'yup';

const majors = [
  "Computer Science", "Business", "Engineering", "Psychology",
  "Biology", "Mathematics", "Economics", "Marketing",
  "Political Science", "Communications", "Education", "Other",
];
const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
];

interface AcademicInfoProps {
  major: string;
  university: string;
  hometown: string;
    lookingForRoommate: boolean;
  isEditable: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}

const academicSchema = yup.object().shape({
  major: yup.string().required('Major is required'),
  hometown: yup.string().required('Hometown is required'),
});

const AcademicInfo: React.FC<AcademicInfoProps> = ({
  major,
  university,
  hometown,
  lookingForRoommate,
  isEditable,
  isEditing,
  onEdit,
  onSave,
  onCancel,
}) => {
  const theme = useMantineTheme();
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: { major, hometown },
    validate: yupResolver(academicSchema),
  });

  React.useEffect(() => {
    form.setValues({ major, hometown });
  }, [major, hometown, isEditing]);

  const handleSave = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) {
      return;
    }
    await onSave(form.values);
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  const selectStyles = {
    label: { color: 'white', fontWeight: 500 },
    input: {
      backgroundColor: theme.colors.dark[6],
      borderColor: theme.colors.dark[4],
      color: 'white',
      '&:focus': {
        borderColor: theme.colors.indigo[5],
      },
    },
    dropdown: {
      backgroundColor: theme.colors.dark[6],
      borderColor: theme.colors.dark[4],
    },
    item: {
      '&[data-selected]': {
        backgroundColor: theme.colors.indigo[6],
      },
      '&[data-hovered]': {
        backgroundColor: theme.colors.dark[5],
      },
    },
  };
  
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder bg={theme.colors.dark[7]} style={{ borderColor: theme.colors.dark[5] }}>
      <Group mb="md" justify="space-between">
        <Group>
          <ThemeIcon size="lg" radius="md" color="indigo">
            <IconSchool size={20} />
          </ThemeIcon>
          <Title order={4} c="white">Academic Information</Title>
        </Group>
        {isEditable && !isEditing && (
          <ActionIcon
            color="indigo"
            variant="light"
            onClick={onEdit}
          >
            <IconEdit size={18} />
          </ActionIcon>
        )}
        {isEditing && (
          <Group gap="xs">
            <ActionIcon
              color="green"
              variant="light"
              onClick={handleSave}
            >
              <IconCheck size={18} />
            </ActionIcon>
            <ActionIcon
              color="red"
              variant="light"
              onClick={handleCancel}
            >
              <IconX size={18} />
            </ActionIcon>
          </Group>
        )}
      </Group>
      <Divider mb="md" color={theme.colors.dark[5]} />
      
      {isEditing ? (
        <Box>
          <Grid>
            <Grid.Col span={6}>
              <Box onClick={() => setModalOpened(true)} style={{ cursor: 'not-allowed' }}>
              <TextInput
                  label="University"
                  value={university}
                  disabled
                  styles={{ ...selectStyles, input: { ...selectStyles.input, pointerEvents: 'none' } }}
                />
              </Box>
              <Select
                label="Major"
                placeholder="Select major"
                data={majors}
                {...form.getInputProps('major')}
                styles={selectStyles}
                mt="sm"
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select
                label="Hometown"
                placeholder="Select state"
                data={states}
                searchable
                {...form.getInputProps('hometown')}
                styles={selectStyles}
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={handleCancel}>
              Cancel
            </Button>
            <Button color="indigo" onClick={handleSave}>
              Save Changes
            </Button>
          </Group>
        </Box>
      ) : (
        <Grid>
          <Grid.Col span={6}>
            <Text fw={500} size="sm" c="white">University</Text>
            <Text c="gray.4" mb="sm">{university}</Text>
            
            <Text fw={500} size="sm" c="white">Major</Text>
            <Text c="gray.4" mb="sm">{major}</Text>
          </Grid.Col>
          
          <Grid.Col span={6}>
            <Text fw={500} size="sm" c="white">Hometown</Text>
            <Text c="gray.4" mb="sm">{hometown}</Text>
          </Grid.Col>
          
          {lookingForRoommate && (
            <Grid.Col span={12}>
              <Badge size="lg" color="teal" variant="light" mt="md">
                Looking for roommate
              </Badge>
            </Grid.Col>
          )}
        </Grid>
      )}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Title order={4}>Heads Up!</Title>}
        centered
        styles={{
          title: { color: theme.white },
          header: { backgroundColor: theme.colors.dark[7] },
          content: { backgroundColor: theme.colors.dark[7], color: theme.white },
          body: { paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.sm },
        }}
      >
        <Stack>
          <Text>
            To change your college, you’ll need to create a new account.
            Your profile is tied to your current school, so switching requires starting fresh.
          </Text>
          
          <Spoiler maxHeight={0} showLabel="Why?" hideLabel="Hide">
            <Text c="dimmed" size="sm">
              To keep everything organized and accurate, each account is linked to a single school. 
              If you’ve committed to a new university, just sign up again with your new school info!
            </Text>
          </Spoiler>

          <Button onClick={() => setModalOpened(false)} color="indigo" mt="md">
            OK
          </Button>
        </Stack>
      </Modal>
    </Card>
  );
};

export default AcademicInfo; 