import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  useMantineTheme,
  Box,
  Slider,
  Paper,
} from '@mantine/core';

interface ImageCropModalProps {
  opened: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
}

const MIN_ASPECT_RATIO = 4 / 5; // 4:5 = 0.8
const MAX_ASPECT_RATIO = 1.91; // 1.91:1

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  opened,
  onClose,
  imageUrl,
  onCropComplete,
}) => {
  const theme = useMantineTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [aspectRatio, setAspectRatio] = useState(1); // Default to square
  const [previewDimensions, setPreviewDimensions] = useState({ width: 600, height: 600 }); // Set initial dimensions

  // Load image when modal opens
  useEffect(() => {
    if (opened && imageUrl) {
      const img = new Image();
      img.onload = () => {
        setImage(img);
        // Set initial aspect ratio based on image, but constrained to our limits
        const imageAspectRatio = img.width / img.height;
        const constrainedRatio = Math.max(MIN_ASPECT_RATIO, Math.min(MAX_ASPECT_RATIO, imageAspectRatio));
        setAspectRatio(constrainedRatio);
        
        // Set initial preview dimensions based on the image's aspect ratio
        const containerWidth = 600; // Default max width
        const containerHeight = 400; // Default max height
        
        if (constrainedRatio > containerWidth / containerHeight) {
          // Aspect ratio is wider than container
          const previewWidth = Math.min(containerWidth, 600);
          const previewHeight = previewWidth / constrainedRatio;
          setPreviewDimensions({ width: previewWidth, height: previewHeight });
        } else {
          // Aspect ratio is taller than container
          const previewHeight = Math.min(containerHeight, 400);
          const previewWidth = previewHeight * constrainedRatio;
          setPreviewDimensions({ width: previewWidth, height: previewHeight });
        }
      };
      img.src = imageUrl;
    }
  }, [opened, imageUrl]);

  // Calculate preview dimensions when aspect ratio or container changes
  useEffect(() => {
    if (image && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.clientWidth - 40; // Account for padding
      const containerHeight = container.clientHeight - 40;
      
      // Calculate dimensions that fit within container while maintaining aspect ratio
      let previewWidth, previewHeight;
      
      if (aspectRatio > containerWidth / containerHeight) {
        // Aspect ratio is wider than container
        previewWidth = Math.min(containerWidth, 600); // Max width
        previewHeight = previewWidth / aspectRatio;
      } else {
        // Aspect ratio is taller than container
        previewHeight = Math.min(containerHeight, 400); // Max height
        previewWidth = previewHeight * aspectRatio;
      }
      
      setPreviewDimensions({ width: previewWidth, height: previewHeight });
    }
  }, [aspectRatio, image]);

  // Create fitted image (letterboxed/pillarboxed)
  const getFittedImage = (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!image || !canvasRef.current) {
        reject(new Error('Image or canvas not available'));
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      // Set canvas dimensions to desired aspect ratio
      const targetWidth = 800; // Base width
      const targetHeight = targetWidth / aspectRatio;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Fill with background color (black or transparent)
      ctx.fillStyle = '#000000'; // Black background for letterboxing
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate how to fit the image within the canvas
      const imageAspectRatio = image.width / image.height;
      let drawWidth, drawHeight, drawX, drawY;

      if (imageAspectRatio > aspectRatio) {
        // Image is wider than target - fit width, add letterbox bars
        drawWidth = canvas.width;
        drawHeight = canvas.width / imageAspectRatio;
        drawX = 0;
        drawY = (canvas.height - drawHeight) / 2;
      } else {
        // Image is taller than target - fit height, add pillar bars
        drawHeight = canvas.height;
        drawWidth = canvas.height * imageAspectRatio;
        drawX = (canvas.width - drawWidth) / 2;
        drawY = 0;
      }

      // Draw the image fitted within the canvas
      ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/jpeg', 0.9);
    });
  };

  const handleComplete = async () => {
    try {
      const fittedBlob = await getFittedImage();
      onCropComplete(fittedBlob);
      onClose();
    } catch (error) {
      console.error('Error fitting image:', error);
    }
  };

  const handleAspectRatioChange = (value: number) => {
    // Convert slider value (0-100) to aspect ratio (0.8-1.91)
    const ratio = MIN_ASPECT_RATIO + (value / 100) * (MAX_ASPECT_RATIO - MIN_ASPECT_RATIO);
    setAspectRatio(ratio);
  };

  const getAspectRatioLabel = (ratio: number): string => {
    if (ratio <= 0.85) return '4:5 (Portrait)';
    if (ratio <= 1.05) return '1:1 (Square)';
    if (ratio <= 1.35) return '4:3 (Standard)';
    if (ratio <= 1.65) return '16:10 (Wide)';
    return '1.91:1 (Cinema)';
  };

  const sliderValue = ((aspectRatio - MIN_ASPECT_RATIO) / (MAX_ASPECT_RATIO - MIN_ASPECT_RATIO)) * 100;

  // Calculate how the image will be fitted
  const getImageFitInfo = () => {
    if (!image) return null;
    
    const imageAspectRatio = image.width / image.height;
    
    if (Math.abs(imageAspectRatio - aspectRatio) < 0.01) {
      return "Perfect fit - no bars needed";
    } else if (imageAspectRatio > aspectRatio) {
      return "Image will be fitted with black bars on top and bottom";
    } else {
      return "Image will be fitted with black bars on left and right";
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        title="Fit Image to Aspect Ratio"
        size="xl"
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
          body: {
            maxHeight: '90vh',
            overflowY: 'auto',
            paddingBottom: theme.spacing.xl,
          },
          inner: {
            padding: theme.spacing.xs,
          }
        }}
      >
        <Stack gap="md" pb={50}>
          <Text size="sm" c="dimmed">
            Choose your preferred aspect ratio. The image will be fitted within these dimensions without cropping.
          </Text>
          
          {/* Aspect Ratio Control */}
          <Paper p="md" bg="rgba(255, 255, 255, 0.05)">
            <Stack gap="sm">
              <Group justify="space-between">
                <Text size="sm" fw={500}>Aspect Ratio</Text>
                <Text size="sm" c="dimmed">{getAspectRatioLabel(aspectRatio)}</Text>
              </Group>
              <Slider
                value={sliderValue}
                onChange={handleAspectRatioChange}
                min={0}
                max={100}
                step={1}
                color="blue"
                size="sm"
                marks={[
                  { value: 0, label: '4:5' },
                  { value: 25, label: '1:1' },
                  { value: 50, label: '4:3' },
                  { value: 75, label: '16:10' },
                  { value: 100, label: '1.91:1' },
                ]}
              />
              {image && (
                <Text size="xs" c="dimmed" mt="xs">
                  {getImageFitInfo()}
                </Text>
              )}
            </Stack>
          </Paper>

          {/* Image Preview */}
          <Box
            ref={containerRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '300px', // Reduced height for better mobile view
              background: '#1A1B1E',
              borderRadius: theme.radius.md,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!image && imageUrl && (
              <Text size="sm" c="dimmed">Loading image...</Text>
            )}
            {image && previewDimensions.width > 0 && (
              <Box
                style={{
                  position: 'relative',
                  width: `${previewDimensions.width}px`,
                  height: `${previewDimensions.height}px`,
                  background: '#000',
                }}
              >
                <img
                  src={imageUrl}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                  }}
                />
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Group justify="flex-end" mt="xl">
            <Button variant="default" onClick={onClose}>Cancel</Button>
            <Button onClick={handleComplete}>Continue</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </>
  );
};

export default ImageCropModal; 