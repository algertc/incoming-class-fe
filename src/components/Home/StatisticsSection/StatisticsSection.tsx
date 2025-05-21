import React, { useRef, useEffect } from 'react';
import { Box, Container, Grid, Stack, Text, useMantineTheme } from '@mantine/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const StatisticsSection: React.FC = () => {
  const theme = useMantineTheme();
  const statsRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stats section animation
    if (statsRef.current) {
      // First animate the entire section
      gsap.fromTo(
        statsRef.current,
        { y: 30, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top bottom-=50",
            toggleActions: "play none none none",
            onEnter: () => {
              // Once the section is visible, animate the counters
              
              // Animate the first stat (10,000+)
              if (stat1Ref.current) {
                const value = { val: 0 };
                gsap.to(value, {
                  val: 10000,
                  duration: 2.5,
                  ease: "power2.out",
                  onUpdate: function() {
                    if (stat1Ref.current) {
                      stat1Ref.current.innerHTML = Math.floor(value.val).toLocaleString() + '+';
                    }
                  }
                });
              }
              
              // Animate the second stat (78%)
              if (stat2Ref.current) {
                const value = { val: 0 };
                gsap.to(value, {
                  val: 78,
                  duration: 2,
                  ease: "power2.out",
                  onUpdate: function() {
                    if (stat2Ref.current) {
                      stat2Ref.current.innerHTML = Math.floor(value.val) + '%';
                    }
                  }
                });
              }
              
              // Animate the third stat (50+)
              if (stat3Ref.current) {
                const value = { val: 0 };
                gsap.to(value, {
                  val: 50,
                  duration: 1.8,
                  ease: "power2.out",
                  onUpdate: function() {
                    if (stat3Ref.current) {
                      stat3Ref.current.innerHTML = Math.floor(value.val) + '+';
                    }
                  }
                });
              }
            }
          }
        }
      );
    }
  }, []);

  return (
    <Box 
      ref={statsRef}
      style={{ 
        backgroundColor: theme.colors.blue[7],
        padding: '20px 0'
      }}
    >
      <Container size="xl">
        <Grid gutter={0}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap={0} align="center" py="md">
              <Text fw={700} size="xl" c={theme.white}>
                <div ref={stat1Ref}>0+</div>
              </Text>
              <Text size="sm" c={theme.white} opacity={0.8}>Active Students</Text>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap={0} align="center" py="md">
              <Text fw={700} size="xl" c={theme.white}>
                <div ref={stat2Ref}>0%</div>
              </Text>
              <Text size="sm" c={theme.white} opacity={0.8}>Find Roommates</Text>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap={0} align="center" py="md">
              <Text fw={700} size="xl" c={theme.white}>
                <div ref={stat3Ref}>0+</div>
              </Text>
              <Text size="sm" c={theme.white} opacity={0.8}>Colleges</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default StatisticsSection; 