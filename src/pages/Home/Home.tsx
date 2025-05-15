import { useRef, useEffect } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Grid, 
  Group,
  Image, 
  Paper,
  Stack, 
  Text, 
  Title,
  Badge,
  Kbd,
  useMantineTheme,
  ActionIcon
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

  useEffect(() => {
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
      {/* Hero Section */}
      <Container size="xl" py={60}>
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          gap={{ base: 40, md: 60 }}
          align="center" 
          justify="space-between"
        >
          <Box w={{ base: '100%', md: '50%' }}>
            <Badge 
              ref={heroBadgeRef}
              variant="filled" 
              color="blue"
              size="lg"
              radius="sm"
              mb="md"
            >
              NEW WAY TO CONNECT
            </Badge>
            <Title 
              ref={heroTitleRef}
              order={1} 
              mb="sm"
              style={{ 
                fontSize: '3.5rem',
                lineHeight: 1.1,
                fontWeight: 800
              }}
            >
              <Text
                inherit
                component="span"
                c={theme.white}
              >
                College Connections
              </Text>{' '}
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: theme.colors.blue[5], to: theme.colors.blue[3], deg: 45 }}
              >
                Unleashed
              </Text>
            </Title>
            <Title 
              order={2} 
              size="h4" 
              mb="xl" 
              c={theme.colors.dark[2]}
              style={{ fontWeight: 500 }}
            >
              Find your squad before freshman year starts
            </Title>
            
            <Text 
              ref={heroTextRef}
              size="md"
              c={theme.colors.dark[2]}
              mb="xl"
            >
              Connect with classmates, find roommates, and build your circle before you even step on campus. 
              Join the 10,000+ students already making connections for the upcoming school year.
            </Text>
            
            <Group ref={heroButtonsRef}>
              <Button 
                size="lg" 
                radius="md"
                color="blue"
                style={{
                  transition: 'all 0.3s ease',
                }}
                styles={(theme) => ({
                  root: {
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      backgroundColor: theme.colors.blue[6],
                    }
                  }
                })}
              >
                Select Your College
              </Button>
              
              <Button 
                size="lg" 
                radius="md"
                variant="outline"
                color="gray"
              >
                Watch Demo
              </Button>
            </Group>
            
            <Group gap="xs" mt="xl">
              <Kbd>{theme.colors.blue[5]}</Kbd>
              <Text c={theme.colors.dark[2]} size="sm">Harvard, Stanford, Yale, and 50+ top schools</Text>
            </Group>
          </Box>
          
          <Box 
            ref={heroImageRef}
            w={{ base: '100%', md: '45%' }}
            style={{ position: 'relative' }}
          >
            <Box
              ref={heroImageGlowRef}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: `radial-gradient(circle, rgba(74, 93, 253, 0.2) 0%, rgba(74, 93, 253, 0.1) 70%, rgba(0,0,0,0) 100%)`,
                transform: 'translate(-50px, -50px) scale(1.5)',
                filter: 'blur(60px)',
                zIndex: 0
              }}
            />
            <Paper
              radius="md"
              style={{
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden',
                border: `2px solid rgba(74, 93, 253, 0.3)`,
                backgroundColor: theme.colors.dark[8],
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)'
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="College students connecting"
                radius="md"
              />
            </Paper>
            
            <Paper
              ref={circleBadgeRef}
              style={{
                position: 'absolute',
                bottom: -20,
                right: -20,
                zIndex: 2,
                backgroundColor: theme.colors.blue[5],
                borderRadius: '50%',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                border: `4px solid ${theme.colors.dark[9]}`,
              }}
            >
              <Text fw={700} size="lg" c={theme.white} ta="center">Join<br/>Now</Text>
            </Paper>
          </Box>
        </Flex>
      </Container>
      
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