import React, { useRef, useEffect } from 'react';
import { Paper, Stack, Text, Title, useMantineTheme } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import gsap from 'gsap';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  const hoverState = useHover();
  const hovered = hoverState.hovered;
  const theme = useMantineTheme();
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animation for when the card enters viewport
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { 
          y: 50, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, []);
  
  return (
    <Paper
      ref={node => {
        // Update the div reference for animations
        cardRef.current = node;
        // Update the hover reference
        hoverState.ref.current = node;
      }}
      p="xl"
      radius="md"
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: hovered ? `rgba(74, 93, 253, 0.08)` : theme.colors.dark[8],
        border: `1px solid ${hovered ? theme.colors.blue[5] : theme.colors.dark[7]}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        transform: hovered ? 'translate3d(0, -5px, 0)' : 'translate3d(0, 0, 0)',
        padding: '2rem',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <Stack gap="lg" align="center">
        <Text size="xxl" style={{ fontSize: 48 }}>
          {icon}
        </Text>
        <Title order={3} fw={600} c={theme.white} ta="center">
          {title}
        </Title>
        <Text c={theme.colors.dark[2]} size="md" ta="center">
          {description}
        </Text>
      </Stack>
    </Paper>
  );
};

export default FeatureCard; 