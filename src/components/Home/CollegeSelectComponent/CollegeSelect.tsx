import React, { useState, useCallback } from "react";
import { useLocalStorage } from "@mantine/hooks";
import SearchWithSuggestions from "../../../ui/SearchWithSuggestions/SearchWithSuggestions";
import type { Suggestion } from "../../../ui/SearchWithSuggestions/SearchWithSuggestions";

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
  
  const [filteredColleges, setFilteredColleges] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Handle search query changes
  const handleSearch = useCallback((query: string) => {
    setLoading(true);
    
    // Simulate a brief delay like a real API call would have
    setTimeout(() => {
      const results = COLLEGES.filter(college => 
        college.label.toLowerCase().includes(query.toLowerCase()) ||
        college.description?.toLowerCase().includes(query.toLowerCase())
      );
      
      setFilteredColleges(results);
      setLoading(false);
    }, 300);
  }, []);

  // Handle college selection
  const handleSelect = useCallback((college: Suggestion) => {
    setSelectedCollege(college.id);
  }, [setSelectedCollege]);

  return (
    <SearchWithSuggestions
      label="Find your college"
      placeholder="Search for your university..."
      suggestions={filteredColleges}
      onSearch={handleSearch}
      onSelect={handleSelect}
      value={searchQuery}
      onChange={setSearchQuery}
      loading={loading}
      width="100%"
      maxHeight={400}
      debounceMs={300}
    />
  );
};

export default CollegeSelect;
