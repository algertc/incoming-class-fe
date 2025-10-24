export const ASPECT_RATIO_MAP: Record<string, number> = {
  square: 1 / 1,
  vertical: 4 / 5,
  landscape: 1.91 / 1,
};

export const ASPECT_RATIO_LABELS: Record<string, string> = {
  square: 'Square',
  vertical: 'Vertical',
  landscape: 'Landscape',
};

/**
 * Gets the numerical value of an aspect ratio from its string label.
 * @param label The string label (e.g., 'square').
 * @returns The numerical aspect ratio, or undefined if the label is invalid.
 */
export const getAspectRatioNumber = (label?: string): number | undefined => {
  if (!label || !ASPECT_RATIO_MAP[label]) {
    return undefined;
  }
  return ASPECT_RATIO_MAP[label];
};

/**
 * Gets the string label of an aspect ratio from its numerical value.
 * @param value The numerical aspect ratio.
 * @returns The string label (e.g., 'square'), or undefined if the value is not found.
 */
export const getAspectRatioLabel = (value?: number): string | undefined => {
  if (value === undefined) return undefined;
  for (const label in ASPECT_RATIO_MAP) {
    if (ASPECT_RATIO_MAP[label] === value) {
      return label;
    }
  }
  return undefined;
}; 