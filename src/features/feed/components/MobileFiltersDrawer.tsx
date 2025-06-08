import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  TextInput,
  Stack,
  Text,
  Divider,
  Checkbox,
  Slider,
  Select,
  Button,
  Group,
  Badge,
  ScrollArea,
  useMantineTheme,
  Title,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconSortAscending,
  IconCalendarEvent,
  IconSchool,
} from "@tabler/icons-react";
import { useFeedStore } from "../../../store/feed.store";
import { useDebouncedValue } from "@mantine/hooks";
import { useAuthStore } from "../../../store/auth.store";

interface MobileFiltersDrawerProps {
  opened: boolean;
  onClose: () => void;
}

export const MobileFiltersDrawer: React.FC<MobileFiltersDrawerProps> = ({
  opened,
  onClose,
}) => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  const isAuthenticated = !!user;
  
  // Get feed store state and actions
  const {
    filters,
    searchPosts,
    setSortBy,
    setCategories,
    setDateRange,
    setCollege,
    resetFilters,
  } = useFeedStore();

  // Local state for debounced search
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

  // Categories for filtering
  const categories = [
    { value: "academic", label: "Academic" },
    { value: "social", label: "Social Life" },
    { value: "housing", label: "Housing" },
    { value: "career", label: "Career" },
    { value: "events", label: "Events" },
    { value: "advice", label: "Advice" },
  ];

  // College options
  const collegeOptions = [
    { value: "all", label: "All Colleges" },
    { value: "stanford", label: "Stanford University" },
    { value: "mit", label: "MIT" },
    { value: "harvard", label: "Harvard University" },
    { value: "berkeley", label: "UC Berkeley" },
  ];

  // Handle debounced search
  useEffect(() => {
    searchPosts(debouncedSearchQuery, isAuthenticated);
  }, [debouncedSearchQuery, searchPosts, isAuthenticated]);

  // Update local search when filters change externally
  useEffect(() => {
    setSearchQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    setCategories(newCategories, isAuthenticated);
  };

  // Handle reset
  const handleReset = () => {
    setSearchQuery("");
    resetFilters(isAuthenticated);
  };

  // Handle apply and close
  const handleApplyAndClose = () => {
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <IconFilter size={20} color={theme.colors.blue[5]} />
          <Title order={4} c="white">
            Filters & Search
          </Title>
        </Group>
      }
      position="bottom"
      size="80vh"
      style={{
        zIndex: 1000,
      }}
    >
      <Box
        style={{
          backgroundColor: "#101720",
          height: "100%",
          color: theme.white,
        }}
      >
        <ScrollArea h="calc(100vh - 80px)" px="md" pb="md">
          <Stack gap="md">
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

            <Divider color="rgba(255, 255, 255, 0.1)" />

            {/* Sort Options */}
            <Box>
              <Text size="sm" fw={500} c="white" mb="xs">
                Sort By
              </Text>
              <Select
                value={filters.sortBy}
                onChange={(value) => setSortBy(value as 'newest' | 'popular' | 'comments', isAuthenticated)}
                data={[
                  { value: "newest", label: "Newest First" },
                  { value: "popular", label: "Most Popular" },
                  { value: "comments", label: "Most Comments" },
                ]}
                leftSection={<IconSortAscending size={16} />}
                size="md"
                styles={{
                  input: {
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: theme.white,
                    border: "1px solid rgba(255, 255, 255, 0.1)",
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

            <Divider color="rgba(255, 255, 255, 0.1)" />

            {/* Categories */}
            <Box>
              <Text size="sm" fw={500} c="white" mb="xs">
                Categories
              </Text>
              <Stack gap="sm">
                {categories.map((category) => (
                  <Checkbox
                    key={category.value}
                    label={category.label}
                    checked={filters.categories.includes(category.value)}
                    onChange={() => handleCategoryChange(category.value)}
                    size="md"
                    styles={{
                      label: { 
                        color: theme.white,
                        fontSize: theme.fontSizes.sm,
                      },
                      input: {
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor: "rgba(255, 255, 255, 0.2)",
                        "&:checked": {
                          backgroundColor: theme.colors.blue[6],
                          borderColor: theme.colors.blue[6],
                        },
                      },
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Divider color="rgba(255, 255, 255, 0.1)" />

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

            <Divider color="rgba(255, 255, 255, 0.1)" />

            {/* College Filter */}
            <Box>
              <Text size="sm" fw={500} c="white" mb="xs">
                College
              </Text>
              <Select
                placeholder="Filter by college"
                value={filters.college}
                onChange={(value) => setCollege(value, isAuthenticated)}
                data={collegeOptions}
                leftSection={<IconSchool size={16} />}
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

            {/* Active Filters */}
            {filters.categories.length > 0 && (
              <Box>
                <Text size="sm" c="dimmed" mb="xs">
                  Active Filters:
                </Text>
                <Group gap="xs">
                  {filters.categories.map((category) => (
                    <Badge
                      key={category}
                      color="blue"
                      variant="light"
                      size="md"
                      styles={{
                        root: {
                          textTransform: "none",
                        },
                      }}
                    >
                      {categories.find((c) => c.value === category)?.label}
                    </Badge>
                  ))}
                </Group>
              </Box>
            )}

            {/* Action Buttons */}
            <Group grow gap="md" pt="md">
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
                onClick={handleApplyAndClose}
              >
                Apply Filters
              </Button>
            </Group>
          </Stack>
        </ScrollArea>
      </Box>
    </Drawer>
  );
}; 