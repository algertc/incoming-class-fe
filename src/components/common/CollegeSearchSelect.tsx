import React, { useState, useCallback, useMemo } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Box, useMantineTheme } from "@mantine/core";
import SearchWithSuggestions from "../../ui/SearchWithSuggestions/SearchWithSuggestions";
import type { Suggestion } from "../../ui/SearchWithSuggestions/SearchWithSuggestions";
import { useCollegeSearch } from "../../hooks/api/useColleges";
import type { College } from "../../hooks/api/types";

interface CollegeSearchSelectProps {
  onSelect: (college: { id: string, name: string }) => void;
}

const CollegeSearchSelect: React.FC<CollegeSearchSelectProps> = ({ onSelect }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  const { data, isLoading } = useCollegeSearch({
    search: searchQuery,
    limit: 6,
    page: 1,
  });

  const colleges = useMemo(() => {
    return data?.data.colleges.map((college: College) => ({
      id: college._id,
      label: college.name,
      description: college.location,
    })) || [];
  }, [data]);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleSelect = useCallback((college: Suggestion) => {
    onSelect({ id: college.id, name: college.label });
  }, [onSelect]);

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

export default CollegeSearchSelect; 