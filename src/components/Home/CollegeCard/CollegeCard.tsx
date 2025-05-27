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
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current && contentRef.current) {
      // Create a timeline for more complex animation sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reset"
        }
      });
      
      // Initial state of the card
      gsap.set(cardRef.current, { 
        y: 60,
        scale: 0.8, 
        opacity: 0,
        rotationX: 15,
        transformOrigin: "center bottom"
      });
      
      // Initial state of the content (for reveal effect)
      gsap.set(contentRef.current.children, { 
        y: 20, 
        opacity: 0 
      });
      
      // Card entrance animation
      tl.to(cardRef.current, {
        y: 0,
        scale: 1,
        opacity: 1,
        rotationX: 0,
        duration: 0.7,
        delay: 0.12 * index, // Staggered delay based on card index
        ease: "back.out(1.2)",
      })
      
      // Content reveal animation (staggered children)
      .to(contentRef.current.children, {
        y: 0,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      }, "-=0.2"); // Slight overlap with the card animation
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
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? '0 10px 20px -10px rgba(67, 97, 238, 0.4)' : 'none',
        perspective: '1000px',
      }}
    >
      <Stack ref={contentRef} gap="xs" align="center">
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