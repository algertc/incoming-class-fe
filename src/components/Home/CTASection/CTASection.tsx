import React, { useRef, useEffect } from 'react';
import { Box, Container, Stack, Text, Title, Button } from '@mantine/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const CTASection: React.FC = () => {
  // Add CTA refs
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const ctaContentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const blueGradientRef = useRef<HTMLDivElement>(null);
  const redGradientRef = useRef<HTMLDivElement>(null);
  const dot1Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Create a master timeline for better sequencing
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ctaContainerRef.current,
        start: "top bottom-=100",
        toggleActions: "play none none reset"
      }
    });
    
    // Animate decorative elements
    if (blueGradientRef.current) {
      // Animate blue gradient
      tl.fromTo(
        blueGradientRef.current,
        { opacity: 0, scale: 0.8, x: -30 },
        { opacity: 1, scale: 1, x: 0, duration: 1, ease: "power2.out" },
        0
      );
      
      // Add subtle floating animation
      gsap.to(blueGradientRef.current, {
        y: -20,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    if (redGradientRef.current) {
      // Animate red gradient
      tl.fromTo(
        redGradientRef.current,
        { opacity: 0, scale: 0.8, x: 30 },
        { opacity: 1, scale: 1, x: 0, duration: 1, ease: "power2.out" },
        0
      );
      
      // Add subtle floating animation
      gsap.to(redGradientRef.current, {
        y: 20,
        duration: 7,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    if (dot1Ref.current && dot2Ref.current) {
      // Animate small dots
      tl.fromTo(
        [dot1Ref.current, dot2Ref.current],
        { opacity: 0, scale: 0 },
        { 
          opacity: 1, 
          scale: 1, 
          duration: 0.8, 
          stagger: 0.2,
          ease: "back.out(2)" 
        },
        0.3
      );
      
      // Add random floating movement
      gsap.to(dot1Ref.current, {
        x: "+=20",
        y: "-=15",
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      gsap.to(dot2Ref.current, {
        x: "-=15",
        y: "+=20",
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
    
    // Animate title
    if (titleRef.current) {
      tl.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" },
        0.4
      );
    }
    
    // Animate text
    if (textRef.current) {
      tl.fromTo(
        textRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        0.6
      );
    }
    
    // Animate button
    if (buttonRef.current) {
      tl.fromTo(
        buttonRef.current,
        { y: 20, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" },
        0.8
      );
    }
    
    return () => {
      // Clean up animations when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <Box 
      ref={ctaContainerRef}
      style={{ 
        background: 'transparent',
        padding: '120px 0',
        minHeight: '50vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        '@media (max-width: 768px)': {
          padding: '80px 0'
        },
        '@media (max-width: 576px)': {
          padding: '60px 0'
        }
      }}
    >
      {/* Decorative elements */}
      <Box 
        ref={blueGradientRef}
        style={{
          position: 'absolute',
          top: '-150px',
          left: '-150px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(67, 97, 238, 0.05) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      
      <Box 
        ref={redGradientRef}
        style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '250px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(229, 56, 59, 0.04) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />
      
      <Box 
        ref={dot1Ref}
        style={{
          position: 'absolute',
          top: '30%',
          right: '15%',
          width: '10px',
          height: '10px',
          background: 'rgba(67, 97, 238, 0.4)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(1px)'
        }}
      />
      
      <Box 
        ref={dot2Ref}
        style={{
          position: 'absolute',
          bottom: '25%',
          left: '10%',
          width: '8px',
          height: '8px',
          background: 'rgba(229, 56, 59, 0.3)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'blur(1px)'
        }}
      />
      
      <Container size="md" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <Stack 
          ref={ctaContentRef}
          gap="xl" 
          align="center"
          style={{ textAlign: 'center' }}
        >
          <Title 
            ref={titleRef}
            order={2} 
            fw={700} 
            ta="center" 
            c="#ffffff"
            style={{ 
              fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
            }}
          >
            Ready to find your college community?
          </Title>
          
          <Text 
            ref={textRef}
            c="#b8b8b8"
            size="xl"
            ta="center"
            style={{
              maxWidth: '600px',
              '@media (max-width: 576px)': {
                fontSize: '1rem'
              }
            }}
          >
            Join thousands of students already building their network before even stepping on campus.
          </Text>
          
          <Button 
            ref={buttonRef}
            size="xl"
            radius="md"
            style={{
              background: 'linear-gradient(45deg, #4361ee, #6f79fc)',
              boxShadow: '0 10px 20px -10px rgba(67, 97, 238, 0.5)',
              border: 'none',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease',
              ':hover': {
                background: 'linear-gradient(45deg, #3a0ca3, #4361ee)',
                transform: 'translateY(-3px)',
                boxShadow: '0 14px 28px -10px rgba(67, 97, 238, 0.6)'
              },
              '@media (max-width: 768px)': {
                fontSize: '1rem',
                padding: '0.5rem 1.5rem'
              },
              '@media (max-width: 576px)': {
                fontSize: '0.875rem',
                padding: '0.375rem 1.25rem'
              }
            }}
          >
            Sign Up Now
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default CTASection;