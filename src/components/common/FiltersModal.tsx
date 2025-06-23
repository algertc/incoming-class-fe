import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Box,
  TextInput,
  Stack,
  Text,
  Slider,
  Select,
  Button,
  Group,
  ScrollArea,
  useMantineTheme,
  Title,
  Paper,
  Badge,
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconCalendarEvent,
  IconSchool,
  IconX,
  IconCrown,
} from '@tabler/icons-react';
import { useFeedStore } from '../../store/feed.store';
import { useAuthStore } from '../../store/auth.store';
import { useCollegeSearch } from '../../hooks/api/useColleges';
import { useDebouncedValue } from '@mantine/hooks';
import { useNavigate } from 'react-router';

interface FiltersModalProps {
  open: boolean;
  onClose: () => void;
}

const FiltersModal: React.FC<FiltersModalProps> = ({
  open,
  onClose,
}) => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  // Get feed store state and actions
  const {
    filters,
    searchPosts,
    setDateRange,
    setCollege,
    resetFilters,
    checkFilterAccess,
  } = useFeedStore();

  // Local state for debounced search
  const [searchQuery, setSearchQuery] = React.useState(filters.searchQuery);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

  // College search state
  const [collegeSearchQuery, setCollegeSearchQuery] = React.useState("");
  const [debouncedCollegeSearch] = useDebouncedValue(collegeSearchQuery, 300);

  // Check if user has access to filters
  const hasFilterAccess = checkFilterAccess();

  // Use the API hook for college search (only if user has access)
  const { data: collegeData, isLoading: isLoadingColleges } = useCollegeSearch({
    search: debouncedCollegeSearch,
    limit: 20,
    page: 1,
  });

  // Transform college data for Select component
  const collegeOptions = React.useMemo(() => {
    const options = [{ value: "all", label: "All Colleges" }];
    
    if (collegeData?.data.colleges) {
      const apiColleges = collegeData.data.colleges.map((college) => ({
        value: college._id,
        label: college.name,
      }));
      options.push(...apiColleges);
    }
    
    return options;
  }, [collegeData]);

  // Handle debounced search (only if user has access)
  useEffect(() => {
    if (hasFilterAccess) {
      searchPosts(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, searchPosts, hasFilterAccess]);

  // Update local search when filters change externally
  useEffect(() => {
    setSearchQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  // Handle reset (only if user has access)
  const handleReset = () => {
    if (!hasFilterAccess) return;
    setSearchQuery("");
    setCollegeSearchQuery("");
    resetFilters();
  };

  // Handle upgrade action
  const handleUpgrade = () => {
    onClose();
    if (!user) {
      navigate('/signup');
    } else {
      navigate('/app/subscription');
    }
  };

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
        alignItems: 'flex-start',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(3px)',
      }}
    >
      <Box
        style={{
          width: '100%',
          height: '100%',
          background: '#101720',
          display: 'flex',
          flexDirection: 'column',
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
              Filters & Search
            </Title>
            {hasFilterAccess && (
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
          <Button
            variant="subtle"
            color="gray"
            onClick={onClose}
            style={{ padding: 8 }}
          >
            <IconX size={20} />
          </Button>
        </Box>

        {/* Content */}
        <ScrollArea
          style={{ flex: 1 }}
          type="scroll"
          scrollbarSize={6}
          offsetScrollbars
        >
          {hasFilterAccess ? (
            <Stack gap="md" p="md">
              {/* Search Box */}
              <Box>
                <Text size="sm" fw={500} c="white" mb="xs">
                  Search Posts
                </Text>
                <TextInput
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftSection={<IconSearch size={16} />}
                  size="md"
                  styles={{
                    input: {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: theme.white,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "&::placeholder": {
                        color: theme.colors.dark[2],
                      },
                      "&:focus": {
                        borderColor: theme.colors.blue[5],
                      },
                    },
                  }}
                />
              </Box>

              {/* Time Period */}
              <Box>
                <Text size="sm" fw={500} c="white" mb="xs">
                  Time Period
                </Text>
                <Box>
                  <Group mb="sm" justify="space-between">
                    <Text size="sm" c="dimmed">
                      Last {filters.lastDays} days
                    </Text>
                    <IconCalendarEvent size={16} color={theme.colors.dark[2]} />
                  </Group>
                  <Slider
                    value={filters.lastDays}
                    onChange={(value) => setDateRange(value)}
                    min={1}
                    max={90}
                    step={1}
                    label={(value) => `${value} days`}
                    marks={[
                      { value: 1, label: '1d' },
                      { value: 7, label: '1w' },
                      { value: 30, label: '1m' },
                      { value: 90, label: '3m' },
                    ]}
                    styles={{
                      track: {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                      bar: {
                        backgroundColor: theme.colors.blue[5],
                      },
                      thumb: {
                        borderColor: theme.colors.blue[5],
                        backgroundColor: theme.colors.dark[9],
                      },
                      mark: {
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                      },
                      markLabel: {
                        color: theme.colors.dark[2],
                        fontSize: theme.fontSizes.xs,
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* College Filter */}
              <Box>
                <Text size="sm" fw={500} c="white" mb="xs">
                  College
                </Text>
                <Select
                  placeholder="Filter by college"
                  value={filters.college}
                  onChange={(value) => setCollege(value)}
                  onSearchChange={setCollegeSearchQuery}
                  searchValue={collegeSearchQuery}
                  data={collegeOptions}
                  searchable
                  leftSection={<IconSchool size={16} />}
                  rightSection={isLoadingColleges ? <Text size="xs" c="dimmed">Loading...</Text> : null}
                  size="md"
                  styles={{
                    input: {
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      color: theme.white,
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      "&::placeholder": {
                        color: theme.colors.dark[2],
                      },
                    },
                    dropdown: {
                      backgroundColor: theme.colors.dark[7],
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    },
                    option: {
                      color: theme.white,
                      "&[data-selected]": {
                        backgroundColor: theme.colors.blue[9],
                        color: theme.white,
                      },
                      "&[data-hovered]": {
                        backgroundColor: theme.colors.dark[5],
                      },
                    },
                  }}
                />
              </Box>
            </Stack>
          ) : (
            // Premium upgrade prompt
            <Box p="xl">
              <Paper
                p="xl"
                radius="md"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 140, 0, 0.1) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                  textAlign: 'center',
                }}
              >
                <Stack align="center" gap="xl">
                  <Box
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <IconCrown size={40} color="white" />
                  </Box>

                  <div>
                    <Title order={3} c="white" mb="md">
                      Premium Filters & Search
                    </Title>
                    <Text size="md" c="dimmed" style={{ maxWidth: 300, margin: '0 auto' }}>
                      {!user 
                        ? "Sign up to unlock advanced search and filtering options to find exactly what you're looking for."
                        : "Upgrade to Premium to access advanced search and filtering options to find exactly what you're looking for."
                      }
                    </Text>
                  </div>

                  <Stack gap="sm" style={{ width: '100%', maxWidth: 300 }}>
                    <Group gap="sm" justify="center">
                      <IconSearch size={16} color="#FFD700" />
                      <Text size="sm" c="white">Advanced search functionality</Text>
                    </Group>
                    <Group gap="sm" justify="center">
                      <IconCalendarEvent size={16} color="#FFD700" />
                      <Text size="sm" c="white">Custom date range filters</Text>
                    </Group>
                    <Group gap="sm" justify="center">
                      <IconSchool size={16} color="#FFD700" />
                      <Text size="sm" c="white">Filter by specific colleges</Text>
                    </Group>
                  </Stack>

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

                  <Text size="sm" c="dimmed">
                    {!user 
                      ? 'Free to join • Unlock premium features'
                      : 'Unlock unlimited posts • Advanced filters • Priority support'
                    }
                  </Text>
                </Stack>
              </Paper>
            </Box>
          )}
        </ScrollArea>

        {/* Action Buttons */}
        <Box
          style={{
            backgroundColor: '#101720',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: theme.spacing.md,
          }}
        >
          {hasFilterAccess ? (
            <Group grow gap="md">
              <Button
                variant="outline"
                color="gray"
                size="md"
                onClick={handleReset}
                styles={{
                  root: {
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    color: theme.white,
                  },
                }}
              >
                Reset All
              </Button>
              <Button
                variant="filled"
                color="blue"
                size="md"
                onClick={onClose}
              >
                Apply Filters
              </Button>
            </Group>
          ) : (
            <Button
              fullWidth
              variant="outline"
              color="gray"
              size="md"
              onClick={onClose}
              styles={{
                root: {
                  borderColor: "rgba(255, 255, 255, 0.2)",
                  color: theme.white,
                },
              }}
            >
              Close
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );

  return createPortal(modal, document.body);
};

export default FiltersModal;
