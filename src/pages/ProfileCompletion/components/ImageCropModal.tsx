import React, { useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core';

interface ImageCropModalProps {
  opened: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  opened,
  onClose,
  imageUrl,
  onCropComplete,
}) => {
  const theme = useMantineTheme();
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  };

  const handleCropComplete = async () => {
    if (!imageRef || !crop.width || !crop.height) return;

    try {
      const croppedImageBlob = await getCroppedImg(imageRef, crop);
      onCropComplete(croppedImageBlob);
      onClose();
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Crop Image"
      size="lg"
      centered
      styles={{
        title: {
          color: theme.white,
          fontWeight: 600,
        },
        header: {
          backgroundColor: theme.colors.dark[7],
        },
        content: {
          backgroundColor: theme.colors.dark[7],
        },
      }}
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Drag to crop the image. The image will be cropped to a 1:1 ratio for optimal display.
        </Text>
        <div style={{ maxWidth: '100%', maxHeight: '70vh', overflow: 'auto' }}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            aspect={1}
            circularCrop
          >
            <img
              src={imageUrl}
              onLoad={(e) => setImageRef(e.currentTarget)}
              style={{ maxWidth: '100%' }}
              alt="Crop preview"
            />
          </ReactCrop>
        </div>
        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCropComplete}>
            Apply Crop
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ImageCropModal; 