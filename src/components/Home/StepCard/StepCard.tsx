import React, { useRef, useEffect } from 'react';
import { Box, Paper, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import gsap from 'gsap';

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

export const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => {
  const theme = useMantineTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      // Card animation
      gsap.fromTo(
        cardRef.current,
        { 
          x: -30, 
          opacity: 0 
        },
        { 
          x: 0, 
          opacity: 1, 
          duration: 0.6, 
          delay: 0.1 * number, // Stagger based on step number
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    if (circleRef.current) {
      // Number circle animation
      gsap.fromTo(
        circleRef.current,
        { 
          scale: 0,
          rotate: -30
        },
        { 
          scale: 1,
          rotate: 0,
          duration: 0.5, 
          delay: 0.1 * number + 0.3, // Slightly delayed after card appears
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, [number]);
  
  return (
    <Paper
      ref={cardRef}
      p="lg"
      radius="md"
      style={{
        backgroundColor: theme.colors.dark[8],
        border: `1px solid ${theme.colors.dark[7]}`,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        ref={circleRef}
        style={{
          position: 'absolute',
          top: -15,
          left: -15,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: theme.colors.blue[5],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        <Text fw={700} size="xl" c={theme.white}>
          {number}
        </Text>
      </Box>
      
      <Stack gap="sm" pl={40} pt={15}>
        <Title order={4} c={theme.white}>
          {title}
        </Title>
        <Text c={theme.colors.dark[2]} size="sm">
          {description}
        </Text>
      </Stack>
    </Paper>
  );
};

export default StepCard; 