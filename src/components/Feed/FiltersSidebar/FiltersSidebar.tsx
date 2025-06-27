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
  Paper,
  Stack,
  Badge,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconCalendarEvent,
  IconSchool,
  IconCrown,
} from "@tabler/icons-react";
import { useFeedStore } from "../../../store/feed.store";
import { useDebouncedValue } from "@mantine/hooks";
import { useAuthStore } from "../../../store/auth.store";
import { useCollegeSearch } from "../../../hooks/api/useColleges";
import { PremiumSubscriptionModal } from "../../common/PremiumSubscriptionModal";

export const FiltersSidebar: React.FC = () => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  
  // State for premium modal
  const [premiumModalOpened, setPremiumModalOpened] = useState(false);
  const [modalTrigger, setModalTrigger] = useState<string>("filters");
  
  // Get feed store state and actions
  const {
    filters,
    searchPosts,
    setDateRange,
    setCollege,
    setSubstances,
    setPersonality,
    setHometown,
    resetFilters,
    checkFilterAccess,
  } = useFeedStore();

  // Local state for debounced search
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

  // College search state
  const [collegeSearchQuery, setCollegeSearchQuery] = useState("");
  const [debouncedCollegeSearch] = useDebouncedValue(collegeSearchQuery, 300);

  // Keep a broader search to ensure we can find colleges set programmatically
  const [broadCollegeSearch, setBroadCollegeSearch] = useState("");
  const { data: broadCollegeData } = useCollegeSearch({
    search: broadCollegeSearch,
    limit: 100, // Higher limit to find more colleges
    page: 1,
  });

  // Local state for debounced time period
  const [timePeriod, setTimePeriod] = useState(filters.lastDays);
  const [debouncedTimePeriod] = useDebouncedValue(timePeriod, 500);

  // Local state for debounced hometown
  const [hometownQuery, setHometownQuery] = useState(filters.hometown || "");
  const [debouncedHometown] = useDebouncedValue(hometownQuery, 400);

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
    
    // Combine both college search results
    const allColleges = [
      ...(collegeData?.data.colleges || []),
      ...(broadCollegeData?.data.colleges || [])
    ];
    
    // Remove duplicates by ID
    const uniqueColleges = allColleges.filter((college, index, self) => 
      index === self.findIndex(c => c._id === college._id)
    );
    
    if (uniqueColleges.length > 0) {
      const apiColleges = uniqueColleges.map((college) => ({
        value: college._id,
        label: college.name,
      }));
      options.push(...apiColleges);
    }
    
    return options;
  }, [collegeData, broadCollegeData]);

  // Handle debounced search (only if user has access)
  useEffect(() => {
    if (hasFilterAccess) {
      searchPosts(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, searchPosts, hasFilterAccess]);

  // Handle debounced time period (only if user has access)
  useEffect(() => {
    if (hasFilterAccess) {
      setDateRange(debouncedTimePeriod);
    }
  }, [debouncedTimePeriod, setDateRange, hasFilterAccess]);

  // Handle debounced hometown (only if user has access)
  useEffect(() => {
    if (hasFilterAccess) {
      setHometown(debouncedHometown || null);
    }
  }, [debouncedHometown, setHometown, hasFilterAccess]);

  // When a college filter is set programmatically, ensure we have the college name
  useEffect(() => {
    if (filters.college && filters.college !== "all") {
      // Check if we already have this college in our options
      const hasCollege = collegeOptions.some(option => option.value === filters.college);
      
      if (!hasCollege) {
        // We don't have this college, so search for it
        // Since we don't have the name, we'll search with a broad query
        setBroadCollegeSearch("university college");
      }
    }
  }, [filters.college, collegeOptions]);

  // Handle filter interaction for non-premium users
  const handleFilterInteraction = (trigger: string) => {
    if (!hasFilterAccess) {
      setModalTrigger(trigger);
      setPremiumModalOpened(true);
      return;
    }
  };

  // Handle reset (only if user has access)
  const handleReset = () => {
    if (!hasFilterAccess) {
      handleFilterInteraction("filters");
      return;
    }
    setSearchQuery("");
    setCollegeSearchQuery("");
    setTimePeriod(30); // Reset to default value
    setHometownQuery("");
    resetFilters();
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasFilterAccess) {
      handleFilterInteraction("search");
      return;
    }
    setSearchQuery(e.target.value);
  };

  // Handle date range change
  const handleDateRangeChange = (value: number) => {
    if (!hasFilterAccess) {
      handleFilterInteraction("date-filter");
      return;
    }
    setTimePeriod(value);
  };

  // Handle college selection change
  const handleCollegeChange = (value: string | null) => {
    if (!hasFilterAccess) {
      handleFilterInteraction("college-filter");
      return;
    }
    setCollege(value);
  };

  // Handle college search change
  const handleCollegeSearchChange = (value: string) => {
    if (!hasFilterAccess) {
      handleFilterInteraction("college-filter");
      return;
    }
    setCollegeSearchQuery(value);
  };

  return (
    <>
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
        <Group mb="md" justify="space-between">
          <Group gap="xs">
            <IconFilter size={20} color={theme.colors.blue[5]} />
            <Text fw={600} size="sm" c={theme.white}>
              Filters & Search
            </Text>
          </Group>
          {!hasFilterAccess && (
            <Badge
              variant="gradient"
              gradient={{ from: 'yellow', to: 'orange' }}
              size="xs"
              leftSection={<IconCrown size={12} />}
            >
              Premium
            </Badge>
          )}
        </Group>

        {/* Search Box */}
        <TextInput
          placeholder="Search posts..."
          value={searchQuery}
          onChange={handleSearchChange}
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
              Last {timePeriod} days
            </Text>
            <IconCalendarEvent size={16} color={theme.colors.dark[2]} />
          </Group>
          <Slider
            value={timePeriod}
            onChange={handleDateRangeChange}
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
          onChange={handleCollegeChange}
          onSearchChange={handleCollegeSearchChange}
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

        {/* Substances Filter */}
        <Text size="sm" fw={500} c={theme.white} mb="xs">
          Substances
        </Text>
        <Select
          placeholder="Filter by substance preference"
          value={filters.substances}
          onChange={(value) => {
            if (!hasFilterAccess) {
              handleFilterInteraction("substances-filter");
              return;
            }
            setSubstances(value);
          }}
          data={[
            { value: "Fine with Drinking", label: "Fine with Drinking" },
            { value: "Fine with Smoking", label: "Fine with Smoking" },
            { value: "Fine with Both", label: "Fine with Both" },
            { value: "No Substances", label: "No Substances" },
          ]}
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

        {/* Personality Filter */}
        <Text size="sm" fw={500} c={theme.white} mb="xs">
          Personality
        </Text>
        <Select
          placeholder="Filter by personality traits"
          value={filters.personality?.[0] || null}
          onChange={(value) => {
            if (!hasFilterAccess) {
              handleFilterInteraction("personality-filter");
              return;
            }
            setPersonality(value ? [value] : null);
          }}
          data={[
            { value: "Introvert", label: "Introvert" },
            { value: "Extrovert", label: "Extrovert" },
            { value: "Spontaneous", label: "Spontaneous" },
            { value: "Organized", label: "Organized" },
            { value: "Creative", label: "Creative" },
            { value: "Analytical", label: "Analytical" },
            { value: "Adventurous", label: "Adventurous" },
            { value: "Cautious", label: "Cautious" },
          ]}
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

        {/* Hometown Filter */}
        <Text size="sm" fw={500} c={theme.white} mb="xs">
          Hometown
        </Text>
        <TextInput
          placeholder="Filter by hometown"
          value={hometownQuery}
          onChange={(e) => {
            if (!hasFilterAccess) {
              handleFilterInteraction("hometown-filter");
              return;
            }
            setHometownQuery(e.target.value);
          }}
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

        {/* Premium upgrade prompt for non-premium users */}
        {!hasFilterAccess && (
          <Paper
            p="md"
            radius="md"
            mt="md"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 140, 0, 0.1) 100%)',
              border: '1px solid rgba(255, 215, 0, 0.3)',
              textAlign: 'center',
            }}
          >
            <Stack align="center" gap="sm">
              <Group gap="xs" justify="center">
                <IconCrown size={16} color="#FFD700" />
                <Text size="sm" fw={500} c="white">
                  Unlock Premium Filters
                </Text>
              </Group>
              <Text size="xs" c="dimmed" ta="center">
                {!user 
                  ? "Sign up to access advanced search and filtering"
                  : "Upgrade to Premium for full filter access"
                }
              </Text>
            </Stack>
          </Paper>
        )}
      </Box>

      {/* Premium Subscription Modal */}
      <PremiumSubscriptionModal
        opened={premiumModalOpened}
        onClose={() => setPremiumModalOpened(false)}
        trigger={modalTrigger}
      />
    </>
  );
}; 