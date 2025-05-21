import React from 'react';
import {
  Card,
  Group,
  Avatar,
  Text,
  ActionIcon,
  Image,
  Badge,
  Button,
} from '@mantine/core';
import {
  IconHeart,
  IconHeartFilled,
  IconBookmark,
  IconMapPin,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import classes from './PostCard.module.css';

interface PostCardProps {
  post: {
    id: string;
    user: {
      username: string;
      avatar: string;
    };
    location?: string;
    images: string[];
    caption: string;
    likes: number;
    likedBy: string[];
    comments: {
      id: string;
      user: {
        username: string;
        avatar?: string;
      };
      text: string;
    }[];
    timestamp: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [liked, { toggle }] = useDisclosure(false);

  const handleLike = () => {
    toggle();
  };

  // Convert post data to badges
  const badges = [
    { emoji: '🎓', label: post.location || 'University' },
    { emoji: '❤️', label: `${post.likes} likes` },
    { emoji: '💬', label: `${post.comments.length} comments` },
  ];

  const features = badges.map((badge) => (
    <Badge variant="light" key={badge.label} leftSection={badge.emoji}>
      {badge.label}
    </Badge>
  ));

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      {/* Post Header */}
      <Card.Section className={classes.section}>
        <Group justify="space-between">
          <Group gap="sm">
            <Avatar src={post.user.avatar} radius="xl" size="sm" />
            <div>
              <Text fw={500} size="sm" className={classes.username}>
                {post.user.username}
              </Text>
              {post.location && (
                <Group gap={4}>
                  <IconMapPin size={12} className={classes.locationIcon} />
                  <Text size="xs" c="dimmed">
                    {post.location}
                  </Text>
                </Group>
              )}
            </div>
          </Group>
          <ActionIcon variant="subtle" color="gray">
            <IconBookmark size={16} />
          </ActionIcon>
        </Group>
      </Card.Section>

      {/* Post Image */}
      <Card.Section>
        <Image
          src={post.images[0]}
          height={400}
          alt={post.caption}
          className={classes.image}
        />
      </Card.Section>

      {/* Post Content */}
      <Card.Section className={classes.section} mt="md">
        <Group justify="space-between">
          <Text fz="lg" fw={500} className={classes.username}>
            {post.user.username}
          </Text>
          <Badge size="sm" variant="light">
            {post.timestamp}
          </Badge>
        </Group>
        <Text fz="sm" mt="xs" className={classes.caption}>
          {post.caption}
        </Text>
      </Card.Section>

      {/* Badges Section */}
      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Post Details
        </Text>
        <Group gap={7} mt={5}>
          {features}
        </Group>
      </Card.Section>

      {/* Action Buttons */}
      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }} variant="light" color="blue">
          View Comments
        </Button>
        <ActionIcon
          variant={liked ? "filled" : "light"}
          color={liked ? "red" : "blue"}
          radius="md"
          size={36}
          onClick={handleLike}
        >
          {liked ? <IconHeartFilled size={20} /> : <IconHeart size={20} />}
        </ActionIcon>
      </Group>
    </Card>
  );
};

export default PostCard; 