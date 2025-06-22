import React, { useRef, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Stack,
  Grid,
  Paper,
  Group,
  ThemeIcon,
  useMantineTheme,
  Badge,
} from '@mantine/core';
import { 
  IconRocket, 
  IconUsers, 
  IconHeart, 
  IconTarget,
  IconBulb,
  IconShield,
  IconSchool,
  IconMessageCircle2
} from '@tabler/icons-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from '../feed/components/AnimatedBackground';
import { useLandingPageStats } from '../../hooks/api/useStats';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Team member data
const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    bio: "Former Stanford student who wished he had a platform like this during college.",
    icon: "🚀"
  },
  {
    name: "Sarah Chen",
    role: "Head of Product",
    bio: "MIT graduate passionate about building meaningful connections in college.",
    icon: "💡"
  },
  {
    name: "Mike Rodriguez",
    role: "Engineering Lead",
    bio: "Berkeley alum focused on creating seamless user experiences.",
    icon: "⚡"
  },
  {
    name: "Emma Thompson",
    role: "Community Manager",
    bio: "Harvard graduate dedicated to fostering inclusive college communities.",
    icon: "🌟"
  }
];

// Mission values data
const values = [
  {
    icon: IconUsers,
    title: "Community First",
    description: "We believe strong communities are built on authentic connections and shared experiences."
  },
  {
    icon: IconHeart,
    title: "Inclusivity",
    description: "Everyone deserves to find their place in college, regardless of background or interests."
  },
  {
    icon: IconShield,
    title: "Safety & Trust",
    description: "We prioritize user safety with verified profiles and secure communication channels."
  },
  {
    icon: IconBulb,
    title: "Innovation",
    description: "We continuously evolve our platform to meet the changing needs of students."
  }
];

// Stats data
const StatsSection = () => {
  const { data: statsData, isLoading } = useLandingPageStats();
  
  const stats = [
    { 
      number: statsData?.data?.totalUsers?.toLocaleString() || '0', 
      label: "Students Connected",
      icon: IconUsers,
      loading: isLoading
    },
    { 
      number: statsData?.data?.totalColleges?.toLocaleString() || '0', 
      label: "Universities",
      icon: IconSchool,
      loading: isLoading
    },
    { 
      number: statsData?.data?.totalPosts?.toLocaleString() || '0', 
      label: "Posts Shared",
      icon: IconMessageCircle2,
      loading: isLoading
    },
    { 
      number: "24/7", 
      label: "Support Available",
      icon: IconHeart,
      loading: false
    }
  ];

  return (
    <Box py={60} >
      <Container size="xl">
        <Grid >
          {stats.map((stat, index) => (
            <Grid.Col span={{ base: 6, sm: 3 }} key={index}>
              <Paper
                className="stat-item"
                p="xl"
                radius="lg"
                ta="center"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <Text
                  fw={700}
                  variant="gradient"
                  gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                  mb="xs"
                  style={{
                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                    lineHeight: 1.2
                  }}
                >
                  {stat.number}
                </Text>
                <Text c="gray.4" fw={500}>
                  {stat.label}
                </Text>
              </Paper>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const AboutPage: React.FC = () => {
  const theme = useMantineTheme();
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero section animation - optimized for iOS
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { 
          y: 50, 
          opacity: 0,
          willChange: 'transform, opacity'
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.25,
          ease: "power2.out",
          clearProps: 'willChange'
        }
      );
    }

    // Stats section animation - optimized for iOS
    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.querySelectorAll('.stat-item'),
        { 
          scale: 0.8, 
          opacity: 0,
          willChange: 'transform, opacity'
        },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          clearProps: 'willChange'
        }
      );
    }

    // Mission section animation - optimized for iOS
    if (missionRef.current) {
      gsap.fromTo(
        missionRef.current.children,
        { 
          y: 30, 
          opacity: 0,
          willChange: 'transform, opacity'
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: missionRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          clearProps: 'willChange'
        }
      );
    }

    // Team section animation - optimized for iOS
    if (teamRef.current) {
      gsap.fromTo(
        teamRef.current.querySelectorAll('.team-member'),
        { 
          y: 30, 
          opacity: 0,
          willChange: 'transform, opacity'
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          clearProps: 'willChange'
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Box style={{ 
      backgroundColor: theme.colors.dark[9], 
      minHeight: "100vh",
      WebkitOverflowScrolling: 'touch' // Enable momentum scrolling on iOS
    }}>
      {/* Animated Background - Optimized for iOS */}
      <AnimatedBackground />

      {/* Hero Section */}
      <Box
        style={{
          background: `linear-gradient(135deg, #000000 0%, #1a0030 100%)`,
          padding: "120px 0 80px",
          position: "relative",
          overflow: "hidden",
          transform: 'translate3d(0,0,0)', // Force GPU acceleration
          WebkitBackfaceVisibility: 'hidden',
          WebkitPerspective: 1000
        }}
      >
        {/* Background decorations */}
        <Box
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(67, 97, 238, 0.15) 0%, rgba(67, 97, 238, 0) 70%)",
            filter: "blur(40px)",
            zIndex: 0
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "20%",
            right: "10%",
            width: 150,
            height: 150,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(229, 56, 59, 0.12) 0%, rgba(229, 56, 59, 0) 70%)",
            filter: "blur(30px)",
            zIndex: 0
          }}
        />

        <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
          <Stack align="center" gap="xl" ref={heroRef}>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "#4361ee", to: "#3a0ca3" }}
              style={{ fontWeight: 600 }}
            >
              ABOUT INCOMINGCLASS
            </Badge>
            
            <Title
              order={1}
              ta="center"
              style={{
                fontSize: "3.5rem",
                lineHeight: 1.1,
                fontWeight: 500,
                maxWidth: 800
              }}
            >
              <Text inherit component="span" c={theme.white}>
                Building the future of{" "}
              </Text>
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3", deg: 45 }}
              >
                college connections
              </Text>
            </Title>

            <Text
              size="xl"
              c="gray.3"
              ta="center"
              style={{ maxWidth: 700, lineHeight: 1.6 }}
            >
              We're on a mission to help every student find their tribe before stepping foot on campus. 
              Because college is better when you're not going it alone.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Stats Section */}
      <StatsSection />

      {/* Mission Section */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="xl">
          <Stack gap="xl" ref={missionRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                Our Mission
              </Title>
              <Text size="lg" c="gray.3" maw={600} mx="auto">
                To revolutionize how students connect and build communities before college starts
              </Text>
            </Box>

            <Paper
              p="xl"
              radius="lg"
              style={{
                background: "linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(58, 12, 163, 0.1) 100%)",
                border: "1px solid rgba(67, 97, 238, 0.2)",
                backdropFilter: "blur(5px)", // Reduced blur for better performance
                WebkitBackdropFilter: "blur(5px)", // iOS support
                transform: 'translate3d(0,0,0)', // Force GPU acceleration
                WebkitBackfaceVisibility: 'hidden',
                WebkitPerspective: 1000
              }}
            >
              <Group align="center" mb="lg">
                <ThemeIcon
                  size="xl"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                >
                  <IconTarget size={24} />
                </ThemeIcon>
                <Title order={3} c={theme.white}>
                  Why We Exist
                </Title>
              </Group>
              
              <Text c="gray.2" size="lg" style={{ lineHeight: 1.7 }}>
                Starting college can be overwhelming. You're moving to a new place, meeting new people, 
                and trying to figure out where you belong. We believe that having connections before you 
                arrive makes all the difference. IncomingClass bridges the gap between acceptance and 
                arrival, helping you build meaningful relationships that will define your college experience.
              </Text>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Values Section */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[8] }}>
        <Container size="xl">
          <Stack gap="xl" ref={valuesRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                Our Values
              </Title>
              <Text size="lg" c="gray.3" maw={600} mx="auto">
                The principles that guide everything we do
              </Text>
            </Box>

            <Grid>
              {values.map((value, index) => (
                <Grid.Col span={{ base: 12, sm: 6 }} key={index}>
                  <Paper
                    className="value-card"
                    p="xl"
                    radius="lg"
                    h="100%"
                    style={{
                      backgroundColor: theme.colors.dark[9],
                      border: `1px solid ${theme.colors.dark[7]}`,
                      transition: "all 0.3s ease",
                      cursor: "pointer"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.borderColor = theme.colors.blue[5];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = theme.colors.dark[7];
                    }}
                  >
                    <Group align="flex-start" gap="lg">
                      <ThemeIcon
                        size={50}
                        radius="md"
                        variant="light"
                        color="blue"
                      >
                        <value.icon size={24} />
                      </ThemeIcon>
                      <Stack gap="sm" style={{ flex: 1 }}>
                        <Title order={4} c={theme.white}>
                          {value.title}
                        </Title>
                        <Text c="gray.3" size="sm">
                          {value.description}
                        </Text>
                      </Stack>
                    </Group>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Team Section */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="xl">
          <Stack gap="xl" ref={teamRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                Meet the Team
              </Title>
              <Text size="lg" c="gray.3" maw={600} mx="auto">
                The passionate individuals behind IncomingClass
              </Text>
            </Box>

            <Grid>
              {teamMembers.map((member, index) => (
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={index}>
                  <Paper
                    key={index}
                    className="team-member"
                    p="xl"
                    radius="lg"
                    style={{
                      backgroundColor: theme.colors.dark[8],
                      border: `1px solid ${theme.colors.dark[7]}`,
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      transform: 'translate3d(0,0,0)', // Force GPU acceleration
                      WebkitBackfaceVisibility: 'hidden',
                      WebkitPerspective: 1000,
                      willChange: 'transform, box-shadow'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translate3d(0,-8px,0)';
                      e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translate3d(0,0,0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Text size="3rem" mb="md">
                      {member.icon}
                    </Text>
                    <Title order={4} c={theme.white} mb="xs">
                      {member.name}
                    </Title>
                    <Text
                      size="sm"
                      c="blue.4"
                      fw={600}
                      mb="md"
                    >
                      {member.role}
                    </Text>
                    <Text c="gray.4" size="sm" style={{ lineHeight: 1.5 }}>
                      {member.bio}
                    </Text>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[8] }}>
        <Container size="md">
          <Paper
            p="xl"
            radius="lg"
            ta="center"
            style={{
              background: "linear-gradient(135deg, rgba(67, 97, 238, 0.15) 0%, rgba(229, 56, 59, 0.15) 100%)",
              border: "1px solid rgba(67, 97, 238, 0.3)",
              backdropFilter: "blur(8px)", // Reduced blur for better performance
              WebkitBackdropFilter: "blur(8px)", // iOS support
              transform: 'translate3d(0,0,0)', // Force GPU acceleration
              WebkitBackfaceVisibility: 'hidden',
              WebkitPerspective: 1000
            }}
          >
            <Stack gap="lg">
              <ThemeIcon
                size={60}
                radius="50%"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                mx="auto"
              >
                <IconRocket size={30} />
              </ThemeIcon>
              
              <Title order={2} c={theme.white}>
                Ready to Start Your Journey?
              </Title>
              
              <Text c="gray.3" size="lg" maw={500} mx="auto">
                Join thousands of students who've already found their college community. 
                Your perfect college experience starts here.
              </Text>
              
              <Group justify="center" gap="md" mt="xl">
                <Paper
                  component="a"
                  href="/signup"
                  p="lg"
                  radius="md"
                  style={{
                    backgroundColor: "#4361ee",
                    color: "white",
                    textDecoration: "none",
                    fontWeight: 600,
                    transition: "all 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3a0ca3";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 10px 20px rgba(67, 97, 238, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#4361ee";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  Get Started Now
                </Paper>
              </Group>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage; 