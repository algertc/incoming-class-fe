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

interface PhotoUploadProps {
  onComplete: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onComplete }) => {
  const { user } = useAuthStore();
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>('');
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const theme = useMantineTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateCurrentUserProfile();
  const { mutateAsync: uploadImages, isPending: isUploadingImages } = useUploadMultipleImages();

  // Initialize photos from user data
  useEffect(() => {
    if (user) {
      const userData = user as ExtendedUser;
      const existingPhotos: string[] = userData?.photos || [];
      if (userData?.profilePicture && !existingPhotos.includes(userData.profilePicture)) {
        existingPhotos.unshift(userData.profilePicture);
      }
      setPhotos(existingPhotos);
    }
  }, [user]);

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

    // If there are already pending files, add new files to the queue
    const newPendingFiles = [...pendingFiles, ...files];
    setPendingFiles(newPendingFiles);

    // Only start processing if modal is not already open
    if (!cropModalOpen && newPendingFiles.length > 0) {
      processNextFile(newPendingFiles);
    }
  };

  // Separate function to process the next file
  const processNextFile = (files: File[]) => {
    if (files.length === 0) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (result) {
        setCurrentImageUrl(result as string);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(files[0]);
  };

  const handleCropComplete = async (croppedImageBlob: Blob) => {
    try {
      // Convert blob to File
      const croppedFile = new File([croppedImageBlob], pendingFiles[0].name, {
        type: 'image/jpeg',
      });

      // Add the cropped file to selectedFiles
      setSelectedFiles(prev => [...prev, croppedFile]);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setPhotos(prev => [...prev, result as string]);
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
      }
    } catch (error) {
      console.error('Error processing cropped image:', error);
      showError('Failed to process the cropped image');
    }
  };

  const handleModalClose = () => {
    // Just close the modal, keeping the current file in pendingFiles
    setCropModalOpen(false);
    setCurrentImageUrl('');
  };

  const handleRetry = () => {
    // Retry processing the current pending file
    if (pendingFiles.length > 0) {
      processNextFile(pendingFiles);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {
    try {
      setIsSubmitting(true);
      
      // Check if user has existing photos or new selected files
      const hasExistingPhotos = photos.length > 0;
      const hasNewFiles = selectedFiles.length > 0;
      
      if (!hasExistingPhotos && !hasNewFiles) {
        showError('Please upload at least one photo to continue');
        return;
      }
      
      let uploadResponse;
      // Only upload if there are new files
      if (hasNewFiles) {
        // Validate files before upload
        const validation = validateImageFiles(selectedFiles);
        if (!validation.isValid) {
          showError(validation.error || 'Please select valid images');
          return;
        }

        // Upload images to server
        const formData = createImageFormData(selectedFiles);
        uploadResponse = await uploadImages(formData);

        if (!uploadResponse.status) {
          throw new Error(uploadResponse.message || 'Failed to upload images');
        }
      }
      
      // Update profile stage in the same request as any other profile updates
      const profileResponse = await updateProfile({
        profileStage: ProfileStage.ABOUT_YOU,
        // Add any other profile updates if needed
        ...(uploadResponse?.data && { photos: uploadResponse.data })
      });

      if (!profileResponse.status) {
        throw new Error(profileResponse.message || 'Failed to update profile');
      }
      
      showSuccess(hasNewFiles ? "Photos uploaded successfully!" : "Continuing with existing photos!");
      onComplete();
    } catch (error) {
      showError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || isUploadingImages || isUpdatingProfile;

  return (
    <Box className={`${styles.container} ${isMobile ? styles.containerMobile : ''}`}>
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
          // If there are pending files, retry processing the current one
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

      {photos.length > 0 && (
        <SimpleGrid 
          cols={{ base: 2, sm: 3, md: 4 }} 
          className={`${styles.photoGrid} ${isMobile ? styles.photoGridMobile : ''}`}
          spacing={isMobile ? "sm" : "md"}
        >
          {photos.map((photo, index) => (
            <Box key={index} className={styles.photoItem}>
              <Image
                src={photo}
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
                onClick={() => removePhoto(index)}
              >
                <IconX style={{ width: rem(isMobile ? 12 : 14), height: rem(isMobile ? 12 : 14) }} />
              </ActionIcon>
            </Box>
          ))}
          {photos.length < 10 && (
            <Paper
              className={`${styles.addPhotoButton} ${isMobile ? styles.addPhotoButtonMobile : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconPlus style={{ width: rem(isMobile ? 24 : 32), height: rem(isMobile ? 24 : 32), color: theme.white }} />
            </Paper>
          )}
        </SimpleGrid>
      )}

      <Group justify="center" mt="xl">
        <Button
          size={isMobile ? "md" : "lg"}
          onClick={handleNext}
          disabled={photos.length === 0 && selectedFiles.length === 0}
          className={styles.nextButton}
          c="white"
          loading={isLoading}
          fullWidth={isMobile}
        >
          Continue
        </Button>
      </Group>

      <ImageCropModal
        opened={cropModalOpen}
        onClose={handleModalClose}
        imageUrl={currentImageUrl}
        onCropComplete={handleCropComplete}
      />
    </Box>
  );
};

export default PhotoUpload; 