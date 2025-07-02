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
import CollegeSearchSelect from "../../../components/common/CollegeSearchSelect";
import { useLocalStorage } from "@mantine/hooks";
import { useNavigate } from "react-router";
import { useFeedStore } from "../../../store/feed.store";
import { useAuthStore } from "../../../store/auth.store";

// CSS keyframes for the floating animations and stars twinkling - OPTIMIZED FOR IOS SAFARI
const animationStyles = `
  @keyframes float-0 {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(15px, -15px, 0); }
  }
  @keyframes float-1 {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(-20px, -10px, 0); }
  }
  @keyframes float-2 {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(10px, -25px, 0); }
  }
  @keyframes float-3 {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(-15px, -15px, 0); }
  }
  @keyframes float-4 {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(20px, -8px, 0); }
  }
  
  @keyframes twinkle-1 {
    0%, 100% { opacity: 0.3; transform: translate3d(0, 0, 0) scale(0.8); }
    50% { opacity: 0.8; transform: translate3d(0, 0, 0) scale(1.1); }
  }
  
  @keyframes twinkle-2 {
    0%, 100% { opacity: 0.8; transform: translate3d(0, 0, 0) scale(1); }
    40%, 60% { opacity: 0.4; transform: translate3d(0, 0, 0) scale(0.9); }
  }
  
  @keyframes twinkle-3 {
    0%, 100% { opacity: 0.6; transform: translate3d(0, 0, 0) scale(0.9); }
    33%, 66% { opacity: 0.9; transform: translate3d(0, 0, 0) scale(1.05); }
  }
  
  .star {
    background: radial-gradient(circle at center, #fff 0%, rgba(255, 255, 255, 0.3) 70%, rgba(255, 255, 255, 0) 100%);
    border-radius: 50%;
    transform-origin: center;
    will-change: transform, opacity;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
  }
  
  .star-large {
    width: 4px !important;
    height: 4px !important;
  }
  
  .star-medium {
    width: 3px !important;
    height: 3px !important;
  }
  
  .star-small {
    width: 2px !important;
    height: 2px !important;
  }
  
  /* Optimize background elements for Safari */
  .bg-element {
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
  }
`;

export const HeroSection: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { setCollegeFromHero } = useFeedStore();
  const [, setSelectedCollege] = useLocalStorage({
    key: "college",
    defaultValue: "",
  });
  const { user } = useAuthStore();

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

  const handleCollegeSelect = (college: { id: string; name: string }) => {
    setSelectedCollege(college.id);
    setCollegeFromHero(college.id, college.name);
    
    // Construct the query parameters
    const queryParams = `?collegeId=${encodeURIComponent(college.id)}&collegeName=${encodeURIComponent(college.name)}&from=hero`;
    
    // Navigate based on authentication state
    if (user) {
      navigate(`/feed${queryParams}`);
    } else {
      navigate(`/signup`);
    }
  };

  useEffect(() => {
    // Set up initial states for hero elements
    gsap.set(".hero-title span", { opacity: 0, y: 50 });
    gsap.set(".hero-text", { opacity: 0, y: 30 });
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
    
    if (heroButtonsRef.current) {
      // Set initial state for heroButtonsRef
      gsap.set(heroButtonsRef.current, { opacity: 0, y: 20 });
      
      // Animate heroButtonsRef
      textTl.to(
        heroButtonsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.4"
      );
    }
    
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

    // Animate background elements - OPTIMIZED FOR SAFARI
    if (bgCircle1Ref.current && bgCircle2Ref.current && bgCircle3Ref.current) {
      // Circle 1 animation - slower and hardware accelerated
      gsap.to(bgCircle1Ref.current, {
        y: -30,
        x: 20,
        duration: 15, // Much slower
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true, // Force hardware acceleration
      });

      // Circle 2 animation - slower and hardware accelerated
      gsap.to(bgCircle2Ref.current, {
        y: 40,
        x: -30,
        duration: 18, // Much slower
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
        force3D: true, // Force hardware acceleration
      });

      // Circle 3 animation - slower and hardware accelerated
      gsap.to(bgCircle3Ref.current, {
        y: -50,
        x: -20,
        duration: 20, // Much slower
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
        force3D: true, // Force hardware acceleration
      });
    }

    // Animate gradient backgrounds - OPTIMIZED FOR SAFARI
    if (bgGradient1Ref.current && bgGradient2Ref.current) {
      // Gradient 1 animation - much slower rotation
      gsap.to(bgGradient1Ref.current, {
        rotation: 360,
        duration: 180, // Much slower rotation for Safari
        repeat: -1,
        ease: "none",
        force3D: true, // Force hardware acceleration
      });

      // Gradient 2 animation - much slower rotation
      gsap.to(bgGradient2Ref.current, {
        rotation: -360,
        duration: 240, // Much slower rotation for Safari
        repeat: -1,
        ease: "none",
        force3D: true, // Force hardware acceleration
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

      {/* Animated background elements - OPTIMIZED FOR SAFARI */}
      <Box
        ref={bgGradient1Ref}
        className="bg-element"
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
        className="bg-element"
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
        className="bg-element"
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(67, 97, 238, 0.08) 0%, rgba(67, 97, 238, 0) 70%)",
          filter: "blur(40px)", // Reduced blur for Safari
          zIndex: 0,
        }}
      />

      <Box
        ref={bgCircle2Ref}
        className="bg-element"
        style={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(229, 56, 59, 0.08) 0%, rgba(229, 56, 59, 0) 70%)",
          filter: "blur(30px)", // Reduced blur for Safari
          zIndex: 0,
        }}
      />

      <Box
        ref={bgCircle3Ref}
        className="bg-element"
        style={{
          position: "absolute",
          bottom: "10%",
          left: "40%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0) 70%)",
          filter: "blur(20px)", // Reduced blur for Safari
          zIndex: 0,
        }}
      />

      {/* Small animated stars (previously dots) - REDUCED FOR PERFORMANCE */}
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
        {Array.from({ length: 20 }).map((_, index) => {
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
          const animationDuration = Math.random() * 2 + 3; // Slower for better performance
          const floatAnimation = `float-${index % 5} ${
            Math.random() * 5 + 20
          }s infinite ease-in-out`; // Much slower floating

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
                animationDelay: `${Math.random() * 3}s, 0s`,
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
              fontWeight: 500,
              maxWidth: 850,
            }}
          >
            <Text inherit component="span" c={theme.white}>
             Your College Network{" "}
            </Text>
            <Text
              inherit
              component="span"
              variant="gradient"
              gradient={{ from: "#4361ee", to: "#3a0ca3", deg: 45 }}
            >
              Starts Here.
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
            Skip the awkward intros later- start connecting now. Link your social media, post your profile, and match with roommates and friends before move-in day.
          </Text>

          <Box 
            ref={heroButtonsRef}
            style={{ width: "100%", maxWidth: 500, opacity: 0 }}
          >
            <CollegeSearchSelect onSelect={handleCollegeSelect} />
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

        
      </Container>
    </Box>
  );
};

export default HeroSection;
