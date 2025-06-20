import React, { useRef, useEffect, useState } from "react";
import { Box } from "@mantine/core";
import gsap from "gsap";

// Optimized CSS keyframes for iOS Safari with reduced complexity
const animationStyles = `
  @keyframes float-0 {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(10px, -10px, 0); }
  }
  @keyframes float-1 {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(-15px, -8px, 0); }
  }
  @keyframes float-2 {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(8px, -12px, 0); }
  }
  
  @keyframes twinkle {
    0%, 100% { opacity: 0.3; transform: translate3d(0, 0, 0) scale(0.9); }
    50% { opacity: 0.6; transform: translate3d(0, 0, 0) scale(1); }
  }
  
  .star {
    background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 50%, transparent 100%);
    border-radius: 50%;
    transform-origin: center;
    will-change: transform, opacity;
    position: absolute;
    z-index: 1;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    perspective: 1000px;
    -webkit-perspective: 1000px;
  }
  
  .star-large {
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
    -webkit-transform: translate3d(0, 0, 0);
    perspective: 1000px;
    -webkit-perspective: 1000px;
  }
`;

export const AnimatedBackground: React.FC = () => {
  const bgCircle1Ref = useRef<HTMLDivElement>(null);
  const bgCircle2Ref = useRef<HTMLDivElement>(null);
  const bgGradient1Ref = useRef<HTMLDivElement>(null);
  const starsContainerRef = useRef<HTMLDivElement>(null);
  
  // Reduced number of stars and simplified animations for better performance
  const [stars] = useState(() => 
    Array.from({ length: 8 }).map((_, index) => {
      const sizeClass = index % 2 === 0 ? "star-large" : "star-small";
      const floatIndex = index % 3;
      const floatDuration = 35 + (index * 2); // Slower animations (35-49s)
      
      return {
        key: `star-${index}`,
        className: `star ${sizeClass}`,
        style: {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `twinkle 4s infinite ease-in-out, float-${floatIndex} ${floatDuration}s infinite ease-in-out`,
          animationDelay: `${Math.random() * 2}s, 0s`,
        }
      };
    })
  );

  useEffect(() => {
    // Simplified animations with reduced complexity and slower timings
    if (bgCircle1Ref.current && bgCircle2Ref.current) {
      gsap.to(bgCircle1Ref.current, {
        y: -20,
        x: 15,
        duration: 40,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        force3D: true,
      });

      gsap.to(bgCircle2Ref.current, {
        y: 25,
        x: -20,
        duration: 45,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
        force3D: true,
      });
    }

    // Single gradient rotation for better performance
    if (bgGradient1Ref.current) {
      gsap.to(bgGradient1Ref.current, {
        rotation: 360,
        duration: 300,
        repeat: -1,
        ease: "none",
        force3D: true,
      });
    }

    return () => {
      gsap.killTweensOf([
        bgCircle1Ref.current,
        bgCircle2Ref.current,
        bgGradient1Ref.current,
      ]);
    };
  }, []);

  return (
    <>
      <style>{animationStyles}</style>

      <Box
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 0,
          opacity: 0.5,
          pointerEvents: "none",
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          perspective: "1000px",
          WebkitPerspective: "1000px",
        }}
      >
        {/* Single gradient background */}
        <Box
          ref={bgGradient1Ref}
          className="bg-optimized"
          style={{
            position: "absolute",
            top: "-30%",
            left: "-10%",
            width: "120%",
            height: "120%",
            background:
              "radial-gradient(circle, rgba(67, 97, 238, 0.12) 0%, rgba(67, 97, 238, 0) 70%)",
            borderRadius: "50%",
            opacity: 0.4,
          }}
        />

        {/* Reduced to two animated circles */}
        <Box
          ref={bgCircle1Ref}
          className="bg-optimized"
          style={{
            position: "absolute",
            top: "20%",
            right: "15%",
            width: "250px",
            height: "250px",
            background:
              "radial-gradient(circle, rgba(74, 93, 253, 0.08) 0%, rgba(74, 93, 253, 0) 70%)",
            borderRadius: "50%",
            opacity: 0.5,
          }}
        />
        <Box
          ref={bgCircle2Ref}
          className="bg-optimized"
          style={{
            position: "absolute",
            bottom: "25%",
            left: "10%",
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(25, 113, 194, 0.08) 0%, rgba(25, 113, 194, 0) 70%)",
            borderRadius: "50%",
            opacity: 0.4,
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
            opacity: 0.6,
          }}
        >
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