import React, { useState } from "react";
import {
  Box,
  TextInput,
  Stack,
  Text,
  Divider,
  Checkbox,
  RangeSlider,
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

export const FiltersSidebar: React.FC = () => {
  const theme = useMantineTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<[number, number]>([0, 30]);
  const [sortBy, setSortBy] = useState<string | null>("newest");

  // Categories for filtering
  const categories = [
    { value: "academic", label: "Academic" },
    { value: "social", label: "Social Life" },
    { value: "housing", label: "Housing" },
    { value: "career", label: "Career" },
    { value: "events", label: "Events" },
    { value: "advice", label: "Advice" },
  ];

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Reset all filters
  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setDateRange([0, 30]);
    setSortBy("newest");
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
        value={sortBy}
        onChange={setSortBy}
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
            checked={selectedCategories.includes(category.value)}
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

      {/* Date Range */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Time Period
      </Text>
      <Box mb="md">
        <Group mb="xs" justify="space-between">
          <Text size="xs" c="dimmed">
            Last {dateRange[1]} days
          </Text>
          <IconCalendarEvent size={16} color={theme.colors.dark[2]} />
        </Group>
        <RangeSlider
          value={dateRange}
          onChange={setDateRange}
          min={0}
          max={90}
          step={1}
          minRange={1}
          label={(value) => `${value} days`}
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
        data={[
          { value: "all", label: "All Colleges" },
          { value: "stanford", label: "Stanford University" },
          { value: "mit", label: "MIT" },
          { value: "harvard", label: "Harvard University" },
          { value: "berkeley", label: "UC Berkeley" },
        ]}
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
      {selectedCategories.length > 0 && (
        <Box mb="md">
          <Text size="xs" c="dimmed" mb="xs">
            Active Filters:
          </Text>
          <Group gap="xs">
            {selectedCategories.map((category) => (
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
        <Button variant="filled" color="blue" size="sm">
          Apply Filters
        </Button>
      </Group>
    </Box>
  );
}; 