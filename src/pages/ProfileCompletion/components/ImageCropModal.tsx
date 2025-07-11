import React, { useState, useCallback } from 'react';
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

interface ImageCropModalProps {
  opened: boolean;
  onClose: () => void;
  imageUrl: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  aspectRatio: number | undefined;
  setAspectRatio: (ratio: number) => void;
}

const aspectRatios = [
  { value: 1 / 1, label: 'Square' },
  { value: 4 / 5, label: 'Vertical' },
  { value: 1.91 / 1, label: 'Landscape' },
];

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  opened,
  onClose,
  imageUrl,
  onCropComplete,
  aspectRatio,
  setAspectRatio,
}) => {
  const theme = useMantineTheme();
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [activeAspectRatio, setActiveAspectRatio] = useState<number | undefined>(aspectRatio);

  const onCropChange = useCallback((location: Point) => {
    setCrop(location);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const onCropFull = useCallback((_croppedArea: Area, newCroppedAreaPixels: Area) => {
    setCroppedAreaPixels(newCroppedAreaPixels);
  }, []);

  const handleComplete = async () => {
    if (croppedAreaPixels) {
      try {
        const croppedImageBlob = await getCroppedImg(imageUrl, croppedAreaPixels);
        onCropComplete(croppedImageBlob);
        if (activeAspectRatio && !aspectRatio) {
          setAspectRatio(activeAspectRatio);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAspectRatioChange = (newRatio: number) => {
    setActiveAspectRatio(newRatio);
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
            {aspectRatios.map(({ value, label }) => (
              <Button
                key={label}
                onClick={() => handleAspectRatioChange(value)}
                variant={activeAspectRatio === value ? 'filled' : 'outline'}
                disabled={!!aspectRatio && aspectRatio !== value}
              >
                {label}
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