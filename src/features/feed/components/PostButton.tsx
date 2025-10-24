import React, { useState, useEffect } from 'react';
import {
  ActionIcon,
  Button,
  Modal,
  Stack,
  TextInput,
  Textarea,
  Group,
  Box,
  SimpleGrid,
  Image,
  useMantineTheme,
  rem,
  LoadingOverlay,
  Paper,
  Text,
} from '@mantine/core';
import {
  IconPlus,
  IconX,
  IconCheck,
  IconUpload,
  IconEdit,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useAuthStore } from '../../../store/auth.store';
import { useUpdatePost, useUserPosts } from '../../../hooks/api';
import { useUploadMultipleImages, createImageFormData, validateImageFiles } from '../../../hooks/api/useImageUpload';
import { showSuccess, showError } from '../../../utils';
import ImageCropModal from '../../../pages/ProfileCompletion/components/ImageCropModal';
import { PremiumSubscriptionModal } from '../../../components/common/PremiumSubscriptionModal';
import { useQueryClient } from '@tanstack/react-query';

interface PostButtonProps {
  variant?: 'icon' | 'button';
}

const PostButton: React.FC<PostButtonProps> = ({ variant = 'button' }) => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [premiumModalOpened, setPremiumModalOpened] = useState(false);
  const [cropModalOpened, setCropModalOpened] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [currentFileIndex, setCurrentFileIndex] = useState<number>(-1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState<string | undefined>(undefined);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Fetch user's posts
  const { data: userPostsResponse, isLoading: isLoadingPosts } = useUserPosts({ page: 1, limit: 1 });
  const userPost = userPostsResponse?.data?.posts?.[0];

  // Hooks for API operations
  const updatePostMutation = useUpdatePost();
  const uploadImagesMutation = useUploadMultipleImages();

  // Get query client for cache invalidation
  const queryClient = useQueryClient();

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

  // Initialize form with user's post data when available
  useEffect(() => {
    if (userPost && editModalOpened) {
 
      editForm.setValues({
        title: userPost.title || '',
        content: userPost.content || '',
      });
      
      // Initialize preview images if post has images
      if (userPost.images && userPost.images.length > 0) {
        setPreviewImages(userPost.images);
      }
    }
  }, [userPost, editModalOpened]);

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

    // Create preview URL
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

  // Remove image
  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle edit post
  const handleEditPost = async (values: { title: string; content: string }) => {
    if (!userPost?.id) {
      showError('No post found to edit');
      return;
    }

    try {
      let finalImages: string[] = [];

      // Upload images if any new files selected
      if (selectedFiles.length > 0) {
        const formData = createImageFormData(selectedFiles);
        const uploadResponse = await uploadImagesMutation.mutateAsync(formData);
        
        if (uploadResponse.status && uploadResponse.data) {
          finalImages = [...uploadResponse.data];
        }
      }

      // Keep existing images that weren't removed
      if (userPost.images) {
        finalImages = [...previewImages.filter(img => userPost.images?.includes(img)), ...finalImages];
      }

      // Update post
      await updatePostMutation.mutateAsync({
        postId: userPost.id,
        updateData: {
          title: values.title,
          content: values.content,
          images: finalImages,
        }
      });

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });

      // Reset form and close modal
      setEditModalOpened(false);
      editForm.reset();
      setPreviewImages([]);
      setSelectedFiles([]);

      showSuccess('Post updated successfully');
    } catch (error) {
      console.error('Error updating post:', error);
      showError('Failed to update post');
    }
  };

  // Handle button click
  const handleClick = () => {
    if (!user) {
      setPremiumModalOpened(true);
      return;
    }

    if (!user.isSubscribed) {
      setPremiumModalOpened(true);
      return;
    }

    // For subscribed users, open edit modal
    setEditModalOpened(true);
  };

  return (
    <>
      {variant === 'icon' ? (
        <ActionIcon
          size="lg"
          variant="light"
          color="blue"
          onClick={handleClick}
          style={{
            backgroundColor: "rgba(67, 97, 238, 0.2)",
          }}
        >
          <IconEdit size={20} />
        </ActionIcon>
      ) : (
        <Button
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan' }}
          leftSection={<IconEdit size={16} />}
          onClick={handleClick}
        >
          {user?.isSubscribed ? 'Edit Post' : 'Post'}
        </Button>
      )}

      {/* Edit Post Modal */}
      <Modal
        opened={editModalOpened}
        onClose={() => {
          setEditModalOpened(false);
          editForm.reset();
          setPreviewImages([]);
          setSelectedFiles([]);
          setAspectRatio(undefined);
        }}
        title="Edit Your Post"
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
        <LoadingOverlay visible={isLoadingPosts || updatePostMutation.isPending || uploadImagesMutation.isPending} />
        
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="image/*"
          multiple
          style={{ display: 'none' }}
        />
        
        <form onSubmit={editForm.onSubmit(handleEditPost)}>
          <Stack gap="md">
            <TextInput
              label="Post Title"
              placeholder="Enter post title"
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
              <Group justify="space-between" align="center" mb="xs">
                <TextInput
                  label="Images"
                  readOnly
                  value={`${selectedFiles.length} image${selectedFiles.length !== 1 ? 's' : ''} selected`}
                  styles={{
                    label: { color: 'white' },
                    input: {
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: 'white',
                      padding: 0,
                    },
                    wrapper: {
                      width: 'auto',
                    },
                  }}
                />
                {selectedFiles.length > 0 && (
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    onClick={() => {
                      setSelectedFiles([]);
                      setPreviewImages([]);
                    }}
                  >
                    Clear All
                  </Button>
                )}
              </Group>
              
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
                  editForm.reset();
                  setPreviewImages([]);
                  setSelectedFiles([]);
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

      {/* Premium Subscription Modal */}
      <PremiumSubscriptionModal
        opened={premiumModalOpened}
        onClose={() => setPremiumModalOpened(false)}
        trigger="post"
      />

      {/* Image Crop Modal */}
      <ImageCropModal
        opened={cropModalOpened}
        onClose={() => setCropModalOpened(false)}
        imageUrl={currentImageUrl}
        onCropComplete={handleCropComplete}
        aspectRatio={aspectRatio}
      />
    </>
  );
};

export default PostButton; 