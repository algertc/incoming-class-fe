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
import { useFeedStore, type FeedFilters } from "../../../store/feed.store";
import { useDebouncedValue } from "@mantine/hooks";
import { useCollegeSearch } from "../../../hooks/api/useColleges";

export const FiltersSidebar: React.FC<{ showSearch?: boolean, onPremiumModalOpen?: () => void }> = ({ showSearch = false, onPremiumModalOpen }) => {
  const theme = useMantineTheme();
  
  // Get feed store state and actions
  const {
    filters,
    searchPosts,
    setDateRange,
    resetFilters,
    checkFilterAccess,
    updateFilter,
  } = useFeedStore();

  // Local state for debounced inputs
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);

  const [timePeriod, setTimePeriod] = useState(filters.lastDays);
  const [debouncedTimePeriod] = useDebouncedValue(timePeriod, 500);

  // College search for dropdown
  const [collegeSearchQuery, setCollegeSearchQuery] = useState("");
  const [debouncedCollegeSearch] = useDebouncedValue(collegeSearchQuery, 300);

  // Check if user has premium access
  const isPremium = checkFilterAccess();

  // Count how many filters are currently active
  const getActiveFiltersCount = () => {
    let count = 0;
    if (showSearch && filters.searchQuery && filters.searchQuery.trim() !== '') count++;
    if (filters.lastDays !== 30) count++;
    if (filters.substances !== null) count++;
    if (filters.homeState !== null) count++;
    if (filters.religion !== null) count++;
    if (filters.gender !== null) count++;
    if (filters.campusInvolvement !== null) count++;
    if (filters.other !== null) count++;
    return count;
  };

  // Check if a specific filter is the ONLY one active, ignoring defaults
  const isOnlyActiveFilter = (filterKey: keyof FeedFilters) => {
    // If more than 1 filter is active, it's not the "only" one
    if (getActiveFiltersCount() > 1) return false;

    // Check if the specific filter is non-default
    switch (filterKey) {
      case 'searchQuery':
        return filters.searchQuery.trim() !== '';
      case 'lastDays':
        return filters.lastDays !== 30;
      default:
        return filters[filterKey] !== null && filters[filterKey] !== 'all';
    }
  };

  // Show premium modal when trying to use multiple filters
  const showPremiumModal = () => {
    if (onPremiumModalOpen) {
      onPremiumModalOpen();
    }
  };

  // College search API
  const { data: collegeData, isLoading: isLoadingColleges } = useCollegeSearch({
    search: debouncedCollegeSearch,
    limit: 50,
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
    if (showSearch) {
      searchPosts(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, searchPosts, showSearch]);

  // Handle debounced time period
  useEffect(() => {
    setDateRange(debouncedTimePeriod);
  }, [debouncedTimePeriod, setDateRange]);

  // Sync local state with store state
  useEffect(() => {
    setSearchQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  useEffect(() => {
    setTimePeriod(filters.lastDays);
  }, [filters.lastDays]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    const activeFilterCount = getActiveFiltersCount();
    if (!isPremium && activeFilterCount > 0 && !isOnlyActiveFilter('searchQuery')) {
      if (value.trim() !== '') showPremiumModal();
      return;
    }
    setSearchQuery(value);
  };

 

  // Handle filter changes
  const handleFilterChange = (value: any, filterKey: keyof FeedFilters) => {
    const activeFilterCount = getActiveFiltersCount();
    if (!isPremium && activeFilterCount > 0 && !isOnlyActiveFilter(filterKey)) {
      if (value !== null && value !== 'all') showPremiumModal();
      return;
    }
    updateFilter(filterKey, value);
  };

  // Handle reset
  const handleReset = () => {
    setSearchQuery("");
    setCollegeSearchQuery("");
    setTimePeriod(30);
    resetFilters();
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
      <Group mb="md" justify="space-between">
        <Group gap="xs">
          <IconFilter size={20} color={theme.colors.blue[5]} />
          <Text fw={600} size="sm" c={theme.white}>
            Filters{showSearch && ' & Search'}
          </Text>
        </Group>
        {!isPremium && (
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
      {showSearch && (
        <TextInput
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
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
      )}

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
          onChange={(value) => {
            if (!isPremium && getActiveFiltersCount() > 0 && !isOnlyActiveFilter('lastDays')) {
              if (value !== 30) showPremiumModal();
              return;
            }
            setTimePeriod(value);
          }}
          onChangeEnd={setDateRange}
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
        placeholder="Select college"
        value={filters.college}
        onChange={(value) => handleFilterChange(value, 'college')}
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
            zIndex: 1300,
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
        placeholder="Select preference"
        value={filters.substances}
        onChange={(value) => handleFilterChange(value, 'substances')}
        data={[
          { value: "Fine with Drinking", label: "Fine with Drinking" },
          { value: "Sober", label: "Sober" },
          { value: "420 Friendly", label: "420 Friendly" },
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
            zIndex: 1300,
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

      {/* Home State Filter */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Home State
      </Text>
      <Select
        placeholder="Select state"
        searchable
        value={filters.homeState}
        onChange={(value) => handleFilterChange(value, 'homeState')}
        data={[
          "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming"
        ].map(s=>({value:s,label:s}))}
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
            zIndex: 1300,
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

      {/* Religion Filter */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Religion
      </Text>
      <Select
        placeholder="Select religion"
        value={filters.religion}
        onChange={(value) => handleFilterChange(value, 'religion')}
        data={[
          {value:'Christianity',label:'Christianity'},
          {value:'Islam',label:'Islam'},
          {value:'Hinduism',label:'Hinduism'},
          {value:'Buddhism',label:'Buddhism'},
          {value:'Judaism',label:'Judaism'},
          {value:'Atheism',label:'Atheism'},
          {value:'Agnostic',label:'Agnostic'},
          {value:'Other',label:'Other'},
        ]}
        mb="md"
        styles={{
          input:{backgroundColor:"rgba(255, 255, 255, 0.05)",color:theme.white,border:"1px solid rgba(255, 255, 255, 0.1)","&::placeholder":{color:theme.colors.dark[2]}},
          dropdown:{backgroundColor:theme.colors.dark[7],border:"1px solid rgba(255, 255, 255, 0.1)",zIndex:1300},
          option:{color:theme.white,"&[data-selected]":{backgroundColor:theme.colors.blue[9],color:theme.white},"&[data-hovered]":{backgroundColor:theme.colors.dark[5]}}
        }}
      />

      {/* Gender Filter */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Gender
      </Text>
      <Select
        placeholder="Select gender"
        value={filters.gender}
        onChange={(value) => handleFilterChange(value, 'gender')}
        data={[
          {value:'Male',label:'Male'},
          {value:'Female',label:'Female'},
          {value:'Non-binary',label:'Non-binary'},
          {value:'Prefer not to say',label:'Prefer not to say'},
        ]}
        mb="md"
        styles={{
          input:{backgroundColor:"rgba(255, 255, 255, 0.05)",color:theme.white,border:"1px solid rgba(255, 255, 255, 0.1)","&::placeholder":{color:theme.colors.dark[2]}},
          dropdown:{backgroundColor:theme.colors.dark[7],border:"1px solid rgba(255, 255, 255, 0.1)",zIndex:1300},
          option:{color:theme.white,"&[data-selected]":{backgroundColor:theme.colors.blue[9],color:theme.white},"&[data-hovered]":{backgroundColor:theme.colors.dark[5]}}
        }}
      />

      {/* Campus Involvement */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Campus Involvement
      </Text>
      <Select
        placeholder="Select status"
        value={filters.campusInvolvement}
        onChange={(value) => handleFilterChange(value, 'campusInvolvement')}
        data={[
          {value:'Rushing a fraternity/sorority',label:'Rushing a fraternity/sorority'},
          {value:'Business fraternity',label:'Business fraternity'},
        ]}
        mb="md"
        styles={{
          input:{backgroundColor:"rgba(255, 255, 255, 0.05)",color:theme.white,border:"1px solid rgba(255, 255, 255, 0.1)"},
          dropdown:{backgroundColor:theme.colors.dark[7],border:"1px solid rgba(255, 255, 255, 0.1)",zIndex:1300},
          option:{color:theme.white,"&[data-selected]":{backgroundColor:theme.colors.blue[9],color:theme.white},"&[data-hovered]":{backgroundColor:theme.colors.dark[5]}}
        }}
      />

      {/* Other */}
      <Text size="sm" fw={500} c={theme.white} mb="xs">
        Other
      </Text>
      <Select
        placeholder="Select option"
        value={filters.other}
        onChange={(value) => handleFilterChange(value, 'other')}
        data={[
          {value:'Looking for a roommate',label:'Looking for a roommate'},
          {value:'Student Athlete',label:'Student Athlete'},
        ]}
        mb="md"
        styles={{
          input:{backgroundColor:"rgba(255, 255, 255, 0.05)",color:theme.white,border:"1px solid rgba(255, 255, 255, 0.1)"},
          dropdown:{backgroundColor:theme.colors.dark[7],border:"1px solid rgba(255, 255, 255, 0.1)",zIndex:1300},
          option:{color:theme.white,"&[data-selected]":{backgroundColor:theme.colors.blue[9],color:theme.white},"&[data-hovered]":{backgroundColor:theme.colors.dark[5]}}
        }}
      />

      {/* Reset Button */}
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
          Reset All
        </Button>
      </Group>

      {/* Non-Premium Info */}
      {!isPremium && (
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
                One Filter at a Time
              </Text>
            </Group>
            <Text size="xs" c="dimmed" ta="center">
              You can use 1 filter free. Upgrade to Premium for unlimited filters.
            </Text>
          </Stack>
        </Paper>
      )}
    </Box>
  );
}; 