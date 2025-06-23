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
import { useNavigate } from 'react-router';

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

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const formattedTime = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
  
  // Handle navigation to student profile
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/student/${post.author.id}`);
  };

  // Handle post content click
  const handlePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/profile/student/${post.author.id}`);
  };

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

  // Function to render images with optimized loading
  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    const imageCount = post.images.length;
    const maxDisplayImages = 4;
    const imagesToShow = imageCount > maxDisplayImages ? maxDisplayImages : imageCount;
    const remainingImages = imageCount - 3;

    if (imageCount === 1) {
      return (
        <Box       style={{
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        perspective: '1000px',
        WebkitPerspective: '1000px',
        willChange: 'transform',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
          <Image
            src={post.images[0]}
            alt="Post image"
            radius="md"
            fit="cover"
            style={{ 
              maxHeight: '400px',
              WebkitBackfaceVisibility: 'hidden'
            }}
            loading="lazy"
          />
        </Box>
      );
    }

    return (
      <SimpleGrid
        {...getImageGridProps(imagesToShow)}
        spacing="xs"
      >
        {post.images.slice(0, imagesToShow).map((imageUrl, index) => {
          const isLastImage = index === imagesToShow - 1;
          const shouldShowOverlay = isLastImage && imageCount > maxDisplayImages;
          
          return (
            <Box 
              key={index} 
              style={{ 
                position: 'relative',
                transform: 'translate3d(0,0,0)',
                WebkitTransform: 'translate3d(0,0,0)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                perspective: '1000px',
                WebkitPerspective: '1000px',
                willChange: 'transform'
              }}
            >
              <Image
                src={imageUrl}
                alt={`Post image ${index + 1}`}
                radius="md"
                fit="cover"
                style={{ 
                  height: imageCount === 2 ? '200px' : '150px',
                  width: '100%',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                loading="lazy"
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
                    cursor: 'pointer',
                    transform: 'translate3d(0,0,0)',
                    WebkitTransform: 'translate3d(0,0,0)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
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
    <Paper 
      shadow="sm" 
      p="md" 
      radius="md" 
      withBorder 
      mb="md"
      style={{
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        perspective: '1000px',
        WebkitPerspective: '1000px',
        willChange: 'transform',
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Post Header */}
      <Group justify="space-between" mb="md">
        <Group>
          <Avatar 
            src={post.author.avatar} 
            alt={post.author.name} 
            radius="xl"
            onClick={handleProfileClick}
            style={{
              WebkitBackfaceVisibility: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
          <Box 
            onClick={handleProfileClick} 
            style={{ 
              cursor: 'pointer',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Group gap={5}>
              <Text fw={600} size="sm" c="white">{post.author.name}</Text>
              {post.author.verified && (
                <Text size="xs" c="blue">✓</Text>
              )}
            </Group>
            <Text size="xs" c="dimmed">{formattedTime}</Text>
          </Box>
        </Group>
      </Group>
      
      {/* Post Content - Clickable */}
      <Box 
        onClick={handlePostClick} 
        style={{ 
          cursor: 'pointer',
          transition: 'background-color 0.2s ease, transform 0.2s ease',
          borderRadius: '8px',
          padding: '8px',
          margin: '-8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        <Text mb="md" c="white">{post.content}</Text>
        
        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <Box mb="md">
            {renderImages()}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default PostCard;