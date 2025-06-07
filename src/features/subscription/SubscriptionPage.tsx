import React, { useRef, useEffect } from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Stack,
  Paper,
  Group,
  ThemeIcon,
  useMantineTheme,
  Badge,
  SimpleGrid,
  Progress,
} from '@mantine/core';
import { 
  IconCreditCard, 
  IconCrown,
  IconCalendar,
  IconInfinity
} from '@tabler/icons-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from '../feed/components/AnimatedBackground';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SubscriptionPage: React.FC = () => {
  const theme = useMantineTheme();
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Mock user subscription data - in real app this would come from API
  const userSubscription = {
    plan: "Free", // or "Premium"
    status: "Active",
    nextBilling: "N/A", // or actual date for premium users
    postsViewed: 4,
    postsLimit: 6
  };

  useEffect(() => {
    // Hero section animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    }

    // Status section animation
    if (statusRef.current) {
      gsap.fromTo(
        statusRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: statusRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Box style={{ backgroundColor: theme.colors.dark[9], minHeight: "100vh" }}>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Hero Section */}
      <Box
        style={{
          background: `linear-gradient(135deg, #000000 0%, #1a0030 100%)`,
          padding: "120px 0 80px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background decorations */}
        <Box
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(67, 97, 238, 0.1) 0%, rgba(67, 97, 238, 0) 70%)",
            filter: "blur(30px)",
            zIndex: 0
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "30%",
            right: "15%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(229, 56, 59, 0.08) 0%, rgba(229, 56, 59, 0) 70%)",
            filter: "blur(20px)",
            zIndex: 0
          }}
        />

        <Container size="lg" style={{ position: "relative", zIndex: 1 }}>
          <Stack align="center" gap="xl" ref={heroRef}>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "#4361ee", to: "#3a0ca3" }}
              style={{ fontWeight: 600 }}
            >
              SUBSCRIPTION
            </Badge>
            
            <Title
              order={1}
              ta="center"
              style={{
                fontSize: "3rem",
                lineHeight: 1.1,
                fontWeight: 500,
                maxWidth: 700
              }}
            >
              <Text inherit component="span" c={theme.white}>
                Manage your{" "}
              </Text>
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3", deg: 45 }}
              >
                subscription
              </Text>
            </Title>

            <Text
              size="lg"
              c="gray.3"
              ta="center"
              style={{ maxWidth: 600, lineHeight: 1.6 }}
            >
              View your current plan details, usage statistics, and subscription information.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Current Subscription Status */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="lg">
          <Paper
            ref={statusRef}
            p="xl"
            radius="lg"
            style={{
              background: "linear-gradient(135deg, rgba(67, 97, 238, 0.05) 0%, rgba(58, 12, 163, 0.05) 100%)",
              border: "1px solid rgba(67, 97, 238, 0.15)",
              backdropFilter: "blur(10px)"
            }}
          >
            <Stack gap="lg">
              <Group align="center">
                <ThemeIcon
                  size="lg"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                >
                  <IconCreditCard size={20} />
                </ThemeIcon>
                <Title order={2} c={theme.white}>
                  Current Subscription
                </Title>
                <Badge
                  color={userSubscription.plan === "Premium" ? "green" : "blue"}
                  variant="filled"
                >
                  {userSubscription.plan}
                </Badge>
              </Group>

              <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="lg">
                <Box>
                  <Text size="sm" c="gray.5" mb="xs">Plan</Text>
                  <Group align="center" gap="xs">
                    {userSubscription.plan === "Premium" && (
                      <IconCrown size={16} color="#FFD700" />
                    )}
                    <Text fw={600} c={theme.white} size="lg">
                      {userSubscription.plan}
                    </Text>
                  </Group>
                </Box>

                <Box>
                  <Text size="sm" c="gray.5" mb="xs">Status</Text>
                  <Text fw={600} c="green" size="lg">
                    {userSubscription.status}
                  </Text>
                </Box>

                <Box>
                  <Text size="sm" c="gray.5" mb="xs">Next Billing</Text>
                  <Group align="center" gap="xs">
                    <IconCalendar size={16} color="gray" />
                    <Text fw={600} c={theme.white} size="lg">
                      {userSubscription.nextBilling}
                    </Text>
                  </Group>
                </Box>

                <Box>
                  <Text size="sm" c="gray.5" mb="xs">Posts Viewed Today</Text>
                  <Text fw={600} c={theme.white} size="lg">
                    {userSubscription.plan === "Premium" ? (
                      <Group align="center" gap="xs">
                        <IconInfinity size={16} />
                        <Text>Unlimited</Text>
                      </Group>
                    ) : (
                      `${userSubscription.postsViewed}/${userSubscription.postsLimit}`
                    )}
                  </Text>
                  {userSubscription.plan === "Free" && (
                    <Progress
                      value={(userSubscription.postsViewed / userSubscription.postsLimit) * 100}
                      color="blue"
                      size="sm"
                      mt="xs"
                    />
                  )}
                </Box>
              </SimpleGrid>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default SubscriptionPage; 