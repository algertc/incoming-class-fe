import { useRef, useEffect } from 'react'
import { 
  Box, 
  useMantineTheme,
} from '@mantine/core'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Import all the components
import { HeroSection } from '../../components/Home/HeroSection/HeroSection'
import { StatisticsSection } from '../../components/Home/StatisticsSection/StatisticsSection'
import { FeaturedSection } from '../../components/Home/FeaturedSection/FeaturedSection'
import { HowItWorksSection } from '../../components/Home/HowItWorksSection/HowItWorksSection'
import { CollegesSection } from '../../components/Home/CollegesSection/CollegesSection'
import { CTASection } from '../../components/Home/CTASection/CTASection'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

const Home: React.FC = () => {
  const theme = useMantineTheme();
  
  // Animated background elements refs
  const bgCircle1Ref = useRef<HTMLDivElement>(null);
  const bgCircle2Ref = useRef<HTMLDivElement>(null);
  const bgCircle3Ref = useRef<HTMLDivElement>(null);
  const bgGradient1Ref = useRef<HTMLDivElement>(null);
  const bgGradient2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    
    return () => {
      // Clean up animations when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <Box style={{ backgroundColor: theme.colors.dark[9], minHeight: '100vh' }}>
      {/* Add the custom style tag for animations */}
      <style>{floatingAnimationStyles}</style>
      
      {/* Background elements */}
      <Box
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          zIndex: 0,
          opacity: 0.6
        }}
      >
        {/* Animated background gradients */}
        <Box
          ref={bgGradient1Ref}
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle, rgba(25, 113, 194, 0.2) 0%, rgba(25, 113, 194, 0) 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            opacity: 0.4
          }}
        />
        <Box
          ref={bgGradient2Ref}
          style={{
            position: 'absolute',
            bottom: '-30%',
            right: '-10%',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(74, 93, 253, 0.2) 0%, rgba(74, 93, 253, 0) 70%)',
            borderRadius: '50%',
            filter: 'blur(40px)',
            opacity: 0.4
          }}
        />
        
        {/* Animated circles/blob elements */}
        <Box
          ref={bgCircle1Ref}
          style={{
            position: 'absolute',
            top: '15%',
            right: '10%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(74, 93, 253, 0.1) 0%, rgba(74, 93, 253, 0) 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            opacity: 0.8
          }}
        />
        <Box
          ref={bgCircle2Ref}
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '5%',
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(25, 113, 194, 0.1) 0%, rgba(25, 113, 194, 0) 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            opacity: 0.6
          }}
        />
        <Box
          ref={bgCircle3Ref}
          style={{
            position: 'absolute',
            top: '40%',
            left: '20%',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(114, 137, 218, 0.1) 0%, rgba(114, 137, 218, 0) 70%)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            opacity: 0.7
          }}
        />
      </Box>
      
      {/* Main content sections */}
      <HeroSection />
      <StatisticsSection />
      <FeaturedSection />
      <HowItWorksSection />
      <CollegesSection />
      <CTASection />
    </Box>
  )
}

export default Home;