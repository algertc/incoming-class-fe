import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Box, Group, Button, Text } from '@mantine/core';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Confirm',
  description = '',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  // Prevent body scroll while modal is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  const modal = (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: 16,
      }}
    >
      <Box
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#101720',
          borderRadius: 12,
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: 24,
        }}
      >
        <Text size="lg" fw={600} mb="sm" style={{ color: 'white' }}>
          {title}
        </Text>
        {description && (
          <Text size="sm" mb="md" style={{ color: 'white', opacity: 0.85 }}>
            {description}
          </Text>
        )}
        <Group justify="flex-end">
          <Button variant="outline" color="gray" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button color="red" onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </Group>
      </Box>
    </Box>
  );

  return createPortal(modal, document.body);
};

export default ConfirmDialog; 