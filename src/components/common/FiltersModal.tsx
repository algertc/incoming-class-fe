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
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconCalendarEvent,
  IconSchool,
  IconX,
} from '@tabler/icons-react';
import { useFeedStore } from '../../store/feed.store';
import { useAuthStore } from '../../store/auth.store';
import { useCollegeSearch } from '../../hooks/api/useColleges';
import { useDebouncedValue } from '@mantine/hooks';

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
  const isAuthenticated = !!user;
  
  // Get feed store state and actions
  const {
    filters,
    searchPosts,
    setDateRange,
    setCollege,
    resetFilters,
  } = useFeedStore();

  // Local state for debounced search
  const [searchQuery, setSearchQuery] = React.useState(filters.searchQuery);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

  // College search state
  const [collegeSearchQuery, setCollegeSearchQuery] = React.useState("");
  const [debouncedCollegeSearch] = useDebouncedValue(collegeSearchQuery, 300);

  // Use the API hook for college search
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

  // Handle debounced search
  useEffect(() => {
    searchPosts(debouncedSearchQuery, isAuthenticated);
  }, [debouncedSearchQuery, searchPosts, isAuthenticated]);

  // Update local search when filters change externally
  useEffect(() => {
    setSearchQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  // Handle reset
  const handleReset = () => {
    setSearchQuery("");
    setCollegeSearchQuery("");
    resetFilters(isAuthenticated);
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
            <IconFilter size={20} style={{ color: '#4C6EF5' }} />
            <Title order={4} c="white">
              Filters & Search
            </Title>
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
                  onChange={(value) => setDateRange(value, isAuthenticated)}
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
                onChange={(value) => setCollege(value, isAuthenticated)}
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
        </ScrollArea>

        {/* Action Buttons */}
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
        </Box>
      </Box>
    </Box>
  );

  return createPortal(modal, document.body);
};

export default FiltersModal;
