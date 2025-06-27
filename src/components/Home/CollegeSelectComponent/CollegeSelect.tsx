import React, { useState, useCallback, useMemo } from "react";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { Box, useMantineTheme } from "@mantine/core";
import SearchWithSuggestions from "../../../ui/SearchWithSuggestions/SearchWithSuggestions";
import type { Suggestion } from "../../../ui/SearchWithSuggestions/SearchWithSuggestions";
import { useCollegeSearch } from "../../../hooks/api/useColleges";
import type { College } from "../../../hooks/api/types";
import { useNavigate } from "react-router";
import { useFeedStore } from "../../../store/feed.store";

const CollegeSelect: React.FC = () => {
  const navigate = useNavigate();
  const { setCollege } = useFeedStore();
  const [, setSelectedCollege] = useLocalStorage({
    key: "college",
    defaultValue: "",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const {data, isLoading} = useCollegeSearch({
    search: searchQuery,
    limit: 6,
    page: 1,
  });

  const colleges = useMemo(() => {
    return data?.data.colleges.map((college: College) => ({
      id: college._id, // Use _id instead of name
      label: college.name,
      description: college.location,
    })) || [];
  }, [data]);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Handle search query changes
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Handle college selection
  const handleSelect = useCallback((college: Suggestion) => {
    setSelectedCollege(college.id);
    // Set the college filter in feed store
    setCollege(college.id);
    // Redirect to feed page with college parameter to show modal
    navigate(`/feed?college=${encodeURIComponent(college.label)}&from=hero`);
  }, [setSelectedCollege, setCollege, navigate]);

  return (
    <Box style={{ width: "100%" }}>
      <SearchWithSuggestions
        label="Find your college"
        placeholder={isMobile ? "Search college..." : "Search for your university..."}
        suggestions={colleges}
        onSearch={handleSearch}
        onSelect={handleSelect}
        value={searchQuery}
        onChange={setSearchQuery}
        loading={isLoading}
        width="100%"
        maxHeight={isMobile ? 300 : 400}
        debounceMs={300}
      />
    </Box>
  );
};

export default CollegeSelect;
