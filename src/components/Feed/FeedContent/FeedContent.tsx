import React, { useState } from "react";
import {
  Box,
  Stack,
  Group,
  Avatar,
  TextInput,
  Button,
  ActionIcon,
  Skeleton,
  useMantineTheme,
  Text,
} from "@mantine/core";
import {
  IconPhoto,
  IconVideo,
  IconCalendarEvent,
  IconSend,
  IconLock,
} from "@tabler/icons-react";
import { PostCard } from "../PostCard/PostCard";
import { useAuthStore } from "../../../store/auth.store";

interface FeedContentProps {
  loading: boolean;
}

// Mock data for posts
const MOCK_POSTS = [
  {
    id: "1",
    author: {
      id: "101",
      name: "Emily Chen",
      avatar: "https://i.pravatar.cc/150?img=1",
      college: "Stanford University",
    },
    content:
      "Just moved into my dorm at Stanford! The campus is absolutely beautiful. Can't wait to meet everyone and start this journey! #NewBeginnings #CollegeLife",
    images: ["https://picsum.photos/seed/post1/600/400"],
    timestamp: "2 hours ago",
    likes: 42,
    comments: 8,
    shares: 3,
  },
  {
    id: "2",
    author: {
      id: "102",
      name: "Marcus Johnson",
      avatar: "https://i.pravatar.cc/150?img=4",
      college: "MIT",
    },
    content:
      "Study group for Calculus 101 meeting in the library at 7 PM tonight. Anyone want to join? We'll be covering the material from last week's lecture. #StudyGroup #Calculus",
    images: [],
    timestamp: "5 hours ago",
    likes: 15,
    comments: 12,
    shares: 1,
  },
  {
    id: "3",
    author: {
      id: "103",
      name: "Sophia Williams",
      avatar: "https://i.pravatar.cc/150?img=5",
      college: "UC Berkeley",
    },
    content:
      "Our robotics team just won first place at the national competition! So proud of everyone's hard work and dedication. Check out our winning robot! #Robotics #Competition #Winning",
    images: [
      "https://picsum.photos/seed/post3a/600/400",
      "https://picsum.photos/seed/post3b/600/400",
    ],
    timestamp: "1 day ago",
    likes: 128,
    comments: 32,
    shares: 24,
  },
];

export const FeedContent: React.FC<FeedContentProps> = ({ loading }) => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const [postContent, setPostContent] = useState("");

  const handleCreatePost = () => {
    // In a real app, this would send the post to the backend
    console.log("Creating post:", postContent);
    setPostContent("");
  };

  return (
    <Box>
      {/* Post creation card - only for authenticated users */}
      {user ? (
        <Box
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            borderRadius: theme.radius.md,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: theme.spacing.md,
            marginBottom: theme.spacing.lg,
          }}
        >
          <Group mb="md" align="flex-start">
            <Avatar
              src={user?.profileImage || "https://i.pravatar.cc/150?img=10"}
              size="md"
              radius="xl"
              styles={{
                root: {
                  border: "2px solid rgba(255, 255, 255, 0.2)",
                },
              }}
            />
            <TextInput
              placeholder="Share something with your network..."
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              style={{ flex: 1 }}
              styles={{
                input: {
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: theme.white,
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: theme.radius.md,
                  "&::placeholder": {
                    color: theme.colors.dark[2],
                  },
                  "&:focus": {
                    borderColor: theme.colors.blue[5],
                  },
                },
              }}
            />
          </Group>

          <Group justify="space-between">
            <Group>
              <ActionIcon
                variant="subtle"
                color="blue"
                radius="xl"
                size="lg"
                title="Add Photo"
              >
                <IconPhoto size={20} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="blue"
                radius="xl"
                size="lg"
                title="Add Video"
              >
                <IconVideo size={20} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="blue"
                radius="xl"
                size="lg"
                title="Add Event"
              >
                <IconCalendarEvent size={20} />
              </ActionIcon>
            </Group>
            <Button
              color="blue"
              radius="md"
              disabled={!postContent.trim()}
              onClick={handleCreatePost}
              rightSection={<IconSend size={16} />}
            >
              Post
            </Button>
          </Group>
        </Box>
      ) : (
        <Box
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            borderRadius: theme.radius.md,
            border: "1px solid rgba(255, 255, 255, 0.1)",
            padding: theme.spacing.md,
            marginBottom: theme.spacing.lg,
            textAlign: "center",
          }}
        >
          <Group align="center" justify="center" gap="md">
            <IconLock size={24} color={theme.colors.blue[5]} />
            <Text c={theme.white} fw={500}>
              Log in to share your own posts and interact with others
            </Text>
          </Group>
        </Box>
      )}

      {/* Feed title */}
      <Box mb="xl">
        <Text size="xl" fw={700} c={theme.white}>
          Latest Posts
        </Text>
      </Box>

      {/* Feed posts */}
      <Stack gap="xl">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Box
              key={index}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                backdropFilter: "blur(10px)",
                borderRadius: theme.radius.md,
                border: "1px solid rgba(255, 255, 255, 0.1)",
                padding: theme.spacing.md,
              }}
            >
              <Group mb="md">
                <Skeleton height={40} circle />
                <Box style={{ flex: 1 }}>
                  <Skeleton height={12} width="40%" mb={8} />
                  <Skeleton height={8} width="20%" />
                </Box>
              </Group>
              <Skeleton height={12} mb={8} />
              <Skeleton height={12} mb={8} />
              <Skeleton height={12} width="80%" mb={16} />
              <Skeleton height={200} mb={16} />
              <Group>
                <Skeleton height={24} width={80} />
                <Skeleton height={24} width={80} />
                <Skeleton height={24} width={80} />
              </Group>
            </Box>
          ))
        ) : (
          // Actual posts
          MOCK_POSTS.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </Stack>
    </Box>
  );
};

export default FeedContent; 