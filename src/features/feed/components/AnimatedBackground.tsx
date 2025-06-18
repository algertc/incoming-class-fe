import React, { useRef, useEffect, useState } from "react";
import { Box } from "@mantine/core";
import gsap from "gsap";

// Optimized CSS keyframes for the floating animations and stars twinkling - IOS SAFARI OPTIMIZED
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
  
  @keyframes twinkle-1 {
    0%, 100% { opacity: 0.3; transform: translate3d(0, 0, 0) scale(0.8); }
    50% { opacity: 0.7; transform: translate3d(0, 0, 0) scale(1.1); }
  }
  
  @keyframes twinkle-2 {
    0%, 100% { opacity: 0.6; transform: translate3d(0, 0, 0) scale(1); }
    40%, 60% { opacity: 0.3; transform: translate3d(0, 0, 0) scale(0.9); }
  }
  
  .star {
    background: radial-gradient(circle at center, #fff 0%, rgba(255, 255, 255, 0.3) 70%, rgba(255, 255, 255, 0) 100%);
    border-radius: 50%;
    transform-origin: center;
    will-change: transform, opacity;
    position: absolute;
    z-index: 1;
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
  
  .bg-optimized {
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
  }
`;

export const AnimatedBackground: React.FC = () => {
  // Animated background elements refs
  const bgCircle1Ref = useRef<HTMLDivElement>(null);
  const bgCircle2Ref = useRef<HTMLDivElement>(null);
  const bgCircle3Ref = useRef<HTMLDivElement>(null);
  const bgGradient1Ref = useRef<HTMLDivElement>(null);
  const bgGradient2Ref = useRef<HTMLDivElement>(null);
  const starsContainerRef = useRef<HTMLDivElement>(null);
  
  // Generate stars only once with memoization - REDUCED FOR IOS SAFARI
  const [stars] = useState(() => 
    Array.from({ length: 12 }).map((_, index) => {
      // Determine star size and animation properties - simplified
      const sizeClass = index % 4 === 0 ? "star-large" : index % 2 === 0 ? "star-medium" : "star-small";
      const twinkleAnimation = index % 2 === 0 ? "twinkle-1" : "twinkle-2";
      const animationDuration = Math.random() * 2 + 4; // Slower duration for performance
      const floatIndex = index % 3;
      const floatDuration = Math.random() * 5 + 30; // Much slower float animations (30-35s)
      
      return {
        key: `star-${index}`,
        className: `star ${sizeClass}`,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `${twinkleAnimation} ${animationDuration}s infinite ease-in-out, float-${floatIndex} ${floatDuration}s infinite ease-in-out`,
          animationDelay: `${Math.random() * 3}s, 0s`,
        }
      };
    })
  );

  useEffect(() => {
    // Animate background elements with reduced complexity - OPTIMIZED FOR SAFARI
    if (bgCircle1Ref.current && bgCircle2Ref.current && bgCircle3Ref.current) {
      // Use GSAP for the larger elements only with hardware acceleration
      gsap.to(bgCircle1Ref.current, {
        y: -30,
        x: 20,
        duration: 25, // Much slower animations
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true,
      });

      gsap.to(bgCircle2Ref.current, {
        y: 40,
        x: -30,
        duration: 30,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
        force3D: true,
      });

      gsap.to(bgCircle3Ref.current, {
        y: -50,
        x: -20,
        duration: 35,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
        force3D: true,
      });
    }

    // Animate gradient backgrounds with reduced rotation speed
    if (bgGradient1Ref.current && bgGradient2Ref.current) {
      gsap.to(bgGradient1Ref.current, {
        rotation: 360,
        duration: 200, // Much slower rotation
        repeat: -1,
        ease: "none",
        force3D: true,
      });

      gsap.to(bgGradient2Ref.current, {
        rotation: -360,
        duration: 250, // Much slower rotation
        repeat: -1,
        ease: "none",
        force3D: true,
      });
    }

    return () => {
      // Clean up animations when component unmounts
      gsap.killTweensOf([
        bgCircle1Ref.current,
        bgCircle2Ref.current,
        bgCircle3Ref.current,
        bgGradient1Ref.current,
        bgGradient2Ref.current,
      ]);
    };
  }, []);

  return (
    <>
      {/* Add the custom style tag for animations */}
      <style>{animationStyles}</style>

      {/* Background elements */}
      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
          opacity: 0.6,
          pointerEvents: "none", // Prevent interaction with background
        }}
      >
        {/* Animated background gradients - SAFARI OPTIMIZED */}
        <Box
          ref={bgGradient1Ref}
          className="bg-optimized"
          style={{
            position: "absolute",
            top: "-50%",
            left: "-20%",
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle, rgba(25, 113, 194, 0.15) 0%, rgba(25, 113, 194, 0) 70%)",
            borderRadius: "50%",
            opacity: 0.3,
          }}
        />
        <Box
          ref={bgGradient2Ref}
          className="bg-optimized"
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "-10%",
            width: "80%",
            height: "80%",
            background:
              "radial-gradient(circle, rgba(74, 93, 253, 0.15) 0%, rgba(74, 93, 253, 0) 70%)",
            borderRadius: "50%",
            opacity: 0.3,
          }}
        />

        {/* Animated circles/blob elements - SAFARI OPTIMIZED */}
        <Box
          ref={bgCircle1Ref}
          className="bg-optimized"
          style={{
            position: "absolute",
            top: "15%",
            right: "10%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(74, 93, 253, 0.08) 0%, rgba(74, 93, 253, 0) 70%)",
            borderRadius: "50%",
            opacity: 0.6,
          }}
        />
        <Box
          ref={bgCircle2Ref}
          className="bg-optimized"
          style={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(circle, rgba(25, 113, 194, 0.08) 0%, rgba(25, 113, 194, 0) 70%)",
            borderRadius: "50%",
            opacity: 0.5,
          }}
        />
        <Box
          ref={bgCircle3Ref}
          className="bg-optimized"
          style={{
            position: "absolute",
            top: "40%",
            left: "20%",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(114, 137, 218, 0.08) 0%, rgba(114, 137, 218, 0) 70%)",
            borderRadius: "50%",
            opacity: 0.5,
          }}
        />

        {/* Stars container */}
        <Box
          ref={starsContainerRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            overflow: "hidden",
            opacity: 0.7,
          }}
        >
          {/* Render stars */}
          {stars.map((star) => (
            <Box
              key={star.key}
              className={star.className}
              style={star.style}
            />
          ))}
        </Box>
      </Box>
    </>
  );
};

export default AnimatedBackground; 