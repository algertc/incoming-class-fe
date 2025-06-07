import React, { useState, useEffect } from "react";
import {
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
  useMantineTheme,
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

export const FiltersSidebar: React.FC = () => {
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

  return (
    <Box
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
        borderRadius: theme.radius.md,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        padding: theme.spacing.md,
      }}
    >
      {/* Section Title */}
      <Group mb="md">
        <IconFilter size={20} color={theme.colors.blue[5]} />
        <Text fw={600} size="sm" c={theme.white}>
          Filters & Search
        </Text>
      </Group>

      {/* Search Box */}
      <TextInput
        placeholder="Search posts..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftSection={<IconSearch size={16} />}
        mb="md"
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

      {/* Sort Options */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
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
        mb="md"
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

      <Divider color="rgba(255, 255, 255, 0.1)" my="md" />

      {/* Categories */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Categories
      </Text>
      <Stack gap="xs" mb="md">
        {categories.map((category) => (
          <Checkbox
            key={category.value}
            label={category.label}
            checked={filters.categories.includes(category.value)}
            onChange={() => handleCategoryChange(category.value)}
            styles={{
              label: { color: theme.white },
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

      <Divider color="rgba(255, 255, 255, 0.1)" my="md" />

      {/* Time Period */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Time Period
      </Text>
      <Box mb="md">
        <Group mb="xs" justify="space-between">
          <Text size="xs" c="dimmed">
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

      <Divider color="rgba(255, 255, 255, 0.1)" my="md" />

      {/* College Filter */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        College
      </Text>
      <Select
        placeholder="Filter by college"
        value={filters.college}
        onChange={(value) => setCollege(value, isAuthenticated)}
        data={collegeOptions}
        leftSection={<IconSchool size={16} />}
        mb="md"
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

      {/* Active Filters */}
      {filters.categories.length > 0 && (
        <Box mb="md">
          <Text size="xs" c="dimmed" mb="xs">
            Active Filters:
          </Text>
          <Group gap="xs">
            {filters.categories.map((category) => (
              <Badge
                key={category}
                color="blue"
                variant="light"
                size="sm"
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
      <Group grow>
        <Button
          variant="outline"
          color="gray"
          size="sm"
          onClick={handleReset}
          styles={{
            root: {
              borderColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          Reset
        </Button>
      </Group>
    </Box>
  );
}; 