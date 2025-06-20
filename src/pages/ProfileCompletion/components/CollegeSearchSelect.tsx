import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import {
  Box,
  Text,
  ScrollArea,
  Group,
  TextInput,
  Loader,
} from "@mantine/core";
import { IconChevronDown, IconSearch } from "@tabler/icons-react";
import { useCollegeSearch } from "../../../hooks/api";
import type { College } from "../../../hooks/api/types";

interface CollegeSearchSelectProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string, collegeId?: string) => void;
  error?: string;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  classNames?: {
    label?: string;
    input?: string;
    dropdown?: string;
    option?: string;
  };
}

const CollegeSearchSelect: React.FC<CollegeSearchSelectProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  size = "md",
  classNames = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const componentRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // College search API call
  const { data: collegeData, isLoading } = useCollegeSearch({
    search: searchQuery,
    limit: 10,
    page: 1,
  });

  // Transform college data to include both id and name
  const colleges = useMemo(() => {
    return collegeData?.data.colleges.map((college: College) => ({
      id: college._id, // Use the actual MongoDB _id
      name: college.name,
      label: college.name,
      description: college.location,
    })) || [];
  }, [collegeData]);

  // Check dropdown position
  useEffect(() => {
    if (isOpen && componentRef.current) {
      const rect = componentRef.current.getBoundingClientRect();
      const availableSpaceBelow = window.innerHeight - rect.bottom;
      const estimatedDropdownHeight = Math.min(300, colleges.length * 60);
      
      if (availableSpaceBelow < estimatedDropdownHeight && rect.top > estimatedDropdownHeight) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    }
  }, [isOpen, colleges.length]);

  // Handle outside click
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
  const handleSearch = useCallback((inputValue: string) => {
    setSearchQuery(inputValue);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      // Search is handled by the API call above
    }, 300);
  }, []);

  const handleInputClick = () => {
    if (isOpen) {
      // If dropdown is open, close it
      setIsOpen(false);
    } else {
      // If dropdown is closed, open it
      setIsOpen(true);
      if (!searchQuery) {
        setSearchQuery(""); // Trigger initial load
      }
    }
  };

  const handleCollegeSelect = (college: { id: string; name: string; label: string; description?: string }) => {
    onChange(college.name, college.id);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <Box ref={componentRef} style={{ position: 'relative', zIndex: isOpen ? 10 : 1 }}>
      {/* Label */}
      <Text className={classNames.label} size={size === "sm" ? "sm" : "md"} fw={500} mb={5}>
        {label} {required && <span style={{ color: 'red' }}>*</span>}
      </Text>

      {/* Input that looks like Select */}
      <Box
        className={classNames.input}
        onClick={handleInputClick}
        style={{
          cursor: 'pointer',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: size === "sm" ? '8px 12px' : '10px 16px',
          minHeight: size === "sm" ? '36px' : '42px',
          fontSize: size === "sm" ? '14px' : '16px',
          border: error ? '1px solid red' : undefined,
        }}
      >
        <Text 
          style={{ 
            color: value ? 'white' : 'var(--mantine-color-gray-5)',
            flex: 1,
            textAlign: 'left'
          }}
        >
          {value || placeholder}
        </Text>
        <IconChevronDown 
          size={16} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }} 
        />
      </Box>

      {/* Error message */}
      {error && (
        <Text size="sm" c="red" mt={4}>
          {error}
        </Text>
      )}

      {/* Dropdown */}
      {isOpen && (
        <Box
          className={classNames.dropdown}
          style={{
            position: 'absolute',
            top: dropdownPosition === 'bottom' ? '100%' : 'auto',
            bottom: dropdownPosition === 'top' ? '100%' : 'auto',
            left: 0,
            right: 0,
            zIndex: 9999,
            marginTop: dropdownPosition === 'bottom' ? '4px' : '0',
            marginBottom: dropdownPosition === 'top' ? '4px' : '0',
            borderRadius: '4px',
            maxHeight: '300px',
            overflow: 'hidden',
            backgroundColor: 'var(--mantine-color-dark-7)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Search input inside dropdown */}
          <Box p="sm" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <TextInput
              placeholder="Search universities..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              leftSection={<IconSearch size={16} />}
              rightSection={isLoading ? <Loader size="xs" /> : null}
              size="sm"
              styles={{
                input: {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  '&::placeholder': {
                    color: 'var(--mantine-color-gray-5)',
                  },
                },
              }}
            />
          </Box>

          {/* Options */}
          <ScrollArea h={250} scrollbarSize={6}>
            <Box>
              {colleges.length > 0 ? (
                colleges.map((college) => (
                  <Box
                    key={college.id}
                    className={classNames.option}
                    onClick={() => handleCollegeSelect(college)}
                    p="sm"
                    style={{
                      cursor: 'pointer',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      transition: 'background-color 0.2s ease',
                      backgroundColor: value === college.label ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (value !== college.label) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (value === college.label) {
                        e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
                      } else {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <Group gap="xs" align="flex-start">
                      <Box style={{ flex: 1 }}>
                        <Text 
                          size="sm" 
                          fw={value === college.label ? 600 : 500} 
                          c={value === college.label ? 'white' : 'white'}
                        >
                          {college.label}
                        </Text>
                        {college.description && (
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {college.description}
                          </Text>
                        )}
                      </Box>
                      {value === college.label && (
                        <Text size="xs" c="blue" fw={600}>
                          ✓
                        </Text>
                      )}
                    </Group>
                  </Box>
                ))
              ) : (
                <Box p="sm">
                  <Text size="sm" c="white" ta="center" style={{ opacity: 0.7 }}>
                    {isLoading ? 'Searching...' : searchQuery ? 'No universities found' : 'Start typing to search'}
                  </Text>
                </Box>
              )}
            </Box>
          </ScrollArea>
        </Box>
      )}
    </Box>
  );
};

export default CollegeSearchSelect; 