import React, { useRef, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Group,
  Text, 
  Title,
  ActionIcon,
  Flex,
  useMantineTheme,
  Divider
} from '@mantine/core';
import { IconBrandTwitter, IconBrandInstagram, IconBrandFacebook, IconHeart } from '@tabler/icons-react';
import { Link } from 'react-router';
import gsap from 'gsap';

export const Footer: React.FC = () => {
  const theme = useMantineTheme();
  const currentYear = new Date().getFullYear();
  
  const footerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const socialRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (footerRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none"
        }
      });
      
      tl.fromTo(
        logoRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
      );
      
      tl.fromTo(
        dividerRef.current,
        { width: "0%" },
        { width: "100%", duration: 0.8, ease: "power2.inOut" },
        "-=0.3"
      );
      
      tl.fromTo(
        socialRef.current?.children || [],
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.4)" },
        "-=0.4"
      );
    }
  }, []);
  
  return (
    <Box 
      ref={footerRef}
      style={{
        background: "linear-gradient(135deg, rgba(15,15,20,0.95) 0%, rgba(33,17,70,0.95) 100%)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        position: "relative",
        overflow: "hidden"
      }}
      py={{ base: 40, md: 50 }}
    >
      {/* Decorative background element */}
      <Box 
        style={{
          position: "absolute",
          top: "-300px",
          right: "-300px",
          width: "600px",
          height: "600px",
          background: "radial-gradient(circle, rgba(67,97,238,0.1) 0%, rgba(67,97,238,0) 70%)",
          pointerEvents: "none",
          zIndex: 0
        }}
      />
      
      <Container size="xl">
        <Flex 
          direction="column"
          align="center"
          gap={32}
        >
          <Title 
            ref={logoRef}
            order={3} 
            c={theme.white}
            style={{ 
              fontWeight: 800, 
              letterSpacing: "1px",
              position: "relative"
            }}
          >
            <Box 
              component="span" 
              style={{ 
                background: "linear-gradient(90deg, #4361ee, #6f79fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              INCOMING
            </Box>
            <Box 
              component="span" 
              style={{ 
                color: theme.white,
                opacity: 0.95
              }}
            >
              CLASS
            </Box>
          </Title>
          
          <Flex 
            gap={40} 
            justify="center" 
            wrap="wrap"
            maw={500}
            mx="auto"
          >
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <Text 
                size="sm" 
                c="dimmed" 
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { color: theme.white }
                }}
              >
                About
              </Text>
            </Link>

            <Link to="/contact" style={{ textDecoration: 'none' }}>
              <Text 
                size="sm" 
                c="dimmed" 
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { color: theme.white }
                }}
              >
                Contact
              </Text>
            </Link>
            <Link to="/privacy" style={{ textDecoration: 'none' }}>
              <Text 
                size="sm" 
                c="dimmed" 
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': { color: theme.white }
                }}
              >
                Privacy
              </Text>
            </Link>
          </Flex>
          
          <Box w="100%" ref={dividerRef}>
            <Divider 
              my="sm" 
              variant="dashed" 
              style={{ 
                borderColor: 'rgba(255,255,255,0.07)',
                width: '100%'
              }}
            />
          </Box>
          
          <Flex 
            justify="space-between" 
            align="center"
            w="100%"
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 20, sm: 0 }}
          >
            <Text size="xs" c="dimmed" style={{ opacity: 0.8 }}>
              © {currentYear} IncomingClass. Made with <IconHeart size={12} style={{ display: 'inline', verticalAlign: 'middle' }} color={theme.colors.red[5]} /> for students.
            </Text>
            
            <Group gap="lg" ref={socialRef}>
              <ActionIcon 
                size="md" 
                variant="subtle" 
                radius="xl" 
                color="blue"
                style={{
                  background: 'rgba(67, 97, 238, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    background: 'rgba(67, 97, 238, 0.2)',
                  }
                }}
              >
                <IconBrandTwitter size={18} />
              </ActionIcon>
              <ActionIcon 
                size="md" 
                variant="subtle" 
                radius="xl" 
                color="blue"
                style={{
                  background: 'rgba(67, 97, 238, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    background: 'rgba(67, 97, 238, 0.2)',
                  }
                }}
              >
                <IconBrandInstagram size={18} />
              </ActionIcon>
              <ActionIcon 
                size="md" 
                variant="subtle" 
                radius="xl" 
                color="blue"
                style={{
                  background: 'rgba(67, 97, 238, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    background: 'rgba(67, 97, 238, 0.2)',
                  }
                }}
              >
                <IconBrandFacebook size={18} />
              </ActionIcon>
            </Group>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer; 