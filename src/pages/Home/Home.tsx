import { useRef, useEffect } from 'react'
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
  Badge,
  useMantineTheme,
  ActionIcon,
  Avatar,
  AvatarGroup
} from '@mantine/core'
import { useHover } from '@mantine/hooks'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { IconBrandTwitter, IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Mock data for colleges
const COLLEGES = [
  { value: 'harvard', label: 'Harvard University', count: 1240 },
  { value: 'mit', label: 'MIT', count: 987 },
  { value: 'stanford', label: 'Stanford University', count: 1532 },
  { value: 'yale', label: 'Yale University', count: 845 },
  { value: 'columbia', label: 'Columbia University', count: 936 },
  { value: 'princeton', label: 'Princeton University', count: 742 },
  { value: 'berkeley', label: 'UC Berkeley', count: 2154 },
  { value: 'ucla', label: 'UCLA', count: 1891 }
]

// Mock data for testimonials
const TESTIMONIALS = [
  { 
    name: 'Alex J.', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    college: 'Harvard University',
    text: 'Found my roommate and best friend before even stepping on campus! This platform is a lifesaver!'
  },
  { 
    name: 'Maya L.', 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    college: 'Stanford University',
    text: 'Connected with people in my major and already have study buddies lined up. So clutch!' 
  },
  { 
    name: 'Carlos R.', 
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    college: 'UC Berkeley',
    text: 'The AI matching is scary accurate! Found people with the exact same interests and vibe as me.'
  }
]

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

interface TestimonialCardProps {
  name: string;
  image: string;
  college: string;
  text: string;
  index: number;
}

interface CollegeCardProps {
  name: string;
  count: number;
  index: number;
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

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

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
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
        backgroundColor: hovered ? `rgba(74, 93, 253, 0.1)` : theme.colors.dark[8],
        border: `1px solid ${hovered ? theme.colors.blue[5] : theme.colors.dark[7]}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-8px)' : 'none',
      }}
    >
      <Stack gap="md" align="center">
        <Text size="xxl" style={{ fontSize: 48 }}>
          {icon}
        </Text>
        <Title order={3} fw={600} c={theme.white}>
          {title}
        </Title>
        <Text c={theme.colors.dark[2]} size="md" ta="center">
          {description}
        </Text>
      </Stack>
    </Paper>
  )
}

const StepCard: React.FC<StepCardProps> = ({ 
  number, title, description 
}) => {
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
  )
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  name, image, college, text, index 
}) => {
  const theme = useMantineTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      // Staggered entrance animation
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
          delay: 0.15 * index, // Stagger based on index
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, [index]);
  
  return (
    <Paper
      ref={cardRef}
      p="lg"
      radius="md"
      style={{
        backgroundColor: theme.colors.dark[8],
        border: `1px solid ${theme.colors.dark[7]}`,
        height: '100%',
      }}
    >
      <Stack gap="md">
        <Group justify="apart">
          <Group>
            <Image
              src={image}
              width={50}
              height={50}
              radius="xl"
            />
            <Box>
              <Text fw={600} c={theme.white}>{name}</Text>
              <Text size="xs" c={theme.colors.dark[2]}>{college}</Text>
            </Box>
          </Group>
          <Text size="xl">🔥</Text>
        </Group>
        <Text c={theme.white} fz="md" style={{ fontStyle: 'italic' }}>"{text}"</Text>
      </Stack>
    </Paper>
  )
}

const CollegeCard: React.FC<CollegeCardProps> = ({ name, count, index }) => {
  const hoverState = useHover();
  const hovered = hoverState.hovered;
  const theme = useMantineTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current) {
      // Staggered entrance animation
      gsap.fromTo(
        cardRef.current,
        { 
          y: 40, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.5,
          delay: 0.07 * index, // Stagger based on index
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
      
      // Subtle floating animation - different for each card to create wave effect
      gsap.to(
        cardRef.current,
        {
          y: (index % 2 === 0) ? "-8px" : "-12px",
          duration: 2 + (index % 3) * 0.4, // Varying durations
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2 // Staggered start times
        }
      );
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
      }}
    >
      <Stack gap="xs" align="center">
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
  )
}

const Home: React.FC = () => {
  const theme = useMantineTheme();
  
  // Refs for animations
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroTextRef = useRef<HTMLParagraphElement>(null);
  const heroButtonsRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const heroImageGlowRef = useRef<HTMLDivElement>(null);
  const heroBadgeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const circleBadgeRef = useRef<HTMLDivElement>(null);
  
  // Add CTA refs
  const ctaPaperRef = useRef<HTMLDivElement>(null);
  const ctaContentRef = useRef<HTMLDivElement>(null);
  const ctaBackgroundRef = useRef<HTMLDivElement>(null);
  
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
    
    // Stats section animation
    if (statsRef.current) {
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
            toggleActions: "play none none none"
          }
        }
      );
    }
    
    // Set up scroll animations for sections
    gsap.utils.toArray<HTMLElement>('.section-title').forEach((title) => {
      gsap.fromTo(
        title,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: title,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    });
    
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
    <Box 
      style={{
        backgroundColor: theme.colors.dark[9],
        color: theme.white,
        minHeight: '100vh'
      }}
    >
      {/* Add style tag for keyframes */}
      <style>{floatingAnimationStyles}</style>
      
      {/* New Hero Section with Animated Background */}
      <Box 
        style={{ 
          background: `linear-gradient(135deg, #000000 0%, #1a0030 100%)`,
          padding: '120px 0 120px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
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
          <Stack align="center" mb={60} mt={40}>
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
          
          {/* Dynamic Student Cards */}
          <Box style={{ position: 'relative', height: 320, marginTop: 60 }}>
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
      
      {/* Statistics Bar */}
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
                <Text fw={700} size="xl" c={theme.white}>10,000+</Text>
                <Text size="sm" c={theme.white} opacity={0.8}>Active Students</Text>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap={0} align="center" py="md">
                <Text fw={700} size="xl" c={theme.white}>78%</Text>
                <Text size="sm" c={theme.white} opacity={0.8}>Find Roommates</Text>
              </Stack>
            </Grid.Col>
            
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack gap={0} align="center" py="md">
                <Text fw={700} size="xl" c={theme.white}>50+</Text>
                <Text size="sm" c={theme.white} opacity={0.8}>Colleges</Text>
              </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      
      {/* Value Proposition */}
      <Container size="xl" py={80}>
        <Stack gap="lg" align="center" mb={40}>
          <Badge 
            variant="filled" 
            color="blue"
            size="lg"
            radius="sm"
          >
            WHY CHOOSE US
          </Badge>
          <Title order={2} ta="center" c={theme.white} maw={700} mx="auto" className="section-title">
            Create your college circle before you even arrive
          </Title>
        </Stack>
        
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <FeatureCard 
              icon="👥"
              title="Connect with Classmates"
              description="Find people in your major and courses. Start building your study groups early."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <FeatureCard 
              icon="🏠"
              title="Find Your Roommate"
              description="Match with potential roommates based on lifestyle, sleep habits, and interests."
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <FeatureCard 
              icon="🎯"
              title="Build Your Circle"
              description="Join interest groups and event chats to find your people before day one."
            />
          </Grid.Col>
        </Grid>
        
        {/* Social Proof */}
        <Box mt={100}>
          <Stack gap="lg" align="center" mb={40}>
            <Badge 
              variant="filled" 
              color="blue"
              size="lg"
              radius="sm"
            >
              SUCCESS STORIES
            </Badge>
            <Title order={2} ta="center" c={theme.white} maw={700} mx="auto" className="section-title">
              Join thousands of students already connected
            </Title>
            <Text c={theme.colors.dark[2]} ta="center" size="lg" maw={600} mx="auto">
              <Text component="span" c={theme.colors.blue[5]} fw={700}>78% of users</Text> find their roommates through our platform
            </Text>
          </Stack>
          
          <Grid>
            {TESTIMONIALS.map((testimonial, index) => (
              <Grid.Col span={{ base: 12, md: 4 }} key={index}>
                <TestimonialCard 
                  name={testimonial.name}
                  image={testimonial.image}
                  college={testimonial.college}
                  text={testimonial.text}
                  index={index}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </Container>
      
      {/* How It Works */}
      <Box 
        style={{ 
          backgroundColor: '#0d0d0d',
          padding: '80px 0'
        }}
      >
        <Container size="xl">
          <Stack gap="lg" align="center" mb={40}>
            <Badge 
              variant="filled" 
              color="blue"
              size="lg"
              radius="sm"
            >
              HOW IT WORKS
            </Badge>
            <Title order={2} ta="center" c={theme.white} maw={700} mx="auto">
              Four simple steps to get connected
            </Title>
          </Stack>
          
          <Grid>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <StepCard 
                number={1}
                title="Select Your College"
                description="Choose from our list of 50+ partner colleges and universities."
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <StepCard 
                number={2}
                title="Create Your Profile"
                description="Add your interests, major, and what you're looking for."
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <StepCard 
                number={3}
                title="Get Matched"
                description="Our AI matches you with compatible classmates."
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
              <StepCard 
                number={4}
                title="Start Connecting"
                description="Message, join groups, and plan meetups for move-in day."
              />
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      
      {/* Featured Schools */}
      <Container size="xl" py={80}>
        <Stack gap="lg" align="center" mb={40}>
          <Badge 
            variant="filled" 
            color="blue"
            size="lg"
            radius="sm"
          >
            FEATURED SCHOOLS
          </Badge>
          <Title order={2} ta="center" c={theme.white} maw={700} mx="auto" className="section-title">
            Join students from top colleges nationwide
          </Title>
          <Text c={theme.colors.dark[2]} ta="center" size="lg" maw={600} mx="auto">
            Access exclusive school-specific communities
          </Text>
        </Stack>
        
        <Grid>
          {COLLEGES.map((college, index) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={index}>
              <CollegeCard 
                name={college.label}
                count={college.count}
                index={index}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Box pos="relative" py={120}>
        <Box 
          ref={ctaBackgroundRef}
          pos="absolute" 
          top={0} 
          left={0} 
          right={0} 
          bottom={0} 
          style={{
            background: `radial-gradient(circle, ${theme.colors.red[1]} 0%, rgba(255,255,255,0) 70%)`,
            zIndex: 0
          }}
        />
        <Container size="md">
          <Paper
            ref={ctaPaperRef}
            shadow="md"
            p={40}
            radius="lg"
            bg="white"
            style={{
              border: `1px solid ${theme.colors.gray[2]}`,
              position: 'relative',
              zIndex: 1
            }}
          >
            <Stack ref={ctaContentRef} align="center" ta="center" gap="lg">
              <Badge variant="filled" color="red" size="lg">
                Get Started Today
              </Badge>
              <Title c={"black"} order={2}>Ready to Find Your Dream College?</Title>
              <Text size="lg" c="dark" maw={600} mx="auto">
                Join thousands of students who have already found their perfect college match.
                Start your journey now.
              </Text>
              <Group mt="md">
                <Button radius="md" size="lg" color="red">
                  Create Account
                </Button>
                <Button radius="md" size="lg" variant="outline">
                  Learn More
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box bg="gray.1" py={40}>
        <Container>
          <Group justify="space-between">
            <Text size="sm" c="dimmed">
              © 2023 CollegeConnect. All rights reserved.
            </Text>
            <Group gap="xs">
              <ActionIcon size="lg" variant="subtle" radius="xl">
                <IconBrandTwitter size={18} />
              </ActionIcon>
              <ActionIcon size="lg" variant="subtle" radius="xl">
                <IconBrandInstagram size={18} />
              </ActionIcon>
              <ActionIcon size="lg" variant="subtle" radius="xl">
                <IconBrandFacebook size={18} />
              </ActionIcon>
            </Group>
          </Group>
        </Container>
      </Box>
    </Box>
  )
}

export default Home