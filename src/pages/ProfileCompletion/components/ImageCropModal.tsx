import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Button,
  Group,
  Stack,
  Text,
  useMantineTheme,
  Box,
  Slider,
} from '@mantine/core';
import Cropper from 'react-easy-crop';
import type { Point, Area } from 'react-easy-crop';
import getCroppedImg from '../../../utils/cropImage';
import {
  ASPECT_RATIO_MAP,
  ASPECT_RATIO_LABELS,
  getAspectRatioLabel,
  getAspectRatioNumber,
} from '../../../utils/aspectRatio';

interface ImageCropModalProps {
  opened: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob, aspectRatioLabel?: string) => void;
  aspectRatio?: string; // Now accepts a string label e.g. "square"
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  opened,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio, // This is the locked aspect ratio label
}) => {
  const theme = useMantineTheme();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  // The active aspect ratio is stored as its numerical value
  const [activeAspectRatio, setActiveAspectRatio] = useState<number | undefined>(
    getAspectRatioNumber(aspectRatio)
  );

  useEffect(() => {
    // If a locked aspect ratio is provided, ensure the active one matches
    const lockedRatioNumber = getAspectRatioNumber(aspectRatio);
    if (lockedRatioNumber) {
      setActiveAspectRatio(lockedRatioNumber);
    }
  }, [aspectRatio]);

  const onCropChange = useCallback((location: Point) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropFull = useCallback(
    (_croppedArea: Area, newCroppedAreaPixels: Area) => {
      setCroppedAreaPixels(newCroppedAreaPixels);
    },
    []
  );

  const handleComplete = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImageBlob = await getCroppedImg(
          imageUrl,
          croppedAreaPixels
        );
        const newAspectRatioLabel = getAspectRatioLabel(activeAspectRatio);
        onCropComplete(croppedImageBlob, newAspectRatioLabel);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAspectRatioChange = (newRatioValue: number) => {
    setActiveAspectRatio(newRatioValue);
    setZoom(1); // Reset zoom when aspect ratio changes
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Crop your photo"
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
        <Box style={{ position: 'relative', height: 400, width: '100%' }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={activeAspectRatio || 1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropFull}
          />
        </Box>
        <Stack>
          <Text size="sm">Zoom</Text>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={onZoomChange}
            label={(value) => value.toFixed(1)}
          />
          <Text size="sm">Aspect Ratio</Text>
          <Group grow>
            {Object.entries(ASPECT_RATIO_MAP).map(([label, value]) => (
              <Button
                key={label}
                onClick={() => handleAspectRatioChange(value)}
                variant={activeAspectRatio === value ? 'filled' : 'outline'}
                disabled={!!aspectRatio} // Disable if an aspect ratio is already locked
              >
                {ASPECT_RATIO_LABELS[label]}
              </Button>
            ))}
          </Group>
        </Stack>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleComplete} disabled={!activeAspectRatio}>
            Crop and Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ImageCropModal; 