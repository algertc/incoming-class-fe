import React, { useState, useEffect } from "react";
import {
  Box,
  TextInput,
  ActionIcon,
  Group,
  Badge,
  useMantineTheme,
  Collapse,
  Paper,
  Text,
} from "@mantine/core";
import {
  IconSearch,
  IconFilter,
  IconX,
  IconCrown,
} from "@tabler/icons-react";
import { useFeedStore } from "../../../store/feed.store";
import { useDebouncedValue } from "@mantine/hooks";
import { useAuthStore } from "../../../store/auth.store";
import { PremiumSubscriptionModal } from "../../../components/common/PremiumSubscriptionModal";

interface MobileSearchBarProps {
  onFiltersClick: () => void;
}

export const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
  onFiltersClick,
}) => {
  const theme = useMantineTheme();
  const { user } = useAuthStore();
  
  // State for premium modal
  const [premiumModalOpened, setPremiumModalOpened] = useState(false);
  const [modalTrigger, setModalTrigger] = useState<string>("search");
  
  // Get feed store state and actions
  const { 
    filters, 
    searchPosts, 
    checkFilterAccess
  } = useFeedStore();

  // Local state for debounced search
  const [searchQuery, setSearchQuery] = useState(filters.searchQuery);
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 300);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Check if user has access to filters
  const hasFilterAccess = checkFilterAccess();

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

  // Handle filter interaction for non-premium users
  const handleFilterInteraction = (trigger: string) => {
    if (!hasFilterAccess) {
      setModalTrigger(trigger);
      setPremiumModalOpened(true);
      return;
    }
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasFilterAccess) {
      handleFilterInteraction("search");
      return;
    }
    setSearchQuery(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    if (!hasFilterAccess) {
      handleFilterInteraction("search");
      return;
    }
    setSearchQuery("");
    searchPosts("");
  };

  // Handle filters button click
  const handleFiltersClick = () => {
    if (!hasFilterAccess) {
      handleFilterInteraction("filters");
      return;
    }
    onFiltersClick();
  };

  // Check if any filters are active (only remaining filters)
  const hasActiveFilters = filters.lastDays !== 30 ||
                          (filters.college !== null && filters.college !== 'all');

  const activeFiltersCount = (filters.lastDays !== 30 ? 1 : 0) +
                            (filters.college !== null && filters.college !== 'all' ? 1 : 0);

  return (
    <>
      <Box mb="md">
        <Paper
          p="sm"
          radius="md"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            border: hasFilterAccess 
              ? "1px solid rgba(255, 255, 255, 0.1)"
              : "1px solid rgba(255, 215, 0, 0.3)",
          }}
        >
          <Group gap="xs" align="center">
            {/* Search Input */}
            <Box style={{ flex: 1 }}>
              <TextInput
                placeholder={hasFilterAccess ? "Search posts..." : "Premium feature - Search posts"}
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => hasFilterAccess && setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                leftSection={<IconSearch size={16} />}
                rightSection={
                  searchQuery && hasFilterAccess ? (
                    <ActionIcon
                      size="sm"
                      variant="transparent"
                      color="gray"
                      onClick={handleClearSearch}
                    >
                      <IconX size={14} />
                    </ActionIcon>
                  ) : !hasFilterAccess ? (
                    <IconCrown size={16} color="#FFD700" />
                  ) : null
                }
                size="md"
                disabled={!hasFilterAccess}
                styles={{
                  input: {
                    backgroundColor: hasFilterAccess 
                      ? "rgba(255, 255, 255, 0.05)"
                      : "rgba(255, 215, 0, 0.05)",
                    color: hasFilterAccess ? theme.white : theme.colors.gray[5],
                    border: isSearchFocused 
                      ? `1px solid ${theme.colors.blue[5]}` 
                      : hasFilterAccess 
                        ? "1px solid rgba(255, 255, 255, 0.1)"
                        : "1px solid rgba(255, 215, 0, 0.3)",
                    "&::placeholder": {
                      color: hasFilterAccess ? theme.colors.dark[2] : theme.colors.gray[6],
                    },
                    "&:disabled": {
                      backgroundColor: "rgba(255, 215, 0, 0.05)",
                      color: theme.colors.gray[5],
                    },
                  },
                }}
              />
            </Box>

            {/* Filter Button */}
            <ActionIcon
              size="lg"
              variant="light"
              color={hasActiveFilters ? "blue" : hasFilterAccess ? "gray" : "yellow"}
              onClick={handleFiltersClick}
              style={{
                position: "relative",
                backgroundColor: hasActiveFilters 
                  ? "rgba(67, 97, 238, 0.2)" 
                  : hasFilterAccess
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(255, 215, 0, 0.1)",
              }}
            >
              {hasFilterAccess ? <IconFilter size={20} /> : <IconCrown size={20} />}
              {activeFiltersCount > 0 && hasFilterAccess && (
                <Badge
                  size="xs"
                  color="red"
                  variant="filled"
                  style={{
                    position: "absolute",
                    top: -2,
                    right: -2,
                    minWidth: 16,
                    height: 16,
                    padding: 0,
                    fontSize: "10px",
                    lineHeight: "16px",
                  }}
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </ActionIcon>
          </Group>

          {/* Premium notice for non-premium users */}
          {!hasFilterAccess && (
            <Box pt="sm">
              <Text size="xs" c="dimmed" ta="center">
                {!user 
                  ? "Sign up to unlock search and filters"
                  : "Upgrade to Premium for advanced search and filters"
                }
              </Text>
            </Box>
          )}

          {/* Active Filters Preview */}
          <Collapse in={hasActiveFilters && hasFilterAccess}>
            <Box pt="sm">
              <Group gap="xs">
                {filters.lastDays !== 30 && (
                  <Badge
                    color="indigo"
                    variant="light"
                    size="xs"
                    styles={{
                      root: {
                        textTransform: "none",
                      },
                    }}
                  >
                    Last {filters.lastDays} days
                  </Badge>
                )}
                {filters.college !== null && filters.college !== 'all' && (
                  <Badge
                    color="green"
                    variant="light"
                    size="xs"
                    styles={{
                      root: {
                        textTransform: "none",
                      },
                    }}
                  >
                    College Filter
                  </Badge>
                )}
              </Group>
            </Box>
          </Collapse>
        </Paper>
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