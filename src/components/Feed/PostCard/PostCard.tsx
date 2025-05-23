import React, { useState } from "react";
import {
  Box,
  Text,
  Group,
  Avatar,
  ActionIcon,
  Image,
  Divider,
  TextInput,
  Button,
  Menu,
  useMantineTheme,
  SimpleGrid,
  Tooltip,
} from "@mantine/core";
import {
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconShare,
  IconBookmark,
  IconDots,
  IconSend,
  IconLock,
} from "@tabler/icons-react";
import { useAuthStore } from "../../../store/auth.store";
import { useNavigate } from "react-router";

interface Author {
  id: string;
  name: string;
  avatar: string;
  college: string;
}

interface Post {
  id: string;
  author: Author;
  content: string;
  images: string[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const handleLike = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setLiked(!liked);
  };

  const handleSave = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setSaved(!saved);
  };

  const handleComment = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (comment.trim()) {
      console.log("Adding comment:", comment);
      setComment("");
    }
  };

  const handleShowComments = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setShowComments(!showComments);
  };

  return (
    <Box
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: theme.radius.md,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: theme.spacing.md,
        overflow: "hidden",
      }}
    >
      {/* Post Header - Author info */}
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar
            src={post.author.avatar}
            size="md"
            radius="xl"
            styles={{
              root: {
                border: "2px solid rgba(255, 255, 255, 0.2)",
              },
            }}
          />
          <Box>
            <Text fw={600} size="sm" c={theme.white}>
              {post.author.name}
            </Text>
            <Text size="xs" c="dimmed">
              {post.author.college} • {post.timestamp}
            </Text>
          </Box>
        </Group>
        
        {user && (
          <Menu
            position="bottom-end"
            withArrow
            shadow="md"
            styles={{
              dropdown: {
                backgroundColor: theme.colors.dark[7],
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
              item: {
                color: theme.white,
                "&:hover": {
                  backgroundColor: theme.colors.dark[5],
                },
              },
            }}
          >
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray" radius="xl">
                <IconDots size={18} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>Save post</Menu.Item>
              <Menu.Item>Hide post</Menu.Item>
              <Menu.Item>Follow {post.author.name}</Menu.Item>
              <Menu.Item color="red">Report post</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>

      {/* Post Content */}
      <Text size="sm" c={theme.white} mb="md" style={{ whiteSpace: "pre-wrap" }}>
        {post.content}
      </Text>

      {/* Post Images */}
      {post.images.length > 0 && (
        <Box mb="md">
          {post.images.length === 1 ? (
            <Image
              src={post.images[0]}
              radius="md"
              alt="Post image"
              style={{
                maxHeight: 400,
                width: "100%",
                objectFit: "cover",
              }}
            />
          ) : (
            <SimpleGrid cols={post.images.length > 2 ? 2 : post.images.length}>
              {post.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  radius="md"
                  alt={`Post image ${index + 1}`}
                  style={{
                    height: 200,
                    width: "100%",
                    objectFit: "cover",
                  }}
                />
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}

      {/* Post Actions */}
      <Group justify="space-between" mb="md">
        <Group>
          <Tooltip
            label={user ? "" : "Log in to like posts"}
            disabled={!!user}
            withArrow
            position="top"
          >
            <ActionIcon
              variant="subtle"
              color={liked ? "red" : "gray"}
              onClick={handleLike}
            >
              {liked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
            </ActionIcon>
          </Tooltip>
          <Text size="sm" c="dimmed">
            {liked ? post.likes + 1 : post.likes}
          </Text>
          
          <Tooltip
            label={user ? "" : "Log in to comment"}
            disabled={!!user}
            withArrow
            position="top"
          >
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={handleShowComments}
            >
              <IconMessageCircle size={20} />
            </ActionIcon>
          </Tooltip>
          <Text size="sm" c="dimmed">
            {post.comments}
          </Text>
          
          <Tooltip
            label={user ? "" : "Log in to share"}
            disabled={!!user}
            withArrow
            position="top"
          >
            <ActionIcon 
              variant="subtle" 
              color="gray"
              onClick={() => !user && navigate("/login")}
            >
              <IconShare size={20} />
            </ActionIcon>
          </Tooltip>
          <Text size="sm" c="dimmed">
            {post.shares}
          </Text>
        </Group>
        
        <Tooltip
          label={user ? "" : "Log in to save posts"}
          disabled={!!user}
          withArrow
          position="top"
        >
          <ActionIcon
            variant="subtle"
            color={saved ? "blue" : "gray"}
            onClick={handleSave}
          >
            <IconBookmark size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>

      {/* Comments Section */}
      {showComments && user && (
        <>
          <Divider color="rgba(255, 255, 255, 0.1)" mb="md" />
          
          <Group mb="md" align="flex-start">
            <Avatar
              src={user?.profileImage || "https://i.pravatar.cc/150?img=10"}
              size="sm"
              radius="xl"
            />
            <TextInput
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{ flex: 1 }}
              rightSection={
                <ActionIcon
                  color="blue"
                  disabled={!comment.trim()}
                  onClick={handleComment}
                >
                  <IconSend size={16} />
                </ActionIcon>
              }
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
          
          <Button variant="subtle" color="blue" fullWidth>
            View all {post.comments} comments
          </Button>
        </>
      )}

      {/* Login prompt for comments when user is not authenticated */}
      {showComments && !user && (
        <>
          <Divider color="rgba(255, 255, 255, 0.1)" mb="md" />
          
          <Group justify="center" mb="md">
            <IconLock size={20} color={theme.colors.blue[5]} />
            <Text size="sm" c={theme.white}>
              Log in to view and post comments
            </Text>
          </Group>
          
          <Button 
            variant="filled" 
            color="blue" 
            fullWidth
            onClick={() => navigate("/login")}
          >
            Log In to Interact
          </Button>
        </>
      )}
    </Box>
  );
};

export default PostCard; 