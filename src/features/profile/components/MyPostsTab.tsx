import React, { useState, useRef } from 'react';
import {
  Box,
  Stack,
  Text,
  Button,
  Paper,
  Skeleton,
  Center,
  Group,
  ActionIcon,
  Menu,
  Modal,
  Textarea,
  useMantineTheme,
  rem,
  LoadingOverlay,
  SimpleGrid,
  Image,
} from '@mantine/core';
import { 
  IconPhoto, 
  IconDots, 
  IconEdit, 
  IconRocket, 
  IconPlus,
  IconCheck,
  IconX,
  IconSparkles,
  IconUpload,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { modals } from '@mantine/modals';
import { useUserPosts, useUpdatePost, useBoostPost } from '../../../hooks/api';
import { 
  useUploadMultipleImages, 
  createImageFormData, 
  validateImageFiles 
} from '../../../hooks/api/useImageUpload';
import { showSuccess, showError } from '../../../utils';
import PostCard from '../../feed/components/PostCard';
import type { Post } from '../../feed/components/PostCard';
import { glassCardStyles } from '../utils/glassStyles';
import ImageCropModal from '../../../pages/ProfileCompletion/components/ImageCropModal';


const MyPostsTab: React.FC = () => {
  const theme = useMantineTheme();
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [currentEditPost, setCurrentEditPost] = useState<Post | null>(null);
  const [cropModalOpened, setCropModalOpened] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hooks for API operations
  const { data: userPostsResponse, isLoading, error, refetch } = useUserPosts({ page: 1, limit: 50 });
  const updatePostMutation = useUpdatePost();
  const uploadImagesMutation = useUploadMultipleImages();
  const boostPostMutation = useBoostPost();

  // Form for editing posts
  const editForm = useForm({
    initialValues: {
      title: '',
      content: '',
    },
    validate: {
      title: (value) => (value.trim().length < 3 ? 'Title must be at least 3 characters long' : null),
      content: (value) => (value.trim().length < 10 ? 'Content must be at least 10 characters long' : null),
    },
  });

  const posts = userPostsResponse?.data?.posts || [];

  // Handle edit post
  const handleEditPost = (post: Post) => {
    setCurrentEditPost(post);
    editForm.setValues({ 
      title: post.title || '',
      content: post.content 
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
    if (!currentEditPost) return;

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
      console.log("finalImages",finalImages);
      
      await updatePostMutation.mutateAsync({
        postId: currentEditPost.id,
        updateData: { 
          title: values.title,
          content: values.content,
          images: finalImages
        }
      });
      setEditModalOpened(false);
      setCurrentEditPost(null);
      setPreviewImages([]);
      setSelectedFiles([]);
      editForm.reset();
      showSuccess('Post updated successfully!');
    } catch (error) {
      console.error('Failed to update post:', error);
      showError('Failed to update post. Please try again.');
    }
  };

  // Handle boost post
  const handleBoostPost = async (postId: string) => {
    modals.openConfirmModal({
      title: 'Boost Post',
      children: (
        <Text size="sm">
          Are you sure you want to boost this post? This will increase its visibility in the feed.
        </Text>
      ),
      labels: { confirm: 'Boost Post', cancel: 'Cancel' },
      confirmProps: { color: 'blue', leftSection: <IconRocket size={16} /> },
      onConfirm: () => boostPostMutation.mutate(postId),
    });
  };



  // Enhanced PostCard with edit/boost/delete actions
  const EnhancedPostCard: React.FC<{ post: Post }> = ({ post }) => (
    <Box style={{ position: 'relative' }}>
      <PostCard post={post} />
      
             {/* Action buttons overlay */}
       <Box
         style={{
           position: 'absolute',
           top: rem(16),
           right: rem(16),
           zIndex: 10,
         }}
       >
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
              onClick={() => handleEditPost(post)}
              c={"white"}
            >
              Edit Post
            </Menu.Item>
            
            <Menu.Item
              leftSection={<IconRocket size={16} />}
              onClick={() => handleBoostPost(post.id)}
              style={{ color: '#3b82f6' }}
              disabled={boostPostMutation.isPending}
            >
              Boost Post
            </Menu.Item>
            
            <Menu.Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Box>
  );

  // Loading state
  if (isLoading) {
    return (
      <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(24) }}>
        <Stack gap="md">
          {Array(3).fill(0).map((_, index) => (
            <Paper key={index} p="md" radius="md" withBorder style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
              <Group mb="md">
                <Skeleton height={40} circle />
                <Box style={{ flex: 1 }}>
                  <Skeleton height={12} width="40%" mb="xs" />
                  <Skeleton height={10} width="20%" />
                </Box>
              </Group>
              <Skeleton height={12} mb="xs" />
              <Skeleton height={12} mb="xs" />
              <Skeleton height={12} width="80%" mb="md" />
              <Skeleton height={200} />
            </Paper>
          ))}
        </Stack>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(24) }}>
        <Center py="xl">
          <Stack align="center" gap="md">
            <Text size="lg" c="red">Failed to load your posts</Text>
            <Text size="sm" c="dimmed" ta="center">
              There was an error loading your posts. Please try again.
            </Text>
            <Button variant="light" color="blue" onClick={() => refetch()}>
              Try Again
            </Button>
          </Stack>
        </Center>
      </Box>
    );
  }

  return (
    <>
      <Box style={{ ...glassCardStyles(theme, 'primary'), padding: rem(24) }}>
        {/* Header */}
        <Group justify="space-between" mb="xl" style={{ flexWrap: 'wrap', gap: rem(16) }}>
          <Box style={{ flex: '1', minWidth: rem(200) }}>
            <Group gap="md" align="center" style={{ flexWrap: 'wrap' }}>
              <IconPhoto size={24} color={theme.colors.blue[4]} />
              <Text size="xl" fw={600} c="white">
                My Post
              </Text>
              {/* <Badge variant="light" color="blue" size="lg">
                {posts.length}
              </Badge> */}
            </Group>
            <Text size="sm" c="dimmed" mt="xs">
              Manage your post and boost visibility, 
            </Text>
          </Box>
        </Group>

        {/* Posts List */}
        {posts.length > 0 ? (
          <Stack gap="lg">
            {posts.map((post) => (
              <EnhancedPostCard key={post.id} post={post} />
            ))}
          </Stack>
        ) : (
          <Center py="xl">
            <Stack align="center" gap="md" style={{ maxWidth: rem(400) }}>
              <Box
                style={{
                  padding: rem(32),
                  borderRadius: '50%',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  border: '2px dashed rgba(59, 130, 246, 0.3)',
                }}
              >
                <IconSparkles size={48} color={theme.colors.blue[4]} />
              </Box>
              
              <Text size="xl" fw={600} c="white" ta="center">
                No posts yet
              </Text>
              
              <Text size="sm" c="dimmed" ta="center">
                You haven't created any posts yet. Share your thoughts, photos, or updates with your classmates to get started.
              </Text>
            </Stack>
          </Center>
        )}
      </Box>

      {/* Edit Post Modal */}
      <Modal
        opened={editModalOpened}
        onClose={() => {
          setEditModalOpened(false);
          setCurrentEditPost(null);
          setPreviewImages([]);
          setSelectedFiles([]);
          editForm.reset();
        }}
        title="Edit Post"
        size="xl"
        centered
        fullScreen={false}
        withCloseButton
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
            <Textarea
              label="Post Title"
              placeholder="Enter post title"
              minRows={1}
              maxRows={3}
              autosize
              {...editForm.getInputProps('title')}
              styles={{
                label: { color: 'white', marginBottom: rem(8) },
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:focus': {
                    borderColor: theme.colors.blue[4],
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
                label: { color: 'white', marginBottom: rem(8) },
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&:focus': {
                    borderColor: theme.colors.blue[4],
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
                  setCurrentEditPost(null);
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
    </>
  );
};

export default MyPostsTab; 