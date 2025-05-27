import React, { useRef, useEffect } from "react";
import {
  Box,
  Container,
  Group,
  Stack,
  Text,
  Title,
  AvatarGroup,
  Avatar,
  useMantineTheme,
} from "@mantine/core";
import gsap from "gsap";
import CollegeSelect from "../CollegeSelectComponent/CollegeSelect";

// CSS keyframes for the floating animations and stars twinkling
const animationStyles = `
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
  
  @keyframes twinkle-1 {
    0%, 100% { opacity: 0.2; box-shadow: 0 0 3px #fff, 0 0 5px #fff; }
    50% { opacity: 1; box-shadow: 0 0 12px #fff, 0 0 24px #fff, 0 0 36px #fff; }
  }
  
  @keyframes twinkle-2 {
    0%, 100% { opacity: 1; box-shadow: 0 0 10px #fff, 0 0 15px #4361ee; }
    40% { opacity: 0.4; box-shadow: 0 0 3px #fff; }
    60% { opacity: 0.4; box-shadow: 0 0 3px #fff; }
  }
  
  @keyframes twinkle-3 {
    0%, 100% { opacity: 0.7; box-shadow: 0 0 6px #fff, 0 0 10px #e5383b; }
    33% { opacity: 1; box-shadow: 0 0 15px #fff, 0 0 22px #e5383b; }
    66% { opacity: 0.3; box-shadow: 0 0 3px #fff; }
  }
  
  .star {
    background: radial-gradient(circle at center, #fff 0%, rgba(255, 255, 255, 0.3) 70%, rgba(255, 255, 255, 0) 100%);
    border-radius: 50%;
    transform-origin: center;
  }
  
  .star-large {
    width: 5px !important;
    height: 5px !important;
  }
  
  .star-medium {
    width: 3.5px !important;
    height: 3.5px !important;
  }
  
  .star-small {
    width: 2px !important;
    height: 2px !important;
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
      ease: "back.out(1.2)",
    });
    textTl.to(".hero-text", { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");
    textTl.to(
      ".hero-buttons button",
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      },
      "-=0.4"
    );
    textTl.to(
      ".hero-avatars",
      { opacity: 1, scale: 1, duration: 0.6 },
      "-=0.2"
    );

    // Add the timeline to the master timeline
    masterTl.add(textTl);

    // For the stars (previously dots)
    const stars = document.querySelectorAll(".animated-stars > div");
    stars.forEach((star, index) => {
      // Add a subtle initial animation to each star
      gsap.fromTo(
        star,
        {
          opacity: 0,
          scale: 0.3,
        },
        {
          opacity: () => Math.random() * 0.5 + 0.5, // Random initial opacity
          scale: 1,
          duration: 0.1,
          delay: index * 0.03,
        }
      );
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
        ease: "sine.inOut",
      });

      // Circle 2 animation
      gsap.to(bgCircle2Ref.current, {
        y: 40,
        x: -30,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // Circle 3 animation
      gsap.to(bgCircle3Ref.current, {
        y: -50,
        x: -20,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    }

    // Animate gradient backgrounds
    if (bgGradient1Ref.current && bgGradient2Ref.current) {
      // Gradient 1 animation
      gsap.to(bgGradient1Ref.current, {
        rotation: 360,
        duration: 60,
        repeat: -1,
        ease: "none",
      });

      // Gradient 2 animation
      gsap.to(bgGradient2Ref.current, {
        rotation: -360,
        duration: 80,
        repeat: -1,
        ease: "none",
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
      gsap.to(heroImageGlowRef.current, {
        scale: 1.2,
        opacity: 0.6,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
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
          delay: 0.2,
        },
        "-=0.3"
      );

      // Add floating animation to circle badge
      gsap.to(circleBadgeRef.current, {
        y: "-10px",
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }
  }, []);

  return (
    <Box
      style={{
        background: `linear-gradient(135deg, #000000 0%, #1a0030 100%)`,
        padding: "120px 0 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Add style tag for keyframes */}
      <style>{animationStyles}</style>

      {/* Animated background elements */}
      <Box
        ref={bgGradient1Ref}
        style={{
          position: "absolute",
          top: "-50%",
          left: "-50%",
          width: "150%",
          height: "150%",
          background:
            "radial-gradient(circle at center, rgba(67, 97, 238, 0.03) 0%, rgba(67, 97, 238, 0) 70%)",
          opacity: 0.6,
          zIndex: 0,
        }}
      />

      <Box
        ref={bgGradient2Ref}
        style={{
          position: "absolute",
          top: "-30%",
          right: "-30%",
          width: "120%",
          height: "120%",
          background:
            "radial-gradient(circle at center, rgba(229, 56, 59, 0.04) 0%, rgba(229, 56, 59, 0) 60%)",
          opacity: 0.5,
          zIndex: 0,
        }}
      />

      <Box
        ref={bgCircle1Ref}
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(67, 97, 238, 0.08) 0%, rgba(67, 97, 238, 0) 70%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />

      <Box
        ref={bgCircle2Ref}
        style={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(229, 56, 59, 0.08) 0%, rgba(229, 56, 59, 0) 70%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      <Box
        ref={bgCircle3Ref}
        style={{
          position: "absolute",
          bottom: "10%",
          left: "40%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(30px)",
          zIndex: 0,
        }}
      />

      {/* Small animated stars (previously dots) */}
      <Box
        className="animated-stars"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      >
        {Array.from({ length: 50 }).map((_, index) => {
          // Determine star size and animation properties
          const sizeClass =
            index % 5 === 0
              ? "star-large"
              : index % 3 === 0
              ? "star-medium"
              : "star-small";
          const twinkleAnimation =
            index % 3 === 0
              ? "twinkle-1"
              : index % 2 === 0
              ? "twinkle-2"
              : "twinkle-3";
          const animationDuration = Math.random() * 3 + 2; // Random duration between 2-5s
          const floatAnimation = `float-${index % 5} ${
            Math.random() * 10 + 15
          }s infinite ease-in-out`;

          return (
            <Box
              key={index}
              className={`star ${sizeClass}`}
              style={{
                position: "absolute",
                zIndex: 1,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `${twinkleAnimation} ${animationDuration}s infinite ease-in-out, ${floatAnimation}`,
                animationDelay: `${Math.random() * 5}s, 0s`,
              }}
            />
          );
        })}
      </Box>

      <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
        <Stack align="center" mb={60}>
          <Title
            ref={heroTitleRef}
            order={1}
            mb="xl"
            ta="center"
            className="hero-title"
            style={{
              fontSize: "3.8rem",
              lineHeight: 1.1,
              fontWeight: 800,
              maxWidth: 850,
            }}
          >
            <Text inherit component="span" c={theme.white}>
              Find your squad before{" "}
            </Text>
            <Text
              inherit
              component="span"
              variant="gradient"
              gradient={{ from: "#4361ee", to: "#3a0ca3", deg: 45 }}
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
            Connect with your future classmates, find your perfect roomie, and
            build your college circle—all before orientation.
          </Text>

          <Box 
            ref={heroButtonsRef}
            className="hero-buttons"
            style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 'xl'
            }}
          >
            <Box style={{ width: '100%', maxWidth: '500px' }}>
              <CollegeSelect />
            </Box>
          </Box>

          <Group
            style={{ zIndex: "-2" }}
            align="center"
            gap="md"
            mt={10}
            className="hero-avatars"
          >
            <AvatarGroup spacing="sm">
              <Avatar
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                radius="xl"
              />
              <Avatar
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                radius="xl"
              />
              <Avatar
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80"
                radius="xl"
              />
              <Avatar radius="xl">+</Avatar>
            </AvatarGroup>
            <Text size="sm" c="gray.5" fw={600}>
              <Text span fw={700} c={theme.white}>
                526+
              </Text>{" "}
              Students Connected
            </Text>
          </Group>
        </Stack>

        {/* Dynamic Student Cards - Desktop only */}

        {/* Responsive cards for mobile */}
      </Container>
    </Box>
  );
};

export default HeroSection;
