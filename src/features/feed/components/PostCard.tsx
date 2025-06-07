import React from 'react';
import { 
  Paper, 
  Avatar, 
  Text, 
  Group, 
  Image, 
  Box,
  SimpleGrid,
  Overlay,
} from '@mantine/core';
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
  isLiked: boolean;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post 
}) => {
  const formattedTime = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
  
  // Function to determine grid layout based on number of images
  const getImageGridProps = (imageCount: number) => {
    if (imageCount === 1) {
      return { cols: 1 };
    } else if (imageCount === 2) {
      return { cols: 2 };
    } else if (imageCount === 3) {
      return { cols: { base: 1, sm: 2 } }; // 1 on mobile, 2 on larger screens
    } else {
      return { cols: { base: 2, sm: 2 } }; // 2x2 grid
    }
  };

  // Function to render images with Instagram-style overflow handling
  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    const imageCount = post.images.length;
    const maxDisplayImages = 4;
    const imagesToShow = imageCount > maxDisplayImages ? maxDisplayImages : imageCount;
    const remainingImages = imageCount - 3; // Show "+X more" after 3rd image

    if (imageCount === 1) {
      // Single image - full width
      return (
        <Image
          src={post.images[0]}
          alt="Post image"
          radius="md"
          fit="cover"
          style={{ maxHeight: '400px' }}
        />
      );
    }

    // Multiple images - grid layout
    return (
      <SimpleGrid
        {...getImageGridProps(imagesToShow)}
        spacing="xs"
      >
        {post.images.slice(0, imagesToShow).map((imageUrl, index) => {
          const isLastImage = index === imagesToShow - 1;
          const shouldShowOverlay = isLastImage && imageCount > maxDisplayImages;
          
          return (
            <Box key={index} style={{ position: 'relative' }}>
              <Image
                src={imageUrl}
                alt={`Post image ${index + 1}`}
                radius="md"
                fit="cover"
                style={{ 
                  height: imageCount === 2 ? '200px' : '150px',
                  width: '100%'
                }}
              />
              {shouldShowOverlay && (
                <Overlay
                  color="#000"
                  opacity={0.6}
                  radius="md"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Text
                    size="lg"
                    fw={600}
                    c="white"
                    style={{ fontSize: '1.5rem' }}
                  >
                    +{remainingImages}
                  </Text>
                </Overlay>
              )}
            </Box>
          );
        })}
      </SimpleGrid>
    );
  };
  
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
      </Group>
      
      {/* Post Content */}
      <Text mb="md">{post.content}</Text>
      
      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <Box mb="md">
          {renderImages()}
        </Box>
      )}
    </Paper>
  );
};

export default PostCard; 