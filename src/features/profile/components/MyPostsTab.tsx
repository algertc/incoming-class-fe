import React, { useState, useRef, useEffect } from 'react';
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
import { useAuthStore } from '../../../store/auth.store';
import { PremiumSubscriptionModal } from '../../../components/common/PremiumSubscriptionModal';
import { LimitReachedModal } from '../../../components/common/LimitReachedModal';


const MyPostsTab: React.FC = () => {
  const theme = useMantineTheme();
  const { user, fetchUser } = useAuthStore();
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [premiumModalOpened, setPremiumModalOpened] = useState(false);
  const [limitReachedModalOpened, setLimitReachedModalOpened] = useState(false);
  const [limitReachedType, setLimitReachedType] = useState<'edit' | 'boost'>('edit');
  const [currentEditPost, setCurrentEditPost] = useState<Post | null>(null);
  
  // State for image editing
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<string[]>([]); // For previews
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // For upload
  const [removedExistingIndices, setRemovedExistingIndices] = useState<Set<number>>(new Set());
  
  const [cropModalOpened, setCropModalOpened] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [fileForCropping, setFileForCropping] = useState<File | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [aspectRatio, setAspectRatio] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const showLimitReachedModal = (type: 'edit' | 'boost') => {
    if (user?.isSubscribed) {
      // For subscribed users, show the dedicated limit reached modal
      setLimitReachedType(type);
      setLimitReachedModalOpened(true);
    } else {
      // For non-subscribed users, show the premium upgrade modal
      modals.open({
        title: `No ${type === 'edit' ? 'Edits' : 'Boosts'} Remaining`,
        centered: true,
        children: (
          <Stack>
            <Text size="sm">
              You've used all your available post {type}s for your current plan.
              Upgrade to Premium for more {type}s and other exclusive features!
            </Text>
            <Button
              onClick={() => {
                modals.closeAll();
                setPremiumModalOpened(true);
              }}
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              Upgrade to Premium
            </Button>
          </Stack>
        ),
      });
    }
  };

  // Handle edit post with premium check
  const handleEditPost = (post: Post) => {
    // Subscription check is now at the call site (onClick)
    if ((user?.subscriptionEditCount || 0) >= 2 && !user?.isPremium) {
      showLimitReachedModal('edit');
      return;
    }

    setCurrentEditPost(post);
    editForm.setValues({ 
      title: post.title || '',
      content: post.content 
    });

    // --- New Image and Aspect Ratio Logic ---
    const postImages = post.images || [];
    setExistingPhotos(postImages);
    setAspectRatio(post.aspectRatio);

    // Reset states for new edit session
    setNewPhotos([]);
    setSelectedFiles([]);
    setRemovedExistingIndices(new Set());
    setPendingFiles([]);
    
    setEditModalOpened(true);
  };

  // Handle file input
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const processNextFile = (files: File[]) => {
    if (files.length === 0) return;
    const fileToProcess = files[0];
    setFileForCropping(fileToProcess);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        setCurrentImageUrl(result as string);
        setCropModalOpened(true);
      }
    };
    reader.readAsDataURL(fileToProcess);
  };

  // Handle files from input or drop
  const handleFiles = (files: File[]) => {
    // Validate files before processing
    const validation = validateImageFiles([...selectedFiles, ...files]);
    if (!validation.isValid) {
      showError(validation.error || 'Invalid files selected');
      return;
    }

    // Add new files to pending queue
    const newPendingFiles = [...pendingFiles, ...files];
    setPendingFiles(newPendingFiles);

    // Start processing if modal is not already open
    if (!cropModalOpened && newPendingFiles.length > 0) {
      processNextFile(newPendingFiles);
    }
  };

  // Handle crop complete
  const handleCropComplete = async (croppedImageBlob: Blob, newAspectRatioLabel?: string) => {
    if (!fileForCropping) return;

    try {
      if (newAspectRatioLabel && !aspectRatio) {
        setAspectRatio(newAspectRatioLabel);
      }

      const croppedFile = new File([croppedImageBlob], fileForCropping.name, {
        type: 'image/jpeg',
      });

      setSelectedFiles(prev => [...prev, croppedFile]);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setNewPhotos(prev => [...prev, result as string]);
        }
      };
      reader.readAsDataURL(croppedFile);

      const remainingFiles = pendingFiles.slice(1);
      setPendingFiles(remainingFiles);

      if (remainingFiles.length > 0) {
        processNextFile(remainingFiles);
      } else {
        setCropModalOpened(false);
        setFileForCropping(null);
        setCurrentImageUrl('');
      }
    } catch (error) {
      console.error('Failed to process cropped image:', error);
      showError('Failed to process cropped image.');
    }
  };

  const removePhoto = (photoId: string, index: number) => {
    if (photoId.startsWith('existing-')) {
      setRemovedExistingIndices(prev => new Set(prev).add(index));
    } else if (photoId.startsWith('new-')) {
      setNewPhotos(prev => prev.filter((_, i) => i !== index));
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Handle save edit
  const handleSaveEdit = async (values: { title: string; content: string }) => {
    if (!currentEditPost) return;

    try {
      let uploadedImageUrls: string[] = [];
      if (selectedFiles.length > 0) {
        const formData = createImageFormData(selectedFiles);
        const uploadResponse = await uploadImagesMutation.mutateAsync(formData);
        if (!uploadResponse.status || !uploadResponse.data) {
          throw new Error(uploadResponse.message || 'Failed to upload new images.');
        }
        uploadedImageUrls = uploadResponse.data;
      }
      
      const remainingExistingPhotos = existingPhotos.filter(
        (_, index) => !removedExistingIndices.has(index)
      );

      const finalImages = [...remainingExistingPhotos, ...uploadedImageUrls];

      const updateData: { 
        title: string; 
        content: string; 
        images?: string[];
        aspectRatio?: string;
      } = {
        title: values.title,
        content: values.content,
        images: finalImages,
      };

      if (aspectRatio) {
        updateData.aspectRatio = aspectRatio;
      }

      await updatePostMutation.mutateAsync({
        postId: currentEditPost.id,
        updateData,
      });

      setEditModalOpened(false);
      refetch(); // Refetch posts to show updated data
      fetchUser(); // Refetch user to get updated edit count
      showSuccess('Post updated successfully!');
    } catch (error) {
      showError((error as Error).message || 'Failed to update post.');
    }
  };

  // Handle boost post with premium check
  const handleBoostPost = async (postId: string) => {
    // Subscription check is now at the call site (onClick)
    if ((user?.subscriptionBumpCount || 0) >= 2) {
      showLimitReachedModal('boost');
      return;
    }

    modals.openConfirmModal({
      title: (
        <Group>
          <IconRocket />
          <Text>Boost this Post?</Text>
        </Group>
      ),
      centered: true,
      children: (
        <Text size="sm">
          Boosting your post will increase its visibility in the feed for a limited time.
          Are you sure you want to proceed?
        </Text>
      ),
      labels: { confirm: 'Boost Now', cancel: 'Cancel' },
      confirmProps: { color: 'blue' },
      onConfirm: async () => {
        try {
          await boostPostMutation.mutateAsync(postId, {
            onSuccess: () => {
              showSuccess('Post boosted successfully!');
              refetch();
              fetchUser();
            },
            onError: (err) => {
              showError((err as any)?.response?.data?.message || 'Failed to boost post.');
            },
          });
        } catch (err) {
          // Error is handled by onError callback
        }
      },
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
              onClick={() => {
                if (user?.isSubscribed) {
                  handleEditPost(post);
                } else {
                  setPremiumModalOpened(true);
                }
              }}
              c={"white"}
            >
              Edit Post
            </Menu.Item>
            
            <Menu.Item
            c={"white"}
              leftSection={<IconRocket size={16} />}
              onClick={() => {
                if (user?.isSubscribed) {
                  handleBoostPost(post.id);
                } else {
                  setPremiumModalOpened(true);
                }
              }}
            >
              Boost Post
            </Menu.Item>
            
            <Menu.Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          </Menu.Dropdown>
        </Menu>
      </Box>
    </Box>
  );

  // Combine existing and new photos for display in the modal
  const displayPhotosInModal = [
    ...existingPhotos
      .map((url, index) => ({ id: `existing-${index}`, url, isExisting: true }))
      .filter((_, index) => !removedExistingIndices.has(index)),
    ...newPhotos.map((url, index) => ({ id: `new-${index}`, url, isExisting: false })),
  ];
  
  useEffect(() => {
    // If all photos are removed, allow choosing a new aspect ratio
    if (displayPhotosInModal.length === 0) {
      setAspectRatio(undefined);
    }
  }, [displayPhotosInModal.length]);

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
          setSelectedFiles([]);
          editForm.reset();
          setAspectRatio(undefined);
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
        
        <form onSubmit={editForm.onSubmit(handleSaveEdit)}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            style={{ display: 'none' }}
            accept="image/png,image/jpeg,image/gif"
            multiple
          />
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
              {displayPhotosInModal.length > 0 && (
                <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="sm" mt="md">
                  {displayPhotosInModal.map((photo, index) => (
                    <Box key={photo.id} style={{ position: 'relative' }}>
                      <Image
                        src={photo.url}
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
                        onClick={() => removePhoto(photo.id, photo.isExisting ? index : index - existingPhotos.filter((_, i) => !removedExistingIndices.has(i)).length)}
                      >
                        <IconX size={14} />
                      </ActionIcon>
                    </Box>
                  ))}
                  
                  {/* Add more images button */}
                  {displayPhotosInModal.length < 10 && (
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
        aspectRatio={aspectRatio}
      />

      <PremiumSubscriptionModal
        opened={premiumModalOpened}
        onClose={() => setPremiumModalOpened(false)}
        trigger="edit-boost-post"
      />

      {/* Limit Reached Modal */}
      <LimitReachedModal
        opened={limitReachedModalOpened}
        onClose={() => setLimitReachedModalOpened(false)}
        type={limitReachedType}
        currentCount={limitReachedType === 'edit' ? (user?.subscriptionEditCount || 0) : (user?.subscriptionBumpCount || 0)}
        maxCount={limitReachedType === 'edit' ? 2 : 2}
      />
    
    </>
  );
};

export default MyPostsTab; 