import React, { useRef, useEffect } from 'react';
import { Badge, Paper, Stack, Text, useMantineTheme } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import gsap from 'gsap';

interface CollegeCardProps {
  name: string;
  count: number;
  index: number;
}

export const CollegeCard: React.FC<CollegeCardProps> = ({ name, count, index }) => {
  const hoverState = useHover();
  const hovered = hoverState.hovered;
  const theme = useMantineTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      // Staggered entrance animation
      gsap.fromTo(
        cardRef.current,
        { 
          y: 40, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5,
          delay: 0.07 * index, // Stagger based on index
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
      
      // Subtle floating animation - different for each card to create wave effect
      gsap.to(
        cardRef.current,
        {
          y: (index % 2 === 0) ? "-8px" : "-12px",
          duration: 2 + (index % 3) * 0.4, // Varying durations
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2 // Staggered start times
        }
      );
    }
  }, [index]);
  
  return (
    <Paper
      ref={node => {
        // Update the div reference for animations
        cardRef.current = node;
        // Update the hover reference
        hoverState.ref.current = node;
      }}
      p="md"
      radius="md"
      style={{
        backgroundColor: hovered ? `rgba(74, 93, 253, 0.1)` : theme.colors.dark[8], 
        border: `1px solid ${hovered ? theme.colors.blue[5] : theme.colors.dark[7]}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
    >
      <Stack gap="xs" align="center">
        <Text fw={600} c={theme.white} ta="center">{name}</Text>
        <Badge 
          variant="filled" 
          color={hovered ? "blue" : "dark"}
          radius="sm"
        >
          {count} students
        </Badge>
      </Stack>
    </Paper>
  );
};

export default CollegeCard; 