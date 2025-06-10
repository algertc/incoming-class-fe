import React, { useState, useCallback, useMemo } from "react";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { Box, useMantineTheme } from "@mantine/core";
import SearchWithSuggestions from "../../../ui/SearchWithSuggestions/SearchWithSuggestions";
import type { Suggestion } from "../../../ui/SearchWithSuggestions/SearchWithSuggestions";
import { useCollegeSearch } from "../../../hooks/api/useColleges";
import type { College } from "../../../hooks/api/types";

// College data with additional location information
const COLLEGES: Suggestion[] = [
  { id: "harvard_university", label: "Harvard University", description: "Cambridge, Massachusetts" },
  { id: "stanford_university", label: "Stanford University", description: "Stanford, California" },
  { id: "mit", label: "Massachusetts Institute of Technology", description: "Cambridge, Massachusetts" },
  { id: "uc_berkeley", label: "University of California, Berkeley", description: "Berkeley, California" },
  { id: "princeton_university", label: "Princeton University", description: "Princeton, New Jersey" },
  { id: "yale_university", label: "Yale University", description: "New Haven, Connecticut" },
  { id: "columbia_university", label: "Columbia University", description: "New York City, New York" },
  { id: "uchicago", label: "University of Chicago", description: "Chicago, Illinois" },
];

const CollegeSelect: React.FC = () => {
  const [selectedCollege, setSelectedCollege] = useLocalStorage({
    key: "college",
    defaultValue: "",
  });

  
  const [searchQuery, setSearchQuery] = useState<string>(
    // Initialize search query with the label of the selected college if any
    COLLEGES.find(college => college.id === selectedCollege)?.label || ""
  );
  
  const {data, isLoading} = useCollegeSearch({
    search: searchQuery,
    limit: 6,
    page: 1,
  });

  const colleges=useMemo(()=>{
    return data?.data.map((college:College)=>({
      id:college.name,
      label:college.name,
      description:college.location,
    })) || [];
  },[data]);

  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Handle search query changes
  const handleSearch = useCallback((query: string) => {
      setSearchQuery(query);
  }, []);

  // Handle college selection
  const handleSelect = useCallback((college: Suggestion) => {
    setSelectedCollege(college.id);
  }, [setSelectedCollege]);

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
