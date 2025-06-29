import React, { useState } from 'react';
import {
  Modal,
  Stack,
  Group,
  Title,
  Text,
  Button,
  ThemeIcon,
  Box,
  Badge,
  useMantineTheme,
  Alert,
} from '@mantine/core';
import {
  IconSchool,
  IconUsers,
  IconCheck,
  IconSparkles,
  IconInfoCircle,
} from '@tabler/icons-react';
import CollegeSearchSelect from '../../../components/common/CollegeSearchSelect';
import { useFeedStore } from '../../../store/feed.store';

interface CollegeFeedModalProps {
  opened: boolean;
  onClose: () => void;
  mode: 'selection' | 'welcome';
}

const CollegeFeedModal: React.FC<CollegeFeedModalProps> = ({
  opened,
  onClose,
  mode,
}) => {
  const theme = useMantineTheme();
  const { setCollegeWithName, searchPosts, selectedCollegeName } = useFeedStore();
  const [selectedCollege, setSelectedCollege] = useState<{ id: string; name: string } | null>(null);
  const [showCloseWarning, setShowCloseWarning] = useState(false);

  const handleCollegeSelect = (college: { id: string; name: string }) => {
    setSelectedCollege(college);
    setCollegeWithName(college.id, college.name);
    searchPosts('');
  };
  
  const handleAttemptClose = () => {
    if (mode === 'selection' && !selectedCollege) {
      setShowCloseWarning(true);
    } else {
      onClose();
    }
  };

  const isSelectionMode = mode === 'selection';
  const collegeName = selectedCollegeName || 'Your College';

  return (
    <Modal
      opened={opened}
      onClose={handleAttemptClose}
      size="lg"
      centered
      withCloseButton={!isSelectionMode}
      closeOnClickOutside={!isSelectionMode}
      closeOnEscape={!isSelectionMode}
      title={
        <Group>
          <IconSchool size={24} color={isSelectionMode ? theme.colors.yellow[4] : theme.colors.blue[4]} />
          <Title order={3} c="white">
            {isSelectionMode ? "First, Select Your College" : `Welcome to ${collegeName}!`}
          </Title>
        </Group>
      }
      styles={{
        header: {
          backgroundColor: theme.colors.dark[7],
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        body: {
          backgroundColor: theme.colors.dark[7],
          padding: 0,
        },
        content: {
          backgroundColor: theme.colors.dark[7],
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        overlay: {
          backgroundColor: isSelectionMode ? 'rgba(16, 23, 32, 1)' : undefined,
          backdropFilter: isSelectionMode ? 'blur(2px)' : undefined,
        },
      }}
    >
      {isSelectionMode ? (
        <Box p="xl">
          <Stack gap="lg">
            <Text c="dimmed">
              To give you the best experience and connect you with the right people,
              please select your college from the list below.
            </Text>
            <CollegeSearchSelect
              key={selectedCollege ? selectedCollege.id : 'initial'}
              onSelect={handleCollegeSelect}
            />
            {showCloseWarning && (
              <Alert
                icon={<IconInfoCircle size={16} />}
                title="Selection Required"
                color="yellow"
                variant="light"
                onClose={() => setShowCloseWarning(false)}
                withCloseButton
              >
                You must select a college to continue to the feed.
              </Alert>
            )}
            <Button
              fullWidth
              size="md"
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
              disabled={!selectedCollege}
              onClick={onClose}
              leftSection={<IconSparkles size={16} />}
            >
              {selectedCollege ? `Continue to ${selectedCollege.name} Feed` : "Select a College to Continue"}
            </Button>
          </Stack>
        </Box>
      ) : (
      <Box p="xl">
        {/* Decorative gradient background */}
        <Box
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            width: "80px",
            height: "80px",
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0) 70%)",
            borderRadius: "50%",
            filter: "blur(15px)",
            opacity: 0.6,
            zIndex: 0,
          }}
        />

        <Stack gap="lg" style={{ position: 'relative', zIndex: 1 }}>
          {/* College Info */}
          <Box
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              border: '1px solid rgba(59, 130, 246, 0.2)',
            }}
          >
            <Group mb="sm">
              <ThemeIcon
                size="lg"
                radius="md"
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
              >
                <IconSchool size={20} />
              </ThemeIcon>
              <Box>
                <Text fw={600} size="sm" c={theme.white}>
                  {collegeName} Feed
                </Text>
                <Text size="xs" c="dimmed">
                  Connect with your future classmates
                </Text>
              </Box>
              <Badge
                variant="gradient"
                gradient={{ from: "blue", to: "cyan" }}
                size="sm"
                leftSection={<IconSparkles size={12} />}
              >
                Active
              </Badge>
            </Group>

            <Text size="sm" c="white" style={{ lineHeight: 1.6 }}>
              You're now viewing posts from students at <strong>{collegeName}</strong>. 
              This is where you can discover potential roommates, study groups, and friends 
              before your freshman year starts!
            </Text>
          </Box>

          {/* Features */}
          <Stack gap="sm">
            <Text size="sm" fw={500} c={theme.white}>
              What you can do here:
            </Text>
            
            <Group gap="xs" align="flex-start">
              <IconCheck size={16} color={theme.colors.green[4]} style={{ marginTop: 2 }} />
              <Text size="sm" c="gray.3">
                Browse posts from {collegeName} students
              </Text>
            </Group>
            
            <Group gap="xs" align="flex-start">
              <IconCheck size={16} color={theme.colors.green[4]} style={{ marginTop: 2 }} />
              <Text size="sm" c="gray.3">
                Find roommates with similar interests
              </Text>
            </Group>
            
            <Group gap="xs" align="flex-start">
              <IconCheck size={16} color={theme.colors.green[4]} style={{ marginTop: 2 }} />
              <Text size="sm" c="gray.3">
                Join study groups and social circles
              </Text>
            </Group>
            
            <Group gap="xs" align="flex-start">
              <IconUsers size={16} color={theme.colors.blue[4]} style={{ marginTop: 2 }} />
              <Text size="sm" c="gray.3">
                Connect before orientation week
              </Text>
            </Group>
          </Stack>

          {/* Call to Action */}
          <Box
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)',
              borderRadius: theme.radius.md,
              padding: theme.spacing.md,
              border: '1px solid rgba(34, 197, 94, 0.2)',
              textAlign: 'center',
            }}
          >
            <Text size="sm" c="white" mb="sm" fw={500}>
              Ready to start connecting?
            </Text>
            <Text size="xs" c="gray.4" mb="md">
              Sign up to view profiles, send messages, and find your perfect roommate!
            </Text>
            <Button
              variant="gradient"
              gradient={{ from: "green", to: "teal" }}
              size="sm"
              onClick={onClose}
              leftSection={<IconSparkles size={16} />}
            >
              Start Exploring
            </Button>
          </Box>
        </Stack>
      </Box>
      )}
    </Modal>
  );
};

export default CollegeFeedModal; 