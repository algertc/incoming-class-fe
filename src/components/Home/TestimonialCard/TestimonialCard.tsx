import React, { useRef, useEffect } from 'react';
import { Paper, Avatar, Text, Group, Stack, useMantineTheme } from '@mantine/core';
import { useHover } from '@mantine/hooks';
import gsap from 'gsap';

export interface TestimonialProps {
  content: string;
  author: string;
  title?: string;
  avatar: string;
}

export const TestimonialCard: React.FC<TestimonialProps> = ({ content, author, title, avatar }) => {
  const theme = useMantineTheme();
  const hoverState = useHover();
  const hovered = hoverState.hovered;
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
        backgroundColor: hovered ? `rgba(74, 93, 253, 0.1)` : theme.colors.dark[8],
        border: `1px solid ${hovered ? theme.colors.blue[5] : theme.colors.dark[7]}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        transform: hovered ? 'translate3d(0, -8px, 0)' : 'translate3d(0, 0, 0)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <Stack gap="lg" style={{ flex: 1, justifyContent: 'space-between' }}>
        <Text c={theme.colors.dark[1]} size="md" style={{ lineHeight: 1.6 }}>
          "{content}"
        </Text>
        
        <Group gap="md" align="center">
          <Avatar 
            src={avatar} 
            alt={author} 
            radius="xl" 
            size="lg"
            style={{
              width: 60,
              height: 60,
              border: `2px solid ${theme.colors.blue[5]}`,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }}
          />
          <div>
            <Text fw={700} size="md" c={theme.white}>
              {author}
            </Text>
            {title && (
              <Text size="sm" c={theme.colors.dark[3]}>
                {title}
              </Text>
            )}
          </div>
        </Group>
      </Stack>
    </Paper>
  );
};

export default TestimonialCard; 