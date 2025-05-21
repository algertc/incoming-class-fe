import React, { useRef, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Group,
  Image, 
  Paper,
  Stack, 
  Text, 
  Title,
  AvatarGroup,
  Avatar,
  useMantineTheme
} from '@mantine/core';
import gsap from 'gsap';

// CSS keyframes for the floating animations
const floatingAnimationStyles = `
  @keyframes float-0 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(15px, -15px); }
  }
  @keyframes float-1 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-20px, -10px); }
  }
  @keyframes float-2 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(10px, -25px); }
  }
  @keyframes float-3 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-15px, -15px); }
  }
  @keyframes float-4 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(20px, -8px); }
  }
`;

export const HeroSection: React.FC = () => {
  const theme = useMantineTheme();
  
  // Refs for animations
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroTextRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroImageGlowRef = useRef<HTMLDivElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const circleBadgeRef = useRef<HTMLDivElement>(null);
  
  // Animated background elements refs
  const bgCircle1Ref = useRef<HTMLDivElement>(null);
  const bgCircle2Ref = useRef<HTMLDivElement>(null);
  const bgCircle3Ref = useRef<HTMLDivElement>(null);
  const bgGradient1Ref = useRef<HTMLDivElement>(null);
  const bgGradient2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set up initial states for hero elements
    gsap.set(".hero-title span", { opacity: 0, y: 50 });
    gsap.set(".hero-text", { opacity: 0, y: 30 });
    gsap.set(".hero-buttons button", { opacity: 0, y: 20 });
    gsap.set(".hero-avatars", { opacity: 0, scale: 0.8 });
    
    // Create a master timeline
    const masterTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    // Hero text animations
    const textTl = gsap.timeline();
    textTl.to(".hero-title span", { 
      opacity: 1, 
      y: 0, 
      duration: 0.8, 
      stagger: 0.15,
      ease: "back.out(1.2)"
    });
    textTl.to(".hero-text", { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");
    textTl.to(".hero-buttons button", { 
      opacity: 1, 
      y: 0, 
      duration: 0.5, 
      stagger: 0.1,
      ease: "power2.out" 
    }, "-=0.4");
    textTl.to(".hero-avatars", { opacity: 1, scale: 1, duration: 0.6 }, "-=0.2");
    
    // Add the timeline to the master timeline
    masterTl.add(textTl);
    
    // Background animation for the animated dots
    const dots = document.querySelectorAll(".animated-dots > div");
    dots.forEach((dot, index) => {
      gsap.to(dot, { 
        opacity: 0.8, 
        duration: 0.1, 
        delay: index * 0.03 
      });
    });
    
    // Animate background elements
    if (bgCircle1Ref.current && bgCircle2Ref.current && bgCircle3Ref.current) {
      // Circle 1 animation
      gsap.to(bgCircle1Ref.current, {
        y: -30,
        x: 20,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
      // Circle 2 animation
      gsap.to(bgCircle2Ref.current, {
        y: 40,
        x: -30,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5
      });
      
      // Circle 3 animation
      gsap.to(bgCircle3Ref.current, {
        y: -50,
        x: -20,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1
      });
    }
    
    // Animate gradient backgrounds
    if (bgGradient1Ref.current && bgGradient2Ref.current) {
      // Gradient 1 animation
      gsap.to(bgGradient1Ref.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none"
      });
      
      // Gradient 2 animation
      gsap.to(bgGradient2Ref.current, {
        rotation: -360,
        duration: 80,
        repeat: -1,
        ease: "none"
      });
    }
    
    // Hero section animations
    const heroTimeline = gsap.timeline();
    
    // Badge animation
    if (heroBadgeRef.current) {
      heroTimeline.fromTo(
        heroBadgeRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
    
    // Title animation with stagger for text reveal
    if (heroTitleRef.current) {
      heroTimeline.fromTo(
        heroTitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.2"
      );
    }
    
    // Text animation
    if (heroTextRef.current) {
      heroTimeline.fromTo(
        heroTextRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );
    }
    
    // Buttons animation
    if (heroButtonsRef.current) {
      heroTimeline.fromTo(
        heroButtonsRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      );
    }
    
    // Image animation
    if (heroImageRef.current) {
      heroTimeline.fromTo(
        heroImageRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.4"
      );
    }
    
    // Image glow animation
    if (heroImageGlowRef.current) {
      heroTimeline.fromTo(
        heroImageGlowRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
        "-=0.8"
      );
      
      // Add continuous pulse animation to the glow
      gsap.to(
        heroImageGlowRef.current,
        {
          scale: 1.2,
          opacity: 0.6,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );
    }
    
    // Circle badge animation
    if (circleBadgeRef.current) {
      heroTimeline.fromTo(
        circleBadgeRef.current,
        { scale: 0, rotation: -30 },
        { 
          scale: 1, 
          rotation: 0, 
          duration: 0.6, 
          ease: "back.out(1.7)",
          delay: 0.2
        },
        "-=0.3"
      );
      
      // Add floating animation to circle badge
      gsap.to(
        circleBadgeRef.current,
        {
          y: "-10px",
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        }
      );
    }
  }, []);

  return (
    <Box 
      style={{ 
        background: `linear-gradient(135deg, #000000 0%, #1a0030 100%)`,
        padding: '120px 0 120px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Add style tag for keyframes */}
      <style>{floatingAnimationStyles}</style>
      
      {/* Animated background elements */}
      <Box
        ref={bgGradient1Ref}
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle at center, rgba(67, 97, 238, 0.03) 0%, rgba(67, 97, 238, 0) 70%)',
          opacity: 0.6,
          zIndex: 0
        }}
      />
      
      <Box
        ref={bgGradient2Ref}
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-30%',
          width: '120%',
          height: '120%',
          background: 'radial-gradient(circle at center, rgba(229, 56, 59, 0.04) 0%, rgba(229, 56, 59, 0) 60%)',
          opacity: 0.5,
          zIndex: 0
        }}
      />
      
      <Box
        ref={bgCircle1Ref}
        style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(67, 97, 238, 0.08) 0%, rgba(67, 97, 238, 0) 70%)',
          filter: 'blur(50px)',
          zIndex: 0
        }}
      />
      
      <Box
        ref={bgCircle2Ref}
        style={{
          position: 'absolute',
          top: '60%',
          right: '15%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(229, 56, 59, 0.08) 0%, rgba(229, 56, 59, 0) 70%)',
          filter: 'blur(40px)',
          zIndex: 0
        }}
      />
      
      <Box
        ref={bgCircle3Ref}
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '40%',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(30px)',
          zIndex: 0
        }}
      />
      
      {/* Small animated dots */}
      <Box className="animated-dots" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.5 }}>
        {Array.from({ length: 30 }).map((_, index) => (
          <Box
            key={index}
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 1,
              height: Math.random() * 4 + 1,
              backgroundColor: index % 3 === 0 ? '#e5383b' : (index % 3 === 1 ? '#4361ee' : '#ffffff'),
              borderRadius: '50%',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float-${index % 5} ${Math.random() * 10 + 10}s infinite ease-in-out`
            }}
          />
        ))}
      </Box>
      
      <Container size="xl" style={{ position: 'relative', zIndex: 1 }}>
        <Stack align="center" mb={60} >
          <Title 
            ref={heroTitleRef}
            order={1} 
            mb="xl"
            ta="center"
            className="hero-title"
            style={{ 
              fontSize: '3.8rem',
              lineHeight: 1.1,
              fontWeight: 800,
              maxWidth: 850
            }}
          >
            <Text
              inherit
              component="span"
              c={theme.white}
            >
            Find your squad before {' '}
            </Text>
            <Text
              inherit
              component="span"
              variant="gradient"
              gradient={{ from: '#4361ee', to: '#3a0ca3', deg: 45 }}
            >
              freshman year starts.
            </Text>
          </Title>
          
          <Text 
            ref={heroTextRef}
            size="xl"
            c="gray.3"
            mb="xl"
            ta="center"
            className="hero-text"
            style={{ maxWidth: 700 }}
          >
            Connect with your future classmates, find your perfect roomie, and build your college circle—all before orientation.
          </Text>
          
          <Group ref={heroButtonsRef} gap="md" mb="xl" className="hero-buttons">
            <Button 
              size="lg" 
              radius="md"
              color="blue"
              style={{
                transition: 'all 0.3s ease',
                backgroundColor: '#4361ee'
              }}
              styles={{
                root: {
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    backgroundColor: '#3a0ca3',
                  }
                }
              }}
            >
              Get Started
            </Button>
            
            <Button 
              size="lg" 
              radius="md"
              variant="outline"
              color="red"
              style={{
                borderColor: '#e5383b',
                color: '#e5383b'
              }}
            >
              Button
            </Button>
          </Group>
          
          <Group align="center" gap="md" mt={10} className="hero-avatars">
            <AvatarGroup spacing="sm">
              <Avatar src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" radius="xl" />
              <Avatar src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" radius="xl" />
              <Avatar src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" radius="xl" />
              <Avatar radius="xl">+</Avatar>
            </AvatarGroup>
            <Text size="sm" c="gray.5" fw={600}>
              <Text span fw={700} c={theme.white}>526+</Text>  Students Connected
            </Text>
          </Group>
        </Stack>
        
        {/* Dynamic Student Cards - Desktop only */}
        <Box style={{ position: 'relative', height: 320, marginTop: 60 }} display={{ base: 'none', md: 'block' }}>
          {/* Left Card */}
          <Box
            style={{
              position: 'absolute',
              left: '5%',
              top: '50%',
              transform: 'translateY(-50%) rotate(-5deg)',
              width: '28%',
              height: 280,
              backgroundColor: '#e5383b', // Red
              borderRadius: 16,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              overflow: 'hidden',
              zIndex: 1
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              alt="Student 1"
              height={240}
              fit="contain"
              style={{
                filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.4))'
              }}
            />
          </Box>
          
          {/* Center Card */}
          <Box
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '32%',
              height: 320,
              backgroundColor: '#4361ee', // Blue
              borderRadius: 16,
              boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              overflow: 'hidden',
              zIndex: 2
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
              alt="Student 2"
              height={280}
              fit="contain"
              style={{
                filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.4))'
              }}
            />
          </Box>
          
          {/* Right Card */}
          <Box
            style={{
              position: 'absolute',
              right: '5%',
              top: '50%',
              transform: 'translateY(-50%) rotate(5deg)',
              width: '28%',
              height: 280,
              backgroundColor: 'white',
              borderRadius: 16,
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              overflow: 'hidden',
              zIndex: 1
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"
              alt="Student 3"
              height={240}
              fit="contain"
              style={{
                filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.4))'
              }}
            />
          </Box>
        </Box>
        
        {/* Responsive cards for mobile */}
        <Box className="mobile-cards" display={{ base: 'block', md: 'none' }} mt={30}>
          <Grid gutter="md">
            <Grid.Col span={12}>
              <Paper
                style={{
                  backgroundColor: '#4361ee',
                  borderRadius: 16,
                  padding: 20,
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 15,
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                  alt="Student 2"
                  height={240}
                  fit="contain"
                  style={{
                    filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.4))'
                  }}
                />
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper
                style={{
                  backgroundColor: '#e5383b',
                  borderRadius: 16,
                  padding: 20,
                  display: 'flex',
                  justifyContent: 'center',
                  transform: 'rotate(-3deg)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80"
                  alt="Student 1"
                  height={180}
                  fit="contain"
                  style={{
                    filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.4))'
                  }}
                />
              </Paper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper
                style={{
                  backgroundColor: 'white',
                  borderRadius: 16,
                  padding: 20,
                  display: 'flex',
                  justifyContent: 'center',
                  transform: 'rotate(3deg)',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                }}
              >
                <Image
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80"
                  alt="Student 3"
                  height={180}
                  fit="contain"
                  style={{
                    filter: 'drop-shadow(0 5px 10px rgba(0,0,0,0.4))'
                  }}
                />
              </Paper>
            </Grid.Col>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection; 