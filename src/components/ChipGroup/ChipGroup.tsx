import React from 'react';
import { Chip, Box } from '@mantine/core';
import styles from './ChipGroup.module.css';

interface ChipGroupProps {
  data: string[];
  value: string[];
  onChange: (value: string[]) => void;
  error?: string;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({ data, value, onChange, error }) => (
  <Box className={styles.chipGroupWrapper}>
    <Chip.Group
      value={value}
      onChange={onChange}
      multiple
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
    {error && (
      <div className={styles.error}>{error}</div>
    )}
  </Box>
);

export default ChipGroup; 