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
  IconScale,
  IconMail,
  IconUser,
  IconCreditCard,
  IconAlertTriangle
} from '@tabler/icons-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from '../feed/components/AnimatedBackground';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Terms sections data
const termsSections = [
  {
    icon: IconUser,
    title: "Use of Site",
    content: [
      "Must be at least 18 years old or have parental consent to use this Site",
      "Any use by individuals under 13 is prohibited",
      "Do not post unlawful, harassing, defamatory, obscene, or harmful content",
      "Do not engage in spamming, solicitation, or commercial activity unrelated to the Service",
      "Do not share private information without consent or submit copyrighted materials without permission"
    ]
  },
  {
    icon: IconAlertTriangle,
    title: "Prohibited Activities",
    content: [
      "Use bots, scrapers, or similar tools to gather data",
      "Collect personal info from users to send unsolicited messages",
      "Interfere with Site security or operations",
      "Misrepresent your identity or impersonate others",
      "Create or use fake profiles to deceive others",
      "Post viruses, malicious code, or spyware"
    ]
  },
  {
    icon: IconCreditCard,
    title: "Subscription Model",
    content: [
      "Incoming Class operates on a paid subscription model",
      "Payments are processed securely via Stripe",
      "All payments are non-refundable except where required by law",
      "You may cancel anytime at https://incomingclass.com/subscription",
      "Pricing may change with notice for future billing cycles"
    ]
  },
  {
    icon: IconScale,
    title: "Legal Terms",
    content: [
      "Agreement governed by the laws of the State of California, U.S.A.",
      "Submit to jurisdiction of courts in Contra Costa County, California",
      "Any legal claim must be filed within one year of its occurrence",
      "We may suspend or terminate your account for violating these Terms",
      "All subscription payments are non-refundable"
    ]
  }
];

const TermsPage: React.FC = () => {
  const theme = useMantineTheme();
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

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

    // Sections animation - optimized for iOS
    if (sectionsRef.current) {
      gsap.fromTo(
        sectionsRef.current.querySelectorAll('.terms-section'),
        { 
          y: 40, 
          opacity: 0,
          willChange: 'transform, opacity'
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionsRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          },
          clearProps: 'willChange'
        }
      );
    }

    // Contact section animation - optimized for iOS
    if (contactRef.current) {
      gsap.fromTo(
        contactRef.current,
        { 
          y: 30, 
          opacity: 0,
          willChange: 'transform, opacity'
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: contactRef.current,
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
      WebkitOverflowScrolling: 'touch'
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
          transform: 'translate3d(0,0,0)',
          WebkitBackfaceVisibility: 'hidden',
          WebkitPerspective: 1000
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
              TERMS OF SERVICE
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
                Your agreement{" "}
              </Text>
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3", deg: 45 }}
              >
                with us
              </Text>
            </Title>

            <Text
              size="lg"
              c="gray.3"
              ta="center"
              style={{ maxWidth: 600, lineHeight: 1.6 }}
            >
              These Terms of Use constitute a license that governs your use of the Site and any transactions you engage in. By accessing, viewing, or using the Site, you acknowledge you've read, understood, and agree to be bound by these Terms.
            </Text>

            <Text size="sm" c="gray.5" ta="center">
              Last updated: July 2, 2025
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Terms Sections */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="lg">
          <Stack gap="xl" ref={sectionsRef}>
            {termsSections.map((section, index) => (
              <Paper
                key={index}
                className="terms-section"
                p="xl"
                radius="lg"
                style={{
                  background: "linear-gradient(135deg, rgba(67, 97, 238, 0.05) 0%, rgba(58, 12, 163, 0.05) 100%)",
                  border: "1px solid rgba(67, 97, 238, 0.15)",
                  backdropFilter: "blur(5px)",
                  WebkitBackdropFilter: "blur(5px)",
                  transform: 'translate3d(0,0,0)',
                  WebkitBackfaceVisibility: 'hidden',
                  WebkitPerspective: 1000
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

      {/* Cancellation & Refund Policy Section */}
      <Box py={60} style={{ backgroundColor: theme.colors.dark[8] }}>
        <Container size="lg">
          <Stack gap="xl">
            <Title
              order={2}
              ta="center"
              c={theme.white}
              style={{ fontSize: "2rem" }}
            >
              Cancellation & Refund Policy
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
                    Non-Refundable Policy
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    All subscription payments are non-refundable, including but not limited to mistaken purchases, subscriber dissatisfaction, missed promotional periods, and removal of posts due to Terms of Service violations (e.g., trolling, impersonation, inappropriate content). No partial refunds will be issued for unused time within a billing cycle.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Cancellation Process
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }} mb="sm">
                    You may cancel your subscription at any time by visiting: <strong>https://incomingclass.com/subscription</strong>
                  </Text>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    Upon cancellation: Your subscription remains active until the end of your current billing period, you will not be billed again after the current period ends, and canceling does not result in a refund for the current or previous charges.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Content Denial
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }} mb="sm">
                    Incoming Class reserves the right to deny, remove, or refuse to post any submitted content that violates our Terms of Service. Reasons include, but are not limited to:
                  </Text>
                  <Text c="gray.3" style={{ lineHeight: 1.6, paddingLeft: "20px" }}>
                    • Harassment, hate speech, or trolling<br/>
                    • Impersonation or misleading identity<br/>
                    • Promotion of external products or services<br/>
                    • False information or spam
                  </Text>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }} mt="sm">
                    No refund will be issued if your post is denied or removed due to violations.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Contact for Billing Support
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    For billing or account support, reach out to us at: <strong>📧 support@incomingclass.com</strong>
                  </Text>
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Additional Terms Information */}
      <Box py={60} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="lg">
          <Stack gap="xl">
            <Title
              order={2}
              ta="center"
              c={theme.white}
              style={{ fontSize: "2rem" }}
            >
              Additional Terms
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
                    User-Generated Content
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    You may submit bios, images, and other content to be posted publicly. You represent that you own or have permission to use the content, it's not false or harmful, doesn't infringe on others' rights, and any people featured have consented. We may remove any content at our discretion.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Site Contents and Ownership
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    All content, design, logos, and materials on the Site and social media pages are the intellectual property of Incoming Class. You may not reuse or reproduce them without permission. Any authorized uses must retain our copyright notice.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Disclaimer of Warranty
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We provide the Site and Service "as is." We make no guarantees about uptime, accuracy, or outcomes. Use the Service at your own risk.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Limitation of Liability
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    Incoming Class and Incoming Class LLC are not liable for any indirect, incidental, or consequential damages. Our maximum liability to you will not exceed the payment option selected or the amount you paid us in the past 12 months.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    DMCA Policy
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    If you believe content infringes your copyright, send a DMCA notice to legal@incomingclass.com including your contact info, signature, description of the infringing material and location, good faith belief of unauthorized use, and statement of accuracy under penalty of perjury.
                  </Text>
                </Box>

                <Box>
                  <Title order={3} c={theme.white} mb="sm" size="lg">
                    Modifications to Terms
                  </Title>
                  <Text c="gray.3" style={{ lineHeight: 1.6 }}>
                    We may update these Terms at any time. It's your responsibility to review them periodically. Your continued use means acceptance. Electronic signatures (clicking "I Agree" or using the Service) constitute legally binding agreements.
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
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              transform: 'translate3d(0,0,0)',
              WebkitBackfaceVisibility: 'hidden',
              WebkitPerspective: 1000
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
                Questions About Terms?
              </Title>
              
              <Text c="gray.3" size="lg" maw={400} mx="auto">
                For questions about these terms or billing support, please contact us at support@incomingclass.com.
              </Text>
              
              <Group justify="center" gap="md" mt="lg">
                <Anchor
                  href="mailto:support@incomingclass.com"
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
                  support@incomingclass.com
                </Anchor>
                
                <Anchor
                  href="mailto:legal@incomingclass.com"
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
                  legal@incomingclass.com
                </Anchor>
              </Group>
            </Stack>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default TermsPage; 