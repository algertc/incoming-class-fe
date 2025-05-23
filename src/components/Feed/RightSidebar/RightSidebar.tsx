import React from "react";
import {
  Box,
  Text,
  Stack,
  Group,
  Button,
  Avatar,
  Divider,
  Card,
  Badge,
  useMantineTheme,
} from "@mantine/core";
import {
  IconUserPlus,
  IconCalendarEvent,
  IconMapPin,
  IconClock,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";

export const RightSidebar: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  // Suggested connections
  const suggestedConnections = [
    {
      id: "1",
      name: "Alex Johnson",
      major: "Computer Science",
      college: "Stanford University",
      avatar: "https://i.pravatar.cc/150?img=11",
      mutualConnections: 4,
    },
    {
      id: "2",
      name: "Mia Rodriguez",
      major: "Business Administration",
      college: "UC Berkeley",
      avatar: "https://i.pravatar.cc/150?img=5",
      mutualConnections: 2,
    },
    {
      id: "3",
      name: "David Kim",
      major: "Electrical Engineering",
      college: "MIT",
      avatar: "https://i.pravatar.cc/150?img=8",
      mutualConnections: 6,
    },
  ];

  // Upcoming events
  const upcomingEvents = [
    {
      id: "1",
      title: "Freshman Orientation",
      date: "Aug 25, 2023",
      time: "9:00 AM",
      location: "Main Campus",
      attendees: 156,
    },
    {
      id: "2",
      title: "Tech Career Fair",
      date: "Sep 10, 2023",
      time: "1:00 PM",
      location: "Engineering Building",
      attendees: 89,
    },
  ];

  return (
    <Box
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: theme.radius.md,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: theme.spacing.md,
        position: "sticky",
        top: 100, // Account for header
      }}
    >
      {/* Suggested Connections */}
      <Box mb="xl">
        <Group mb="md">
          <IconUserPlus size={20} color={theme.colors.blue[5]} />
          <Text fw={600} size="sm" c={theme.white}>
            People You May Know
          </Text>
        </Group>

        <Stack gap="md">
          {suggestedConnections.map((connection) => (
            <Box
              key={connection.id}
              style={{
                padding: theme.spacing.sm,
                borderRadius: theme.radius.md,
                backgroundColor: "rgba(255, 255, 255, 0.05)",
              }}
            >
              <Group mb="xs">
                <Avatar
                  src={connection.avatar}
                  radius="xl"
                  size="md"
                  styles={{
                    root: {
                      border: "2px solid rgba(255, 255, 255, 0.2)",
                    },
                  }}
                />
                <Box>
                  <Text fw={600} size="sm" c={theme.white}>
                    {connection.name}
                  </Text>
                  <Text size="xs" c="dimmed" lineClamp={1}>
                    {connection.major} at {connection.college}
                  </Text>
                </Box>
              </Group>

              <Group justify="space-between">
                <Text size="xs" c="dimmed">
                  {connection.mutualConnections} mutual connections
                </Text>
                <Button
                  variant="subtle"
                  color="blue"
                  size="xs"
                  radius="xl"
                  leftSection={<IconUserPlus size={14} />}
                >
                  Connect
                </Button>
              </Group>
            </Box>
          ))}
        </Stack>

        <Button
          variant="light"
          color="blue"
          size="xs"
          fullWidth
          mt="md"
          onClick={() => navigate("/network")}
        >
          View More
        </Button>
      </Box>

      <Divider color="rgba(255, 255, 255, 0.1)" my="md" />

      {/* Upcoming Events */}
      <Box>
        <Group mb="md">
          <IconCalendarEvent size={20} color={theme.colors.blue[5]} />
          <Text fw={600} size="sm" c={theme.white}>
            Upcoming Events
          </Text>
        </Group>

        <Stack gap="md">
          {upcomingEvents.map((event) => (
            <Card
              key={event.id}
              padding="sm"
              radius="md"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Text fw={600} size="sm" c={theme.white} mb="xs">
                {event.title}
              </Text>

              <Group gap="xs" mb="xs">
                <IconClock size={16} color={theme.colors.dark[2]} />
                <Text size="xs" c="dimmed">
                  {event.date} at {event.time}
                </Text>
              </Group>

              <Group gap="xs" mb="xs">
                <IconMapPin size={16} color={theme.colors.dark[2]} />
                <Text size="xs" c="dimmed">
                  {event.location}
                </Text>
              </Group>

              <Group justify="space-between" mt="md">
                <Badge size="sm" variant="dot" color="blue">
                  {event.attendees} attending
                </Badge>
                <Button variant="subtle" color="blue" size="xs">
                  Interested
                </Button>
              </Group>
            </Card>
          ))}
        </Stack>

        <Button
          variant="light"
          color="blue"
          size="xs"
          fullWidth
          mt="md"
          onClick={() => navigate("/events")}
        >
          View All Events
        </Button>
      </Box>
    </Box>
  );
};

export default RightSidebar; 