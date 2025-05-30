import React, { useState, useRef } from 'react';
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
} from '@mantine/core';
import { IconUpload, IconX, IconPlus } from '@tabler/icons-react';
import styles from './PhotoUpload.module.css';

interface PhotoUploadProps {
  onComplete: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onComplete }) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const theme = useMantineTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    if (photos.length + files.length > 10) {
      alert('You can only upload up to 10 photos');
      return;
    }

    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (result) {
            setPhotos((prev) => [...prev, result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box className={styles.container}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        multiple
        style={{ display: 'none' }}
      />

      <Text className={styles.title} size="lg" fw={600}>
        Upload Your Photos
      </Text>

      <Paper
        className={styles.dropzone}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
      >
        <IconUpload style={{ width: rem(48), height: rem(48), color: theme.white }} />
        <Text className={styles.dropzoneText}>
          Drag and drop photos here or click to select
        </Text>
      </Paper>

      {photos.length > 0 && (
        <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} className={styles.photoGrid}>
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
                size="sm"
                radius="xl"
                pos="absolute"
                top={-8}
                right={-8}
                onClick={() => removePhoto(index)}
              >
                <IconX style={{ width: rem(14), height: rem(14) }} />
              </ActionIcon>
            </Box>
          ))}
          {photos.length < 10 && (
            <Paper
              className={styles.addPhotoButton}
              onClick={() => fileInputRef.current?.click()}
            >
              <IconPlus style={{ width: rem(32), height: rem(32), color: theme.white }} />
            </Paper>
          )}
        </SimpleGrid>
      )}

      <Group justify="center" mt="xl">
        <Button
          size="lg"
          onClick={onComplete}
          disabled={photos.length === 0}
          className={styles.nextButton}
          c={"white"}
        >
          Next Step
        </Button>
      </Group>
    </Box>
  );
};

export default PhotoUpload; 