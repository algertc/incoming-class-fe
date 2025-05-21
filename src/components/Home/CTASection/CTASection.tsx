import React, { useRef, useEffect } from 'react';
import { Box, Container, Paper, Stack, Text, Title, Button, useMantineTheme } from '@mantine/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const CTASection: React.FC = () => {
  const theme = useMantineTheme();
  
  // Add CTA refs
  const ctaPaperRef = useRef<HTMLDivElement>(null);
  const ctaContentRef = useRef<HTMLDivElement>(null);
  const ctaBackgroundRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // CTA section animation
    if (ctaBackgroundRef.current) {
      // Animate the radial background
      gsap.fromTo(
        ctaBackgroundRef.current,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          scrollTrigger: {
            trigger: ctaBackgroundRef.current,
            start: "top bottom",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    if (ctaPaperRef.current) {
      // Animate the CTA card
      gsap.fromTo(
        ctaPaperRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: ctaPaperRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    if (ctaContentRef.current) {
      // Animate the content inside the CTA
      gsap.fromTo(
        ctaContentRef.current.children,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.2,
          scrollTrigger: {
            trigger: ctaContentRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    return () => {
      // Clean up animations when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <Box style={{ padding: '80px 0', position: 'relative' }}>
      <Container size="lg">
        <Paper
          ref={ctaPaperRef}
          radius="lg"
          p={50}
          style={{
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.dark[7]}`
          }}
        >
          {/* Background effect */}
          <Box 
            ref={ctaBackgroundRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: theme.colors.dark[8],
              backgroundImage: `radial-gradient(circle at bottom left, ${theme.colors.blue[9]} 0%, transparent 60%), radial-gradient(circle at top right, rgba(74, 93, 253, 0.3) 0%, transparent 60%)`,
              zIndex: 0
            }}
          />
          
          <Stack 
            ref={ctaContentRef}
            style={{ position: 'relative', zIndex: 1 }}
            gap="xl" 
            align="center"
          >
            <Title order={2} fw={700} ta="center" c={theme.white} style={{ fontSize: '2.5rem' }}>
              Ready to find your college community?
            </Title>
            <Text c={theme.colors.dark[1]} size="xl" maw={600} ta="center">
              Join thousands of students already building their network before even stepping on campus.
            </Text>
            <Button size="xl" color="blue" radius="md">
              Sign Up Now
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CTASection; 