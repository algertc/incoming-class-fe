import { useEffect } from "react";
import { Box, useMantineTheme } from "@mantine/core";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import all the components
import { HeroSection } from "../../components/Home/HeroSection/HeroSection";
import { StatisticsSection } from "../../components/Home/StatisticsSection/StatisticsSection";
import { FeaturedSection } from "../../components/Home/FeaturedSection/FeaturedSection";
import { HowItWorksSection } from "../../components/Home/HowItWorksSection/HowItWorksSection";
import { CollegesSection } from "../../components/Home/CollegesSection/CollegesSection";
import { CTASection } from "../../components/Home/CTASection/CTASection";
import { AnimatedBackground } from "../../components/Feed/AnimatedBackground/AnimatedBackground";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const HomePage: React.FC = () => {
  const theme = useMantineTheme();

  useEffect(() => {
    return () => {
      // Clean up animations when component unmounts
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Box style={{ backgroundColor: theme.colors.dark[9], minHeight: "100vh" }}>
      {/* Use the optimized AnimatedBackground component */}
      <AnimatedBackground />

      {/* Main content sections */}
      <HeroSection />
      <StatisticsSection />
      <HowItWorksSection />
      <FeaturedSection />
      <CollegesSection />
      <CTASection />
    </Box>
  );
};

export default HomePage; 