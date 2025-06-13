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
  Anchor,
} from '@mantine/core';
import { 
  IconShield, 
  IconLock, 
  IconEye,
  IconSettings,
  IconMail
} from '@tabler/icons-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from '../feed/components/AnimatedBackground';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Privacy sections data
const privacySections = [
  {
    icon: IconEye,
    title: "Information We Collect",
    content: [
      "Profile information you provide (name, email, college, interests)",
      "Photos and content you upload to your profile",
      "Usage data and interactions within the platform",
      "Device information and IP addresses for security purposes"
    ]
  },
  {
    icon: IconSettings,
    title: "How We Use Your Information",
    content: [
      "To create and maintain your profile on the platform",
      "To connect you with other students at your college",
      "To improve our services and user experience",
      "To send important updates about your account"
    ]
  },
  {
    icon: IconShield,
    title: "How We Protect Your Data",
    content: [
      "Industry-standard encryption for all data transmission",
      "Secure servers with regular security audits",
      "Limited access to personal data by authorized personnel only",
      "Regular deletion of unnecessary data and backups"
    ]
  },
  {
    icon: IconLock,
    title: "Your Privacy Rights",
    content: [
      "Access and download your personal data at any time",
      "Request corrections to your profile information",
      "Delete your account and all associated data",
      "Control who can see your profile and contact you"
    ]
  }
];

const PrivacyPage: React.FC = () => {
  const theme = useMantineTheme();
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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

    // Sections animation
    if (sectionsRef.current) {
      gsap.fromTo(
        sectionsRef.current.querySelectorAll('.privacy-section'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: sectionsRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Contact section animation
    if (contactRef.current) {
      gsap.fromTo(
        contactRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: contactRef.current,
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
              PRIVACY POLICY
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
                Your privacy is{" "}
              </Text>
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3", deg: 45 }}
              >
                our priority
              </Text>
            </Title>

            <Text
              size="lg"
              c="gray.3"
              ta="center"
              style={{ maxWidth: 600, lineHeight: 1.6 }}
            >
              We're committed to protecting your personal information and being transparent 
              about how we collect, use, and safeguard your data.
            </Text>

            <Text size="sm" c="gray.5" ta="center">
              Last updated: January 15, 2024
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Privacy Sections */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="lg">
          <Stack gap="xl" ref={sectionsRef}>
            {privacySections.map((section, index) => (
              <Paper
                key={index}
                className="privacy-section"
                p="xl"
                radius="lg"
                style={{
                  background: "linear-gradient(135deg, rgba(67, 97, 238, 0.05) 0%, rgba(58, 12, 163, 0.05) 100%)",
                  border: "1px solid rgba(67, 97, 238, 0.15)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <Stack gap="lg">
                  <Group align="center" gap="md" style={{ 
                    flexDirection: "row",
                    justifyContent: "flex-start"
                  }}>
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                    >
                      <section.icon size={20} />
                    </ThemeIcon>
                    <Title 
                      order={2} 
                      c={theme.white} 
                      style={{ 
                        fontSize: "clamp(1.3rem, 3vw, 1.8rem)",
                        textAlign: "left"
                      }}
                    >
                      {section.title}
                    </Title>
                  </Group>
                  
                  <Stack gap="sm" style={{ paddingLeft: "0" }}>
                    {section.content.map((item, itemIndex) => (
                      <Group key={itemIndex} align="flex-start" gap="sm">
                        <Box
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            backgroundColor: theme.colors.blue[5],
                            marginTop: 6,
                            flexShrink: 0
                          }}
                        />
                        <Text 
                          c="gray.2" 
                          size="md" 
                          style={{ 
                            lineHeight: 1.6,
                            textAlign: "left"
                          }}
                        >
                          {item}
                        </Text>
                      </Group>
                    ))}
                  </Stack>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Additional Information */}
      <Box py={60} style={{ backgroundColor: theme.colors.dark[8] }}>
        <Container size="lg">
          <Stack gap="xl">
            <Title
              order={2}
              ta="center"
              c={theme.white}
              style={{ fontSize: "2rem" }}
            >
              Additional Information
            </Title>
            
            <Paper
              p="xl"
              radius="lg"
              style={{
                backgroundColor: theme.colors.dark[9],
                border: `1px solid ${theme.colors.dark[7]}`
              }}
            >
              <Stack gap="lg">
                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Cookies and Tracking
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We use essential cookies to provide our services and improve your experience. 
                    You can control cookie preferences through your browser settings. We do not 
                    use unnecessary tracking cookies or sell your data to third parties.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Third-Party Services
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We may use trusted third-party services for hosting, analytics, and security. 
                    These services are carefully selected and bound by strict data protection 
                    agreements that meet our privacy standards.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Data Retention
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We retain your personal information only as long as necessary to provide our 
                    services or as required by law. When you delete your account, we permanently 
                    remove all personal data within 30 days.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Changes to This Policy
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We may update this privacy policy occasionally to reflect changes in our 
                    practices or legal requirements. We'll notify users of any significant 
                    changes via email or through our platform.
                  </Text>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Contact Section */}
      <Box py={60} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="md">
          <Paper
            ref={contactRef}
            p="xl"
            radius="lg"
            ta="center"
            style={{
              background: "linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(229, 56, 59, 0.1) 100%)",
              border: "1px solid rgba(67, 97, 238, 0.2)",
              backdropFilter: "blur(15px)"
            }}
          >
            <Stack gap="lg">
              <ThemeIcon
                size={50}
                radius="50%"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                mx="auto"
              >
                <IconMail size={24} />
              </ThemeIcon>
              
              <Title order={2} c={theme.white}>
                Questions About Privacy?
              </Title>
              
              <Text c="gray.3" size="lg" maw={400} mx="auto">
                If you have any questions about this privacy policy or how we handle your data, 
                please don't hesitate to reach out.
              </Text>
              
              <Group justify="center" gap="md" mt="lg">
                <Anchor
                  href="mailto:privacy@incomingclass.com"
                  style={{
                    color: theme.colors.blue[4],
                    textDecoration: "none",
                    fontWeight: 600,
                    padding: "12px 24px",
                    borderRadius: theme.radius.md,
                    border: `1px solid ${theme.colors.blue[5]}`,
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme.colors.blue[5];
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = theme.colors.blue[4];
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  privacy@incomingclass.com
                </Anchor>
              </Group>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default PrivacyPage; 