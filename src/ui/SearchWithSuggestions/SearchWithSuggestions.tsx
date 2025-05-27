import React, { useState, useCallback, useRef, useEffect } from "react";
import { Box, Text, ScrollArea, Group, TextInput, Loader, useMantineTheme } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useMediaQuery } from '@mantine/hooks';
import classes from "./SearchWithSuggestions.module.scss";

export interface Suggestion {
  id: string;
  label: string;
  description?: string;
}

interface SearchWithSuggestionsProps {
  placeholder?: string;
  suggestions: Suggestion[];
  onSearch: (_query: string) => void;
  onSelect: (_suggestion: Suggestion) => void;
  value: string;
  onChange: (_value: string) => void;
  width?: number | string;
  maxHeight?: number;
  loading?: boolean;
  disabled?: boolean;
  label?: string;
  error?: string;
  debounceMs?: number;
}

export const SearchWithSuggestions: React.FC<SearchWithSuggestionsProps> = ({
  placeholder = "Search...",
  suggestions,
  onSearch,
  onSelect,
  value,
  onChange,
  width = "100%",
  maxHeight = 300,
  loading = false,
  disabled = false,
  error,
  debounceMs = 300,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const componentRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  
  // Check if dropdown should open upward
  useEffect(() => {
    if (isOpen && componentRef.current) {
      const rect = componentRef.current.getBoundingClientRect();
      const availableSpaceBelow = window.innerHeight - rect.bottom;
      const estimatedDropdownHeight = Math.min(maxHeight, suggestions.length * 60);
      
      if (availableSpaceBelow < estimatedDropdownHeight && rect.top > estimatedDropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen, suggestions.length, maxHeight]);
  
  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debounced search
  const handleInputChange = useCallback((inputValue: string) => {
    onChange(inputValue);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if (inputValue.trim()) {
        onSearch(inputValue);
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, debounceMs);
  }, [onChange, onSearch, debounceMs]);

  const handleSuggestionClick = useCallback((suggestion: Suggestion) => {
    onSelect(suggestion);
    onChange(suggestion.label);
    setIsOpen(false);
  }, [onSelect, onChange]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (value && suggestions.length > 0) {
      setIsOpen(true);
    }
  }, [value, suggestions.length]);

  const handleClear = useCallback(() => {
    onChange('');
    setIsOpen(false);
  }, [onChange]);

  return (
    <Box
      ref={componentRef}
      className={classes.container}
      style={{ width }}
    >
      
      {/* Search Input */}
      <Box
        className={`${classes.inputWrapper} ${isOpen ? classes.inputWrapperOpen : classes.inputWrapperClosed}`}
      >
        {/* Shadow Effect */}
        <Box
          className={`${classes.shadow} ${isOpen ? classes.shadowVisible : classes.shadowHidden}`}
        />

        <TextInput
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          error={error}
          leftSection={<IconSearch size={16} color="#333" />}
          rightSection={
            loading ? (
              <Loader size="xs" />
            ) : value ? (
              <IconX 
                size={16} 
                style={{ cursor: 'pointer' }} 
                onClick={handleClear}
                color="#333"
              />
            ) : null
          }
          classNames={{
            input: `${classes.input} ${isFocused ? classes.inputFocused : ''} ${error ? classes.inputError : ''}`,
            section: classes.section,
            root: classes.inputRoot
          }}
          style={{ width: '100%' }}
          size={isMobile ? "md" : "lg"}
        />
      </Box>

      {/* Error message */}
      {error && (
        <Text className={classes.errorMessage} size={isMobile ? "xs" : "sm"}>
          {error}
        </Text>
      )}

      {/* Suggestions Dropdown */}
      <Box
        className={`${classes.dropdown} ${isOpen && suggestions.length > 0 ? classes.dropdownVisible : classes.dropdownHidden} ${dropdownPosition === 'top' ? classes.dropdownTop : classes.dropdownBottom}`}
      >
        <ScrollArea h={Math.min(maxHeight, suggestions.length * 60)} scrollbarSize={6}>
          <Box p={isMobile ? "xs" : "md"}>
            {suggestions.map((suggestion) => (
              <Box
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={classes.suggestionItem}
              >
                <Group gap="xs" align="flex-start">
                  <Box style={{ flex: 1 }}>
                    <Text className={classes.suggestionLabel} size={isMobile ? "sm" : "md"}>
                      {suggestion.label}
                    </Text>
                    {suggestion.description && (
                      <Text className={classes.suggestionDescription} lineClamp={1} size={isMobile ? "xs" : "sm"}>
                        {suggestion.description}
                      </Text>
                    )}
                  </Box>
                </Group>
              </Box>
            ))}
          </Box>
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default SearchWithSuggestions; 