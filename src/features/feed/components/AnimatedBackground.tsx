import React, { useRef, useEffect, useState } from "react";
import { Box } from "@mantine/core";
import gsap from "gsap";

// Optimized CSS keyframes for the floating animations and stars twinkling
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
  
  @keyframes twinkle-1 {
    0%, 100% { opacity: 0.2; transform: scale(0.8); }
    50% { opacity: 0.8; transform: scale(1.2); }
  }
  
  @keyframes twinkle-2 {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    40%, 60% { opacity: 0.3; transform: scale(0.7); }
  }
  
  .star {
    background: radial-gradient(circle at center, #fff 0%, rgba(255, 255, 255, 0.3) 70%, rgba(255, 255, 255, 0) 100%);
    border-radius: 50%;
    transform-origin: center;
    will-change: transform, opacity;
    position: absolute;
    z-index: 1;
  }
  
  .star-large {
    width: 5px !important;
    height: 5px !important;
    filter: blur(1px);
  }
  
  .star-medium {
    width: 3.5px !important;
    height: 3.5px !important;
    filter: blur(0.5px);
  }
  
  .star-small {
    width: 2px !important;
    height: 2px !important;
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
  
  // Generate stars only once with memoization
  const [stars] = useState(() => 
    Array.from({ length: 25 }).map((_, index) => {
      // Determine star size and animation properties - simplified
      const sizeClass = index % 5 === 0 ? "star-large" : index % 3 === 0 ? "star-medium" : "star-small";
      const twinkleAnimation = index % 2 === 0 ? "twinkle-1" : "twinkle-2";
      const animationDuration = Math.random() * 3 + 2; // Random duration between 2-5s
      const floatIndex = index % 3;
      const floatDuration = Math.random() * 5 + 20; // Slower float animations (20-25s)
      
      return {
        key: `star-${index}`,
        className: `star ${sizeClass}`,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `${twinkleAnimation} ${animationDuration}s infinite ease-in-out, float-${floatIndex} ${floatDuration}s infinite ease-in-out`,
          animationDelay: `${Math.random() * 5}s, 0s`,
        }
      };
    })
  );

  useEffect(() => {
    // Animate background elements with reduced complexity
    if (bgCircle1Ref.current && bgCircle2Ref.current && bgCircle3Ref.current) {
      // Use GSAP for the larger elements only
      gsap.to(bgCircle1Ref.current, {
        y: -30,
        x: 20,
        duration: 15, // Slower animations
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(bgCircle2Ref.current, {
        y: 40,
        x: -30,
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      gsap.to(bgCircle3Ref.current, {
        y: -50,
        x: -20,
        duration: 20,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    }

    // Animate gradient backgrounds with reduced rotation speed
    if (bgGradient1Ref.current && bgGradient2Ref.current) {
      gsap.to(bgGradient1Ref.current, {
        rotation: 360,
        duration: 120, // Slower rotation
        repeat: -1,
        ease: "none",
      });

      gsap.to(bgGradient2Ref.current, {
        rotation: -360,
        duration: 150, // Slower rotation
        repeat: -1,
        ease: "none",
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
        {/* Animated background gradients */}
        <Box
          ref={bgGradient1Ref}
          style={{
            position: "absolute",
            top: "-50%",
            left: "-20%",
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(circle, rgba(25, 113, 194, 0.2) 0%, rgba(25, 113, 194, 0) 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            opacity: 0.4,
            willChange: "transform",
          }}
        />
        <Box
          ref={bgGradient2Ref}
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "-10%",
            width: "80%",
            height: "80%",
            background:
              "radial-gradient(circle, rgba(74, 93, 253, 0.2) 0%, rgba(74, 93, 253, 0) 70%)",
            borderRadius: "50%",
            filter: "blur(40px)",
            opacity: 0.4,
            willChange: "transform",
          }}
        />

        {/* Animated circles/blob elements */}
        <Box
          ref={bgCircle1Ref}
          style={{
            position: "absolute",
            top: "15%",
            right: "10%",
            width: "300px",
            height: "300px",
            background:
              "radial-gradient(circle, rgba(74, 93, 253, 0.1) 0%, rgba(74, 93, 253, 0) 70%)",
            borderRadius: "50%",
            filter: "blur(20px)",
            opacity: 0.8,
            willChange: "transform",
          }}
        />
        <Box
          ref={bgCircle2Ref}
          style={{
            position: "absolute",
            bottom: "20%",
            left: "5%",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(circle, rgba(25, 113, 194, 0.1) 0%, rgba(25, 113, 194, 0) 70%)",
            borderRadius: "50%",
            filter: "blur(20px)",
            opacity: 0.6,
            willChange: "transform",
          }}
        />
        <Box
          ref={bgCircle3Ref}
          style={{
            position: "absolute",
            top: "40%",
            left: "20%",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(114, 137, 218, 0.1) 0%, rgba(114, 137, 218, 0) 70%)",
            borderRadius: "50%",
            filter: "blur(20px)",
            opacity: 0.7,
            willChange: "transform",
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