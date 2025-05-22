import React, { useState, useCallback } from "react";
import { Box, Text, ScrollArea, Group, Badge } from "@mantine/core";

interface Option {
  value: string;
  label: string;
}

interface ThreeDSelectProps {
  options: Option[];
  placeholder: string;
  onChange: (value: string[] | string) => void;
  value: string[] | string;
  width?: number;
  maxHeight?: number;
  disabled?: boolean;
  multiple?: boolean;
}

const ThreeDSelect: React.FC<ThreeDSelectProps> = ({
  options,
  placeholder,
  onChange,
  value,
  width = 500,
  maxHeight = 200,
  disabled = false,
  multiple = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Normalize value to always be an array internally
  const normalizedValue = Array.isArray(value) ? value : value ? [value] : [];
  const [selectedItems, setSelectedItems] = useState<string[]>(normalizedValue);

  const handleToggle = useCallback((): void => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleItemClick = useCallback(
    (optionValue: string): void => {
      if (multiple) {
        const isSelected = selectedItems.includes(optionValue);
        const newSelected = isSelected
          ? selectedItems.filter((item) => item !== optionValue)
          : [...selectedItems, optionValue];

        setSelectedItems(newSelected);
        onChange(newSelected);
      } else {
        setSelectedItems([optionValue]);
        onChange(optionValue);
        setIsOpen(false);
      }
    },
    [selectedItems, onChange, multiple]
  );

  const selectedCount: number = selectedItems.length;

  const displayText: string =
    selectedCount === 0
      ? placeholder
      : multiple
      ? `Selected: ${selectedCount} of ${options.length}`
      : options.find((opt) => opt.value === selectedItems[0])?.label ||
        placeholder;

  return (
    <Box
      style={{
        width,
        position: "relative",
        perspective: "800px",
        zIndex: 999999,
      }}
    >
      {/* Main Trigger Button */}
      <Box
        onClick={handleToggle}
        style={{
          background:
            "linear-gradient(135deg, #FFE5E5 0%, #FFF5E5 50%, #E5F3FF 100%)",
          border: "2px solid #333",
          borderRadius: "8px",
          padding: "12px 16px",
          cursor: disabled ? "not-allowed" : "pointer",
          position: "relative",
          transformStyle: "preserve-3d",
          transformOrigin: "50% 0%",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: isOpen ? "rotateX(15deg)" : "rotateX(0deg)",
          zIndex: 999990,
          opacity: disabled ? 0.6 : 1,
        }}
      >
        {/* Shadow Effect */}
        <Box
          style={{
            position: "absolute",
            bottom: "-8px",
            left: "4px",
            right: "4px",
            height: "8px",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 100%)",
            borderRadius: "0 0 8px 8px",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.3s ease",
            transform: "translateZ(-1px)",
            zIndex: 999989,
          }}
        />

        {/* Overlay Effect */}
        <Box
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.05) 100%)",
            borderRadius: "6px",
            opacity: isOpen ? 1 : 0,
            transition: "opacity 0.3s ease",
            zIndex: 999991,
          }}
        />

        <Group
          justify="space-between"
          align="center"
          style={{ position: "relative", zIndex: 999992 }}
        >
          <Text size="sm" c="#333" fw={500}>
            {displayText}
          </Text>
          {/* CSS-only chevron arrow */}
          <Box
            style={{
              width: "0",
              height: "0",
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "6px solid #333",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease",
              zIndex: 999993,
            }}
          />
        </Group>

        {multiple && selectedCount > 0 && (
          <Badge
            size="xs"
            variant="filled"
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              background: "#FF6B6B",
              color: "white",
              zIndex: 999994,
            }}
          >
            {selectedCount}
          </Badge>
        )}
      </Box>

      {/* Dropdown Menu */}
      <Box
        style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          marginTop: "4px",
          background: "white",
          border: "2px solid #333",
          borderRadius: "8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          opacity: isOpen ? 1 : 0,
          transform: isOpen
            ? "translateY(0) scale(1)"
            : "translateY(-10px) scale(0.95)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          visibility: isOpen ? "visible" : "hidden",
          zIndex: 999995,
          overflow: "hidden",
        }}
      >
        <ScrollArea
          h={Math.min(maxHeight, options.length * 45)}
          scrollbarSize={6}
          style={{ zIndex: 999996 }}
        >
          <Box p="xs" style={{ zIndex: 999997 }}>
            {options.map((option: Option) => {
              const isSelected: boolean = selectedItems.includes(option.value);
              return (
                <Box
                  key={option.value}
                  onClick={() => handleItemClick(option.value)}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    background: isSelected
                      ? "linear-gradient(135deg, #E5F3FF 0%, #E5E5FF 100%)"
                      : "transparent",
                    border: isSelected
                      ? "1px solid #4A90E2"
                      : "1px solid transparent",
                    marginBottom: "2px",
                    position: "relative",
                    zIndex: 999998,
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!isSelected) {
                      (e.target as HTMLDivElement).style.background = "#F8F9FA";
                    }
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    if (!isSelected) {
                      (e.target as HTMLDivElement).style.background =
                        "transparent";
                    }
                  }}
                >
                  <Group gap="xs" align="center" style={{ zIndex: 999999 }}>
                    {multiple && (
                      <Box
                        style={{
                          width: "18px",
                          height: "18px",
                          border: `2px solid ${
                            isSelected ? "#4A90E2" : "#CCC"
                          }`,
                          borderRadius: "3px",
                          background: isSelected ? "#4A90E2" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease",
                          zIndex: 999999,
                        }}
                      >
                        {isSelected && (
                          <Box
                            style={{
                              fontSize: "12px",
                              color: "white",
                              fontWeight: "bold",
                              zIndex: 999999,
                            }}
                          >
                            ✓
                          </Box>
                        )}
                      </Box>
                    )}
                    <Text
                      size="sm"
                      c={isSelected ? "#333" : "#555"}
                      fw={isSelected ? 500 : 400}
                      style={{ zIndex: 999999 }}
                    >
                      {option.label}
                    </Text>
                  </Group>
                </Box>
              );
            })}
          </Box>
        </ScrollArea>
      </Box>

      {/* Click outside to close */}
      {isOpen && (
        <Box
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999980,
          }}
        />
      )}
    </Box>
  );
};

export default ThreeDSelect;
