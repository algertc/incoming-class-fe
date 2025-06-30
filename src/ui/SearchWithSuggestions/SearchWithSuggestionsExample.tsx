import React, { useState, useCallback } from 'react';
import { Box, Title, Text, Container } from '@mantine/core';
import SearchWithSuggestions from './SearchWithSuggestions';
import type { Suggestion } from './SearchWithSuggestions';

// Example data
const MOCK_SUGGESTIONS: Suggestion[] = [
  { id: '1', label: 'Harvard University', description: 'Cambridge, Massachusetts' },
  { id: '2', label: 'Stanford University', description: 'Stanford, California' },
  { id: '3', label: 'MIT', description: 'Massachusetts Institute of Technology' },
  { id: '4', label: 'Princeton University', description: 'Princeton, New Jersey' },
  { id: '5', label: 'Yale University', description: 'New Haven, Connecticut' },
  { id: '6', label: 'Columbia University', description: 'New York City, New York' },
  { id: '7', label: 'University of Chicago', description: 'Chicago, Illinois' },
  { id: '8', label: 'University of Pennsylvania', description: 'Philadelphia, Pennsylvania' },
];

const SearchWithSuggestionsExample: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Simulate API search
  const handleSearch = useCallback((query: string) => {
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      const filteredSuggestions = MOCK_SUGGESTIONS.filter(suggestion =>
        suggestion.label.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.description?.toLowerCase().includes(query.toLowerCase())
      );
      
      setSuggestions(filteredSuggestions);
      setLoading(false);
    }, 500);
  }, []);

  const handleSelect = useCallback((suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion);
 
  }, []);

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg">Search with Suggestions Example</Title>
      
      <Box mb="xl">
        <SearchWithSuggestions
          label="Search for a university"
          placeholder="Type to search universities..."
          suggestions={suggestions}
          onSearch={handleSearch}
          onSelect={handleSelect}
          value={searchQuery}
          onChange={setSearchQuery}
          loading={loading}
          maxHeight={300}
          debounceMs={500}
        />
      </Box>
      
      {selectedSuggestion && (
        <Box mt="xl">
          <Title order={4} mb="xs">Selected University:</Title>
          <Box p="md" bg="blue.0" style={{ borderRadius: 8 }}>
            <Text fw={600}>{selectedSuggestion.label}</Text>
            {selectedSuggestion.description && (
              <Text size="sm" c="dimmed">{selectedSuggestion.description}</Text>
            )}
          </Box>
        </Box>
      )}
      
      <Box mt="xl">
        <Title order={4} mb="xs">How to use:</Title>
        <Text>
          1. Start typing in the search box to see suggestions
        </Text>
        <Text>
          2. Results will appear after a brief delay (simulating API call)
        </Text>
        <Text>
          3. Click on a suggestion to select it
        </Text>
      </Box>
    </Container>
  );
};

export default SearchWithSuggestionsExample; 