import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, Title, Stack, Transition, Image } from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import gsap from 'gsap';
import images from '../../../assets/images';

// Define color theme for slideshow
const slideshowColors = {
  darkBlue: "#1E3A8A",
  mediumBlue: "#1971C2",
  lightBlue: "#4A5DFD",
  accent: "#4361ee",
  lightBlueGray: "#E1E7FF",
  white: "#FFFFFF"
};

// Define types for our features
interface Feature {
  id: number;
  title: string;
  description: string;
  image: string;
}

// Sample features data with placeholder images
// In a real app, you would import actual images
const features: Feature[] = [
  {
    id: 1,
    title: "Connect with Classmates",
    description: "Find and connect with students from your college and build your network before classes even start.",
    image: images.authSlideShow1,
  },
  {
    id: 2,
    title: "Discover Opportunities",
    description: "Explore internships, research positions, and clubs tailored to your interests and academic goals.",
    image: images.authSlideShow2,
  },
  // {
  //   id: 3,
  //   title: "Track Applications",
  //   description: "Manage your college applications in one place and get insights on your admission chances.",
  //   image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?q=80&w=1600&auto=format&fit=crop",
  // },
  {
    id: 4,
    title: "Get Expert Advice",
    description: "Access resources and guidance from current students and academic advisors at your target schools.",
    image: images.authSlideShow3,
  },
];

const FeatureSlideshow: React.FC = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const imageRef = useRef<HTMLImageElement>(null);

  // Set up interval for slideshow
  const interval = useInterval(() => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
      setIsVisible(true);
    }, 500); // Wait for fade-out before changing slide
  }, 5000); // Change slide every 5 seconds

  // Start the interval when component mounts
  useEffect(() => {
    interval.start();
    return interval.stop;
  }, []);

  // Add subtle animation to the current background image
  useEffect(() => {
    if (imageRef.current) {
      // Reset any previous animations
      gsap.killTweensOf(imageRef.current);
      
      // Set initial state
      gsap.set(imageRef.current, { 
        scale: 1.05, 
        xPercent: 0, 
        yPercent: 0 
      });
      
      // Create a subtle zoom and pan animation
      gsap.to(imageRef.current, {
        scale: 1.15,
        xPercent: Math.random() > 0.5 ? 2 : -2, // Slight horizontal movement
        yPercent: Math.random() > 0.5 ? 2 : -2, // Slight vertical movement
        duration: 10,
        ease: "none",
      });
    }
  }, [currentFeature]);

  const feature = features[currentFeature];

  return (
    <Box
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${slideshowColors.darkBlue} 0%, ${slideshowColors.mediumBlue} 100%)`,
      }}
    >
      {/* Background image with overlay */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.8, // Increased opacity to show more of the original image
          transition: 'opacity 1s ease',
        }}
      >
        <Image 
          ref={imageRef}
          src={feature.image}
          alt={feature.title}
          height="100%" 
          width="100%"
          fit="cover"
          style={{ 
            filter: 'blur(0px)' // Removed blur to show original image clearly
          }}
        />
      </Box>

      {/* Overlay gradient - reduced opacity */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.5))`, // Changed to neutral dark gradient
          zIndex: 1,
        }}
      />

      {/* Decorative elements - subtle blurs */}
      <Box
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%)`,
          borderRadius: '50%',
          filter: 'blur(40px)',
          opacity: 0.4,
          zIndex: 1,
        }}
      />

      <Box
        style={{
          position: 'absolute',
          bottom: '20%',
          left: '10%',
          width: '250px',
          height: '250px',
          background: `radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%)`,
          borderRadius: '50%',
          filter: 'blur(30px)',
          opacity: 0.5,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          zIndex: 2,
        }}
      >
        <Transition
          mounted={isVisible}
          transition="fade"
          duration={500}
        >
          {(styles) => (
            <Stack
              align="center"
              justify="center"
              gap="xl"
              style={{
                ...styles,
                maxWidth: '80%',
                textAlign: 'center',
              }}
            >
              <Title order={1} style={{ 
                fontSize: '2.7rem', 
                fontWeight: 700, 
                color: slideshowColors.white,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                {feature.title}
              </Title>
              <Text size="xl" style={{ 
                maxWidth: '600px', 
                lineHeight: 1.6, 
                color: slideshowColors.lightBlueGray,
                textShadow: '0 1px 8px rgba(0,0,0,0.2)'
              }}>
                {feature.description}
              </Text>

              {/* Indicator dots */}
              <Box style={{ display: 'flex', gap: '10px', marginTop: '2rem' }}>
                {features.map((_, index) => (
                  <Box
                    key={index}
                    style={{
                      width: index === currentFeature ? '12px' : '10px',
                      height: index === currentFeature ? '12px' : '10px',
                      borderRadius: '50%',
                      backgroundColor: index === currentFeature ? slideshowColors.lightBlue : 'rgba(255,255,255,0.4)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      transform: index === currentFeature ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: index === currentFeature ? `0 0 10px ${slideshowColors.lightBlue}80` : 'none',
                    }}
                    onClick={() => {
                      if (index === currentFeature) return;
                      setIsVisible(false);
                      setTimeout(() => {
                        setCurrentFeature(index);
                        setIsVisible(true);
                      }, 500);
                    }}
                  />
                ))}
              </Box>
            </Stack>
          )}
        </Transition>
      </Box>
    </Box>
  );
};

export default FeatureSlideshow; 