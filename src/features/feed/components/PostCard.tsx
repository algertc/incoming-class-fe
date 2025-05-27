import React, { useState } from 'react';
import { 
  Paper, 
  Avatar, 
  Text, 
  Group, 
  ActionIcon, 
  Image, 
  Box,
  Divider,
  TextInput,
  Menu,
  UnstyledButton,
  Collapse
} from '@mantine/core';
import { 
  IconHeart, 
  IconMessageCircle, 
  IconShare, 
  IconDots,
  IconBookmark,
  IconFlag,
  IconTrash,
  IconSend
} from '@tabler/icons-react';
import { formatDistanceToNow } from 'date-fns';

export interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  images?: string[];
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
  bookmarked?: boolean;
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, comment: string) => void;
  onShare?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onLike, 
  onComment, 
  onShare,
  onBookmark 
}) => {
  const [liked, setLiked] = useState(post.liked || false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(post.bookmarked || false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    if (onLike) onLike(post.id);
  };
  
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    if (onBookmark) onBookmark(post.id);
  };
  
  const handleCommentSubmit = () => {
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText);
      setCommentText('');
    }
  };
  
  const handleShareClick = () => {
    if (onShare) onShare(post.id);
  };

  const formattedTime = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
  
  return (
    <Paper shadow="sm" p="md" radius="md" withBorder mb="md">
      {/* Post Header */}
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar src={post.author.avatar} alt={post.author.name} radius="xl" />
          <Box>
            <Group gap={5}>
              <Text fw={600} size="sm">{post.author.name}</Text>
              {post.author.verified && (
                <Text size="xs" c="blue">✓</Text>
              )}
            </Group>
            <Text size="xs" c="dimmed">{formattedTime}</Text>
          </Box>
        </Group>
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <ActionIcon variant="subtle" color="gray">
              <IconDots size={18} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<IconBookmark size={16} />} onClick={handleBookmark}>
              {bookmarked ? 'Remove bookmark' : 'Bookmark'}
            </Menu.Item>
            <Menu.Item leftSection={<IconFlag size={16} />}>
              Report
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item leftSection={<IconTrash size={16} />} color="red">
              Delete
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      
      {/* Post Content */}
      <Text mb="md">{post.content}</Text>
      
      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <Box mb="md">
          <Image
            src={post.images[0]}
            alt="Post image"
            radius="md"
            fit="cover"
          />
        </Box>
      )}
      
      {/* Post Stats */}
      <Group justify="space-between" mb="xs">
        <Text size="xs" c="dimmed">
          {likesCount} likes • {post.comments} comments • {post.shares} shares
        </Text>
        {bookmarked && <IconBookmark size={16} color="blue" />}
      </Group>
      
      <Divider my="xs" />
      
      {/* Post Actions */}
      <Group>
        <UnstyledButton 
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
          onClick={handleLike}
        >
          <Group gap={5}>
            <IconHeart
              size={20}
              color={liked ? 'red' : 'gray'}
              fill={liked ? 'red' : 'none'}
            />
            <Text size="sm" c={liked ? 'red' : 'dimmed'}>Like</Text>
          </Group>
        </UnstyledButton>
        
        <UnstyledButton 
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
          onClick={() => setShowComments(!showComments)}
        >
          <Group gap={5}>
            <IconMessageCircle size={20} color="gray" />
            <Text size="sm" c="dimmed">Comment</Text>
          </Group>
        </UnstyledButton>
        
        <UnstyledButton 
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
          onClick={handleShareClick}
        >
          <Group gap={5}>
            <IconShare size={20} color="gray" />
            <Text size="sm" c="dimmed">Share</Text>
          </Group>
        </UnstyledButton>
      </Group>
      
      {/* Comments Section */}
      <Collapse in={showComments}>
        <Box mt="md">
          <Divider my="xs" />
          
          {/* Comment Input */}
          <Group align="flex-start" mt="xs">
            <Avatar radius="xl" size="sm" />
            <TextInput
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.currentTarget.value)}
              style={{ flex: 1 }}
              rightSection={
                <ActionIcon 
                  color="blue" 
                  variant="subtle" 
                  onClick={handleCommentSubmit}
                  disabled={!commentText.trim()}
                >
                  <IconSend size={16} />
                </ActionIcon>
              }
            />
          </Group>
          
          {/* Comment List would go here */}
          {post.comments > 0 && (
            <Text size="sm" c="dimmed" mt="md" ta="center">
              View all {post.comments} comments
            </Text>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default PostCard; 