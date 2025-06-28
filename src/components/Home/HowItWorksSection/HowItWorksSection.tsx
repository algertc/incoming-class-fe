import React, { useRef, useEffect } from 'react';
import { Box, Container, Grid, Stack, Title, Badge, useMantineTheme } from '@mantine/core';
import gsap from 'gsap';
import { StepCard } from '../StepCard/StepCard';

export const HowItWorksSection: React.FC = () => {
  const theme = useMantineTheme();
  const sectionTitleRef = useRef<HTMLHeadingElement>(null);
  
  useEffect(() => {
    // Set up scroll animations for section title
    if (sectionTitleRef.current) {
      gsap.fromTo(
        sectionTitleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionTitleRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, []);

  return (
    <Box style={{  padding: '80px 0' }}>
      <Container size="lg">
        <Stack gap="lg" align="center" mb={60}>
          <Badge 
            variant="filled" 
            color="blue"
            size="lg"
            radius="sm"
          >
            HOW IT WORKS
          </Badge>
          <Title 
            ref={sectionTitleRef}
            order={2} 
            ta="center" 
            c={theme.white} 
            maw={700} 
            mx="auto" 
            className="section-title"
          >
            Get started in three simple steps
          </Title>
        </Stack>
        
        <Grid>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <StepCard
              number={1}
              title="Search Your University"
              description="Find your campus and explore who else is joining."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <StepCard
              number={2}
              title="Create a Post"
              description="Share your preferences, lifestyle, and what you're looking for."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 4 }}>
            <StepCard
              number={3}
              title="Start Connecting"
              description="Discover like-minded students and message them directly."
            />
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorksSection; 