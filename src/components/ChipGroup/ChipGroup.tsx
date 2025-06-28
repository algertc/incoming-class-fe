import React from 'react';
import { Chip, Box } from '@mantine/core';
import styles from './ChipGroup.module.css';

interface ChipGroupProps {
  data: string[];
  // Value can be either a string (single select) or string[] (multi-select)
  value: string | string[];
  // onChange will receive the updated value (string for single, string[] for multi)
  onChange: (_value: any) => void;
  error?: string;
  multiple?: boolean; // Enable multiple selection (default true)
}

export const ChipGroup: React.FC<ChipGroupProps> = ({ data, value, onChange, error, multiple = true }) => (
  <Box className={styles.chipGroupWrapper}>
    {/* Pass 'multiple' prop conditionally */}
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <Chip.Group
      value={value as any}
      onChange={onChange as any}
      {...(multiple ? { multiple: true } : {})}
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

export default ChipGroup; 