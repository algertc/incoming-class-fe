import React, { useState, useRef } from 'react';
import { 
  Paper, 
  Avatar, 
  Text, 
  Group, 
  Image, 
  Box,
  SimpleGrid,
  ActionIcon,
  Menu,
  Modal,
  TextInput,
  Textarea,
  Button,
  Stack,
  LoadingOverlay,
  Chip,
  rem,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { 
  IconDots, 
  IconEdit, 
  IconCheck, 
  IconX,
  IconUpload,
  IconPlus,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../store/auth.store';
import { useUpdatePost } from '../../../hooks/api/usePosts';
import { 
  useUploadMultipleImages, 
  createImageFormData, 
  validateImageFiles 
} from '../../../hooks/api/useImageUpload';
import { showSuccess, showError } from '../../../utils';
import ImageCropModal from '../../../pages/ProfileCompletion/components/ImageCropModal';
import { PremiumSubscriptionModal } from '../../../components/common/PremiumSubscriptionModal';

export interface Post {
  id: string;
  title?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    verified?: boolean;
    isSubscribed?: boolean;
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
  isStatic?: boolean; // Controls if the post is interactive or static (for previews)
  hideDots?: boolean; // Controls if the three-dot dropdown should be hidden
}

const PostCard: React.FC<PostCardProps> = ({ post, isStatic = false, hideDots = false }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const updatePostMutation = useUpdatePost();
  const uploadImagesMutation = useUploadMultipleImages();
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [cropModalOpened, setCropModalOpened] = useState(false);
  const [premiumModalOpened, setPremiumModalOpened] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formattedTime = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });
  
  // Check if user is authenticated
  const isAuthenticated = !!user;
  
  // Check if current user is the author of this post
  const isAuthor = user?.id === post.author.id;
  
  // Form for editing post
  const editForm = useForm({
    initialValues: {
      title: post.title || '',
      content: post.content || '',
    },
    validate: {
      title: (value) => (value.trim().length < 3 ? 'Title must be at least 3 characters long' : null),
      content: (value) => (value.trim().length < 10 ? 'Content must be at least 10 characters long' : null),
    },
  });

  // Handle navigation to student profile
  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If user is not authenticated, show premium modal instead
    if (!isAuthenticated) {
      setPremiumModalOpened(true);
      return;
    }
    
    navigate(`/profile/student/${post.author.id}`);
  };

  // Handle post content click
  const handlePostClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If user is not authenticated, show premium modal instead
    if (!isAuthenticated) {
      setPremiumModalOpened(true);
      return;
    }
    
    navigate(`/profile/student/${post.author.id}`);
  };

  // Handle edit post
  const handleEditPost = () => {
    editForm.setValues({
      title: post.title || '',
      content: post.content || '',
    });
    // Initialize with empty preview images - only show new images
    setPreviewImages([]);
    setSelectedFiles([]);
    setEditModalOpened(true);
  };

  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  // Handle files from input or drop
  const handleFiles = (files: File[]) => {
    // Validate files before processing
    const validation = validateImageFiles([...selectedFiles, ...files]);
    if (!validation.isValid) {
      showError(validation.error || 'Invalid files selected');
      return;
    }

    // Process each file one by one with cropping
    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (result) {
            // Open crop modal for the first file
            if (index === 0) {
              setCurrentImageUrl(result as string);
              setCurrentFileIndex(selectedFiles.length);
              setCropModalOpened(true);
            }
            // Add file to selected files
            setSelectedFiles(prev => [...prev, file]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Handle crop complete
  const handleCropComplete = async (croppedImageBlob: Blob) => {
    // Convert blob to File
    const croppedFile = new File([croppedImageBlob], selectedFiles[currentFileIndex].name, {
      type: 'image/jpeg',
    });

    // Update selectedFiles with cropped version
    setSelectedFiles(prev => {
      const newFiles = [...prev];
      newFiles[currentFileIndex] = croppedFile;
      return newFiles;
    });

    // Create preview URL - only add new images to preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        setPreviewImages(prev => [...prev, result as string]);
      }
    };
    reader.readAsDataURL(croppedFile);

    // Check if there are more files to crop
    if (currentFileIndex < selectedFiles.length - 1) {
      // Process next file
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setCurrentImageUrl(result as string);
          setCurrentFileIndex(prev => prev + 1);
          setCropModalOpened(true);
        }
      };
      reader.readAsDataURL(selectedFiles[currentFileIndex + 1]);
    } else {
      // All files processed
      setCropModalOpened(false);
      setCurrentFileIndex(-1);
    }
  };

  // Remove image - only handle new images since we only show new images in edit modal
  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle save edit
  const handleSaveEdit = async (values: { title: string; content: string }) => {
    try {
      let finalImages: string[] = [];

      // Upload new images if any
      if (selectedFiles.length > 0) {
        const formData = createImageFormData(selectedFiles);
        const uploadResponse = await uploadImagesMutation.mutateAsync(formData);
        
        if (uploadResponse.status && uploadResponse.data) {
          // Only use the newly uploaded images
          finalImages = uploadResponse.data;
        }
      }

      await updatePostMutation.mutateAsync({
        postId: post.id,
        updateData: {
          title: values.title,
          content: values.content,
          images: finalImages,
        }
      });
      
      setEditModalOpened(false);
      setPreviewImages([]);
      setSelectedFiles([]);
      editForm.reset();
      showSuccess('Post updated successfully!');
    } catch (error) {
      console.error('Failed to update post:', error);
      showError('Failed to update post. Please try again.');
    }
  };
  
  // Function to determine grid layout based on number of images


  // Function to render images as carousel
  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    // Limit to maximum 3 images
    const limitedImages = post.images.slice(0, 3);
    const imageCount = limitedImages.length;

    // For single image, show it directly without carousel
    if (imageCount === 1) {
      return (
        <Box style={{
        transform: 'translate3d(0,0,0)',
        WebkitTransform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        perspective: '1000px',
        WebkitPerspective: '1000px',
        willChange: 'transform',
      }}>
          <Image
            src={limitedImages[0]}
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

    // For multiple images, use carousel
    return (
      <Box
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <Carousel
          withIndicators={imageCount > 1}
          withControls={imageCount > 1}
          height={300}
          slideSize="100%"
          emblaOptions={{ loop: true }}
          styles={{
            control: {
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              border: 'none',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
              },
            },
            indicator: {
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              '&[data-active]': {
                backgroundColor: 'white',
              },
            },
            indicators: {
              bottom: '10px',
            },
          }}
        >
        {limitedImages.map((imageUrl, index) => (
          <Carousel.Slide key={index}>
            <Box style={{ position: 'relative' }}>
              <Image
                src={imageUrl}
                alt={`Post image ${index + 1}`}
                radius="md"
                fit="cover"
                style={{ 
                  height: '300px',
                  width: '100%',
                  WebkitBackfaceVisibility: 'hidden'
                }}
                loading="lazy"
              />
              {/* Show "+X more" indicator on the last image if there are more images */}
              {index === limitedImages.length - 1 && post.images && post.images.length > 3 && (
                <Box
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    backdropFilter: 'blur(4px)',
                  }}
                  >
                  +{post.images.length - 3} more
                </Box>
              )}
            </Box>
          </Carousel.Slide>
        ))}
        </Carousel>
      </Box>
    );
  };
  
  return (
    <>
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
            onClick={isStatic ? undefined : handleProfileClick}
            style={{
              WebkitBackfaceVisibility: 'hidden',
              cursor: isStatic ? 'default' : 'pointer',
              transition: isStatic ? 'none' : 'transform 0.2s ease',
            }}
            onMouseEnter={isStatic ? undefined : (e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={isStatic ? undefined : (e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
          <Box 
            onClick={isStatic ? undefined : handleProfileClick} 
            style={{ 
              cursor: isStatic ? 'default' : 'pointer',
              transition: isStatic ? 'none' : 'opacity 0.2s ease',
            }}
            onMouseEnter={isStatic ? undefined : (e) => {
              e.currentTarget.style.opacity = '0.8';
            }}
            onMouseLeave={isStatic ? undefined : (e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Group gap={5}>
              <Text 
                fw={600} 
                size="sm" 
                c="white"
                style={{
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  maxWidth: '200px', // Limit width so it doesn't take up too much space
                }}
              >
                {post.author.name}
              </Text>
              {post.author.verified && (
                <Text size="xs" c="blue">✓</Text>
              )}
              {post.author.isSubscribed && (
                <Chip
                  size="xs"
                  variant="filled"
                  color="orange"
                  styles={{
                    root: {
                      background: 'linear-gradient(135deg, #ff6b35 0%, #ff8c42 50%, #ffa500 100%)',
                      border: '1px solid rgba(255, 107, 53, 0.8)',
                      borderRadius: '12px',
                      height: '22px',
                      fontSize: '10px',
                      boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      animation: 'wiggle 0.8s ease-in-out',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        animation: 'shimmer 2s ease-in-out infinite',
                      },
                      '@keyframes wiggle': {
                        '0%, 100%': { transform: 'rotate(0deg)' },
                        '10%': { transform: 'rotate(-3deg) scale(1.05)' },
                        '20%': { transform: 'rotate(3deg) scale(1.05)' },
                        '30%': { transform: 'rotate(-3deg) scale(1.05)' },
                        '40%': { transform: 'rotate(3deg) scale(1.05)' },
                        '50%': { transform: 'rotate(-2deg) scale(1.02)' },
                        '60%': { transform: 'rotate(2deg) scale(1.02)' },
                        '70%': { transform: 'rotate(-1deg) scale(1.01)' },
                        '80%': { transform: 'rotate(1deg) scale(1.01)' },
                        '90%': { transform: 'rotate(0deg) scale(1)' },
                      },
                      '@keyframes shimmer': {
                        '0%': { left: '-100%' },
                        '100%': { left: '100%' },
                      },
                    },
                    label: {
                      color: '#000000',
                      fontWeight: 700,
                      padding: '0 8px',
                      textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                      fontSize: '10px',
                      letterSpacing: '0.5px',
                    },
                  }}
                >
                  🔥 Highly Popular
                </Chip>
              )}
            </Group>
            <Text size="xs" c="dimmed">{formattedTime}</Text>
          </Box>
        </Group>
        
        {/* Edit button - only show for post author and when not static and not hidden */}
        {!isStatic && !hideDots && isAuthor && (
          <Menu shadow="md" width={200} position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon
                variant="filled"
                color="dark"
                size="lg"
                radius="xl"
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <IconDots size={18} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <Menu.Item
                leftSection={<IconEdit size={16} />}
                onClick={handleEditPost}
                style={{ color: 'white' }}
              >
                Edit Post
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
      
      {/* Post Content - Remove main click handler to allow carousel interaction */}
      <Box>
        {/* Post Title - Clickable */}
        {post.title && (
          <Text 
            fw={600} 
            size="lg" 
            c="white" 
            mb="sm"
            onClick={isStatic ? undefined : handlePostClick}
        style={{ 
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              maxWidth: '100%',
              cursor: isStatic ? 'default' : 'pointer',
              transition: isStatic ? 'none' : 'background-color 0.2s ease, transform 0.2s ease',
          borderRadius: '8px',
          padding: '8px',
          margin: '-8px',
        }}
            onMouseEnter={isStatic ? undefined : (e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          e.currentTarget.style.transform = 'translateY(-1px)';
        }}
            onMouseLeave={isStatic ? undefined : (e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
            {post.title}
          </Text>
        )}
        
        {/* Post Content Text - Clickable */}
        <Text 
          mb="md" 
          c="white"
          onClick={isStatic ? undefined : handlePostClick}
          style={{
            wordWrap: 'break-word',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.5,
            maxWidth: '100%',
            cursor: isStatic ? 'default' : 'pointer',
            transition: isStatic ? 'none' : 'background-color 0.2s ease, transform 0.2s ease',
            borderRadius: '8px',
            padding: '8px',
            margin: '-8px',
          }}
          onMouseEnter={isStatic ? undefined : (e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={isStatic ? undefined : (e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {post.content}
        </Text>
        
        {/* Post Images - NOT clickable, allows carousel interaction */}
        {post.images && post.images.length > 0 && (
          <Box mb="md">
            {renderImages()}
          </Box>
        )}
      </Box>
      </Paper>
      
      {/* Modals - only render when not static */}
      {!isStatic && (
        <>
      <Modal
        opened={editModalOpened}
        onClose={() => {
          setEditModalOpened(false);
          setPreviewImages([]);
          setSelectedFiles([]);
          editForm.reset();
        }}
        title="Edit Post"
        size="xl"
        centered
        styles={{
          content: {
            background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          header: {
            backgroundColor: 'transparent',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          },
          title: {
            color: 'white',
            fontSize: rem(18),
            fontWeight: 600,
          },
          close: {
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
        }}
      >
        <LoadingOverlay visible={updatePostMutation.isPending || uploadImagesMutation.isPending} />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
        
        <form onSubmit={editForm.onSubmit(handleSaveEdit)}>
          <Stack gap="md">
            <TextInput
              label="Post Title"
              placeholder="Enter a title for your post"
              {...editForm.getInputProps('title')}
              styles={{
                label: { color: 'white', marginBottom: '8px' },
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:focus': {
                    borderColor: '#3b82f6',
                  },
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              }}
            />
            
            <Textarea
              label="Post Content"
              placeholder="What's on your mind?"
              minRows={4}
              maxRows={8}
              {...editForm.getInputProps('content')}
              styles={{
                label: { color: 'white', marginBottom: '8px' },
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  '&:focus': {
                    borderColor: '#3b82f6',
                  },
                  '&::placeholder': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              }}
            />

            {/* Image Management Section */}
            <Box>
              <Text size="sm" fw={500} c="white" mb="xs">
                Images
              </Text>
              
              {/* Image Upload Area */}
              <Paper
                p="md"
                radius="md"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '2px dashed rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <Group justify="center" gap="sm">
                  <IconUpload size={24} color="rgba(255, 255, 255, 0.7)" />
                  <Text size="sm" c="dimmed">
                    Click to add images or drag and drop
                  </Text>
                </Group>
              </Paper>

              {/* Image Grid */}
              {previewImages.length > 0 && (
                <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm" mt="md">
                  {previewImages.map((image, index) => (
                    <Box key={index} style={{ position: 'relative' }}>
                      <Image
                        src={image}
                        radius="md"
                        fit="cover"
                        style={{ height: '100px' }}
                      />
                      <ActionIcon
                        variant="filled"
                        color="red"
                        size="sm"
                        radius="xl"
                        style={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          zIndex: 10,
                        }}
                        onClick={() => removeImage(index)}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Box>
                  ))}
                  
                  {/* Add more images button */}
                  {previewImages.length < 10 && (
                    <Paper
                      p="md"
                      radius="md"
                      style={{
                        height: '100px',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px dashed rgba(255, 255, 255, 0.2)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => fileInputRef.current?.click()}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                    >
                      <IconPlus size={24} color="rgba(255, 255, 255, 0.7)" />
                    </Paper>
                  )}
                </SimpleGrid>
              )}
            </Box>
            
            <Group justify="flex-end" gap="md">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => {
                  setEditModalOpened(false);
                  setPreviewImages([]);
                  setSelectedFiles([]);
                  editForm.reset();
                }}
                leftSection={<IconX size={16} />}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="gradient"
                gradient={{ from: 'blue', to: 'cyan' }}
                leftSection={<IconCheck size={16} />}
                loading={updatePostMutation.isPending || uploadImagesMutation.isPending}
              >
                Save Changes
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      {/* Image Crop Modal */}
      <ImageCropModal
        opened={cropModalOpened}
        onClose={() => setCropModalOpened(false)}
        imageUrl={currentImageUrl}
        onCropComplete={handleCropComplete}
      />
      
      {/* Premium Subscription Modal for unauthenticated users */}
      <PremiumSubscriptionModal
        opened={premiumModalOpened}
        onClose={() => setPremiumModalOpened(false)}
        trigger="profile-access"
      />
        </>
      )}
    </>
  );
};

export default PostCard;