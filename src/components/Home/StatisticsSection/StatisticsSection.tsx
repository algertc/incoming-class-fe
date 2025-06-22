import React, { useRef, useEffect } from 'react';
import { Box, Container, Grid, Stack, Text, useMantineTheme } from '@mantine/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLandingPageStats } from '../../../hooks/api/useStats';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const StatisticsSection: React.FC = () => {
  const theme = useMantineTheme();
  const statsRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLDivElement>(null);
  const stat2Ref = useRef<HTMLDivElement>(null);
  const stat3Ref = useRef<HTMLDivElement>(null);

  const { data: statsResponse } = useLandingPageStats();
  const stats = statsResponse?.data || { totalUsers: 0, totalColleges: 0, totalPosts: 0 };

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
              
              // Animate the first stat (total users)
              if (stat1Ref.current) {
                const value = { val: 0 };
                gsap.to(value, {
                  val: stats.totalUsers,
                  duration: 2.5,
                  ease: "power2.out",
                  onUpdate: function() {
                    if (stat1Ref.current) {
                      stat1Ref.current.innerHTML = Math.floor(value.val).toLocaleString() + '+';
                    }
                  }
                });
              }
              
              // Animate the second stat (total posts)
              if (stat2Ref.current) {
                const value = { val: 0 };
                gsap.to(value, {
                  val: stats.totalPosts,
                  duration: 2,
                  ease: "power2.out",
                  onUpdate: function() {
                    if (stat2Ref.current) {
                      stat2Ref.current.innerHTML = Math.floor(value.val).toLocaleString() + '+';
                    }
                  }
                });
              }
              
              // Animate the third stat (total colleges)
              if (stat3Ref.current) {
                const value = { val: 0 };
                gsap.to(value, {
                  val: stats.totalColleges,
                  duration: 1.8,
                  ease: "power2.out",
                  onUpdate: function() {
                    if (stat3Ref.current) {
                      stat3Ref.current.innerHTML = Math.floor(value.val).toLocaleString() + '+';
                    }
                  }
                });
              }
            }
          }
        }
      );
    }
  }, [stats]);

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
                <div ref={stat2Ref}>0+</div>
              </Text>
              <Text size="sm" c={theme.white} opacity={0.8}>Total Posts</Text>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap={0} align="center" py="md">
              <Text fw={700} size="xl" c={theme.white}>
                <div ref={stat3Ref}>0+</div>
              </Text>
              <Text size="sm" c={theme.white} opacity={0.8}>Universities</Text>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default StatisticsSection; 