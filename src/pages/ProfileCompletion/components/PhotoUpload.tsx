import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Text,
  rem,
  useMantineTheme,
  Paper,
  Group,
  Button,
  Image,
  ActionIcon,
  SimpleGrid,
  LoadingOverlay,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconUpload, IconX, IconPlus } from '@tabler/icons-react';
import { useUpdateCurrentUserProfile, useUploadMultipleImages, createImageFormData, validateImageFiles } from '../../../hooks/api';
import { ProfileStage } from '../../../models/user.model';
import type { User } from '../../../models/user.model';
import { showSuccess, showError } from '../../../utils';
import { useAuthStore } from '../../../store/auth.store';
import ImageCropModal from './ImageCropModal';
import styles from './PhotoUpload.module.css';

interface ExtendedUser extends User {
  photos?: string[];
}

interface PhotoItem {
  id: string;
  url: string;
  isExisting: boolean;
  isRemoved?: boolean;
}

const PhotoUpload: React.FC = () => {
  const { user } = useAuthStore();
  
  // Separate state management for better control
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [newPhotos, setNewPhotos] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [removedExistingIndices, setRemovedExistingIndices] = useState<Set<number>>(new Set());
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [fileForCropping, setFileForCropping] = useState<File | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [aspectRatio, setAspectRatio] = useState<number | undefined>(undefined);
  
  const theme = useMantineTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateCurrentUserProfile();
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadMultipleImages();

  // Initialize existing photos from user data
  useEffect(() => {
    if (user) {
      const userData = user as ExtendedUser;
      const userPhotos: string[] = userData?.photos || [];
      
      // Include profile picture if it's not already in photos
      if (userData?.profilePicture && !userPhotos.includes(userData.profilePicture)) {
        userPhotos.unshift(userData.profilePicture);
      }
      
      setExistingPhotos(userPhotos);
    }
  }, [user]);

  // Compute display photos for UI
  const displayPhotos: PhotoItem[] = [
    // Existing photos that aren't removed
    ...existingPhotos.map((url, index) => ({
      id: `existing-${index}`,
      url,
      isExisting: true,
      isRemoved: removedExistingIndices.has(index)
    })).filter(photo => !photo.isRemoved),
    
    // New photos
    ...newPhotos.map((url, index) => ({
      id: `new-${index}`,
      url,
      isExisting: false
    }))
  ];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    // Validate files before processing
    const validation = validateImageFiles([...selectedFiles, ...files]);
    if (!validation.isValid) {
      showError(validation.error || 'Invalid files selected');
      return;
    }

    // Check total photo limit (existing + new)
    const totalPhotos = displayPhotos.length + files.length;
    if (totalPhotos > 10) {
      showError(`You can only have up to 10 photos total. Currently you have ${displayPhotos.length} photos.`);
      return;
    }

    // Add new files to pending queue
    const newPendingFiles = [...pendingFiles, ...files];
    setPendingFiles(newPendingFiles);

    // Start processing if modal is not already open
    if (!cropModalOpen && newPendingFiles.length > 0) {
      processNextFile(newPendingFiles);
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
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(fileToProcess);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    if (!fileForCropping) {
      console.error('Error processing cropped image: No file was available for cropping.');
      showError('An unexpected error occurred. Please try again.');
      setCropModalOpen(false);
      setPendingFiles([]);
      return;
    }

    try {
      // Convert blob to File
      const croppedFile = new File([croppedImageBlob], fileForCropping.name, {
        type: 'image/jpeg',
      });

      // Add the cropped file to selectedFiles
      setSelectedFiles(prev => [...prev, croppedFile]);

      // Create preview URL and add to newPhotos
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setNewPhotos(prev => [...prev, result as string]);
        }
      };
      reader.readAsDataURL(croppedFile);

      // Remove the processed file from pending files
      const remainingFiles = pendingFiles.slice(1);
      setPendingFiles(remainingFiles);

      // Process next file if available
      if (remainingFiles.length > 0) {
        processNextFile(remainingFiles);
      } else {
        // All files processed
        setCropModalOpen(false);
        setCurrentImageUrl('');
        setFileForCropping(null);
      }
    } catch (error) {
      console.error('Error processing cropped image:', error);
      showError('Failed to process the cropped image');
    }
  };

  const handleModalClose = () => {
    // If user closes modal during processing, clear pending files
    if (selectedFiles.length === 0) {
      setPendingFiles([]);
    }
    setCropModalOpen(false);
    setCurrentImageUrl('');
    setFileForCropping(null);
  };

  const handleRetry = () => {
    // Retry processing the current pending file
    if (pendingFiles.length > 0) {
      processNextFile(pendingFiles);
    }
  };

  const removePhoto = (photoId: string) => {
    if (photoId.startsWith('existing-')) {
      // Remove existing photo by marking it as removed
      const index = parseInt(photoId.split('-')[1]);
      setRemovedExistingIndices(prev => new Set([...prev, index]));
    } else if (photoId.startsWith('new-')) {
      // Remove new photo by removing from arrays
      const index = parseInt(photoId.split('-')[1]);
      setNewPhotos(prev => prev.filter((_, i) => i !== index));
      setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleNext = async () => {
    try {
      setIsSubmitting(true);
      
      // Check if user has any photos (existing or new)
      const hasPhotos = displayPhotos.length > 0;
      
      if (!hasPhotos) {
        showError('Please upload at least one photo to continue');
        return;
      }
      
      // Prepare the final photos array
      let finalPhotos: string[] = [];
      
      // Add existing photos that weren't removed
      const remainingExistingPhotos = existingPhotos.filter((_, index) => 
        !removedExistingIndices.has(index)
      );
      finalPhotos = [...remainingExistingPhotos];
      
      // Upload new files if any
      if (selectedFiles.length > 0) {
        // Validate files before upload
        const validation = validateImageFiles(selectedFiles);
        if (!validation.isValid) {
          showError(validation.error || 'Please select valid images');
          return;
        }

        // Upload new images to server
        const formData = createImageFormData(selectedFiles);
        const uploadResponse = await uploadImages(formData);

        if (!uploadResponse.status) {
          throw new Error(uploadResponse.message || 'Failed to upload images');
        }

        // Add newly uploaded photos to final array
        if (uploadResponse.data) {
          finalPhotos = [...finalPhotos, ...uploadResponse.data];
        }
      }
      
      // Update profile with the final photos array
      const profileResponse = await updateProfile({
        profileStage: ProfileStage.ABOUT_YOU,
        photos: finalPhotos
      });

      if (!profileResponse.status) {
        throw new Error(profileResponse.message || 'Failed to update profile');
      }
      
      const hasNewFiles = selectedFiles.length > 0;
      const hasRemovedFiles = removedExistingIndices.size > 0;
      
      let successMessage = "Profile updated successfully!";
      if (hasNewFiles && hasRemovedFiles) {
        successMessage = "Photos updated successfully!";
      } else if (hasNewFiles) {
        successMessage = "Photos uploaded successfully!";
      } else if (hasRemovedFiles) {
        successMessage = "Photos removed successfully!";
      }
      
      showSuccess(successMessage);
    } catch (error) {
      showError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isUploadingImages || isUpdatingProfile;

  return (
    <Paper 
      className={`${styles.container} ${isMobile ? styles.containerMobile : ''}`} 
      p={isMobile ? "sm" : "xl"} 
      radius="md"
      style={{
        ...(isMobile && {
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        })
      }}
    >
      <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />

      <Text className={`${styles.title} ${isMobile ? styles.titleMobile : ''}`} size={isMobile ? "md" : "lg"} fw={600}>
        Upload Your Photos
      </Text>

      <Paper
        className={`${styles.dropzone} ${isMobile ? styles.dropzoneMobile : ''}`}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => {
          if (pendingFiles.length > 0) {
            handleRetry();
          } else {
            fileInputRef.current?.click();
          }
        }}
      >
        <IconUpload style={{ width: rem(isMobile ? 32 : 48), height: rem(isMobile ? 32 : 48), color: theme.white }} />
        <Text className={styles.dropzoneText} size={isMobile ? "sm" : "md"}>
          {pendingFiles.length > 0 
            ? "Click to retry processing the current image" 
            : isMobile 
              ? "Tap to select photos" 
              : "Drag and drop photos here or click to select"}
        </Text>
        <Text size={isMobile ? "xs" : "sm"} c="dimmed" mt="xs">
          Upload up to 10 images (max 5MB each). Images will be fitted to your chosen aspect ratio without cropping.
        </Text>
      </Paper>

      {displayPhotos.length > 0 && (
        <SimpleGrid 
          cols={{ base: 2, sm: 3, md: 4 }} 
          className={`${styles.photoGrid} ${isMobile ? styles.photoGridMobile : ''}`}
          spacing={isMobile ? "sm" : "md"}
        >
          {displayPhotos.map((photo) => (
            <Box key={photo.id} className={styles.photoItem}>
              <Image
                src={photo.url}
                radius="md"
                className={styles.photoImage}
              />
              <ActionIcon
                variant="filled"
                color="red"
                size={isMobile ? "xs" : "sm"}
                radius="xl"
                pos="absolute"
                top={-8}
                right={-8}
                onClick={() => removePhoto(photo.id)}
              >
                <IconX style={{ width: rem(isMobile ? 12 : 14), height: rem(isMobile ? 12 : 14) }} />
              </ActionIcon>
            </Box>
          ))}
          {displayPhotos.length < 10 && (
            <Paper
              className={`${styles.addPhotoButton} ${isMobile ? styles.addPhotoButtonMobile : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconPlus style={{ width: rem(isMobile ? 24 : 32), height: rem(isMobile ? 24 : 32), color: theme.white }} />
            </Paper>
          )}
          <Group justify="center" mt="xl" style={{ 
            ...(isMobile ? { 
              flexShrink: 0,
              gridColumn: '1 / -1'
            } : {})
          }}>
            <Button
              size={isMobile ? "md" : "lg"}
              onClick={handleNext}
              disabled={displayPhotos.length === 0}
              className={styles.nextButton}
              c="white"
              loading={isLoading}
              fullWidth={isMobile}
            >
              Continue
            </Button>
          </Group>
        </SimpleGrid>
      )}

      {/* Show continue button even when no photos for mobile */}
      {isMobile && displayPhotos.length === 0 && (
        <Group justify="center" mt="xl">
          <Button
            size="md"
            onClick={handleNext}
            disabled={displayPhotos.length === 0}
            className={styles.nextButton}
            c="white"
            loading={isLoading}
            fullWidth
          >
            Continue
          </Button>
        </Group>
      )}

      {/* Spacer to push button to bottom on mobile */}
      {isMobile && <Box style={{ flex: 1 }} />}

      <ImageCropModal
        opened={cropModalOpen}
        onClose={handleModalClose}
        imageUrl={currentImageUrl}
        onCropComplete={handleCropComplete}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
      />
    </Paper>
  );
};

export default PhotoUpload; 