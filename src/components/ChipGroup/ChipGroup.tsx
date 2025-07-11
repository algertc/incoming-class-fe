import React from 'react';
import { Chip, Box } from '@mantine/core';
import styles from './ChipGroup.module.css';

interface ChipGroupProps {
  data: string[];
  // Value can be either a string (single select) or string[] (multi-select)
  value: string | string[];
  // onChange will receive the updated value (string for single, string[] for multi)
  onChange: (value: string | string[]) => void;
  error?: string;
  multiple?: boolean; // Enable multiple selection (default true)
  'data-error'?: string; // Add data-error attribute
}

export const ChipGroup: React.FC<ChipGroupProps> = ({ 
  data, 
  value, 
  onChange, 
  error, 
  multiple = true,
  'data-error': dataError 
}) => {
  const handleChange = (newValue: string | string[]) => {
    if (multiple) {
      // For multiple selection, return array as-is
      onChange(newValue);
    } else {
      // For single selection, extract the single value from array
      const singleValue = Array.isArray(newValue) ? newValue[0] || '' : newValue;
      onChange(singleValue);
    }
  };

  return (
    <Box className={styles.chipGroupWrapper} data-error={dataError}>
      <Chip.Group
        value={value}
        onChange={handleChange}
        multiple={multiple}
      >
        {data.map((item) => (
          <Chip
            key={item}
            value={item}
            className={styles.chip}
            variant="filled"
          >
            {item}
          </Chip>
        ))}
      </Chip.Group>
      {error && <div className={styles.error}>{error}</div>}
    </Box>
  );
};

export default ChipGroup; 