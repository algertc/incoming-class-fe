import React, { useState, useEffect } from "react";
import {
  Box,
  TextInput,
  Text,
  Divider,
  Slider,
  Select,
  Button,
  Group,
  useMantineTheme,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconCalendarEvent,
  IconSchool,
} from "@tabler/icons-react";
import { useFeedStore } from "../../../store/feed.store";
import { useDebouncedValue } from "@mantine/hooks";
import { useAuthStore } from "../../../store/auth.store";
import { useCollegeSearch } from "../../../hooks/api/useColleges";

export const FiltersSidebar: React.FC = () => {
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
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

  // College search state
  const [collegeSearchQuery, setCollegeSearchQuery] = useState("");
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

  // Handle reset
  const handleReset = () => {
    setSearchQuery("");
    setCollegeSearchQuery("");
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
        onSearchChange={setCollegeSearchQuery}
        searchValue={collegeSearchQuery}
        data={collegeOptions}
        searchable
        leftSection={<IconSchool size={16} />}
        rightSection={isLoadingColleges ? <Text size="xs" c="dimmed">Loading...</Text> : null}
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