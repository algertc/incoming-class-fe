import React from 'react';
import { createPortal } from 'react-dom';
import {
  Box,
  Button,
  Group,
  ScrollArea,
  useMantineTheme,
  Title,
  Paper,
  Badge,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconFilter,
  IconX,
  IconCrown,
} from '@tabler/icons-react';
import { useAuthStore } from '../../store/auth.store';
import { useNavigate } from 'react-router';
import { FiltersSidebar } from '../Feed/FiltersSidebar/FiltersSidebar';
import { useFeedStore } from '../../store/feed.store';

interface FiltersModalProps {
  open: boolean;
  onClose: () => void;
  onPremiumRequest: (trigger: string) => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({ open, onClose, onPremiumRequest }) => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { resetFilters } = useFeedStore();

  const isDesktop = useMediaQuery(`(min-width: ${theme.breakpoints.sm})`);

  const hasFilterAccess = true;

  // Prevent body scroll while modal is open
  React.useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  if (!open) return null;

  const handleUpgrade = () => {
    onClose();
    if (!user) {
      navigate('/signup');
    } else {
      navigate('/app/subscription');
    }
  };

  const modalContent = (
    <Paper
      shadow="xl"
      radius={isDesktop ? 'lg' : 0}
      style={{
        width: isDesktop ? 'auto' : '100%',
        minWidth: isDesktop ? 400 : undefined,
        maxWidth: isDesktop ? '90vw' : '100%',
        height: isDesktop ? 'auto' : '100%',
        maxHeight: isDesktop ? '90vh' : '100%',
        background: '#101720',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        style={{
          padding: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Group>
          <IconFilter size={20} style={{ color: hasFilterAccess ? '#4C6EF5' : '#FFD700' }} />
          <Title order={4} c="white">
            Filters
          </Title>
          {!hasFilterAccess && (
            <Badge
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange' }}
              size="sm"
              leftSection={<IconCrown size={12} />}
            >
              Premium
            </Badge>
          )}
        </Group>
        <Button variant="subtle" color="gray" onClick={onClose} style={{ padding: 8 }}>
          <IconX size={20} />
        </Button>
      </Box>

      {/* Content */}
      <ScrollArea style={{ flex: isDesktop ? '1 1 auto' : 1 }} type="scroll" scrollbarSize={6} offsetScrollbars>
        {hasFilterAccess ? (
          <Box p="md">
            {/* Render FiltersSidebar without search input */}
            <FiltersSidebar showSearch={false} onPremiumModalOpen={() => onPremiumRequest('filters')} />
          </Box>
        ) : (
          <Box p="xl">
            <Paper
              p="xl"
              radius="md"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 140, 0, 0.1) 100%)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                textAlign: 'center',
              }}
            >
              <Group gap="xl" align="center" justify="center" style={{ flexDirection: 'column' }}>
                <IconCrown size={40} color="#FFD700" />
                <Title order={3} c="white">
                  Premium Filters
                </Title>
                <Button
                  size="lg"
                  variant="gradient"
                  gradient={{ from: 'yellow', to: 'orange' }}
                  leftSection={<IconCrown size={20} />}
                  onClick={handleUpgrade}
                  style={{ fontWeight: 600 }}
                >
                  {!user ? 'Sign Up Now' : 'Upgrade to Premium'}
                </Button>
              </Group>
            </Paper>
          </Box>
        )}
      </ScrollArea>

      {/* Action Buttons */}
      {hasFilterAccess && (
        <Box
          style={{
            backgroundColor: '#101720',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: theme.spacing.md,
          }}
        >
          <Group grow gap="md">
            <Button
              variant="outline"
              color="gray"
              size="md"
              onClick={() => resetFilters()}
              styles={{
                root: {
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  color: theme.white,
                },
              }}
            >
              Reset All
            </Button>
            <Button variant="filled" color="blue" size="md" onClick={onClose}>
              Apply Filters
            </Button>
          </Group>
        </Box>
      )}
    </Paper>
  );

  const modalOverlay = (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        display: 'flex',
        alignItems: isDesktop ? 'center' : 'flex-start',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
      }}
      onClick={onClose}
    >
      <Box onClick={(e) => e.stopPropagation()}>
        {modalContent}
      </Box>
    </Box>
  );

  return createPortal(modalOverlay, document.body);
};

export default FiltersModal;
