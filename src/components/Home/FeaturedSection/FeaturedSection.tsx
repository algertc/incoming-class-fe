import React, { useEffect, useRef } from "react";
import {
  Container,
  Grid,
  Title,
  Text,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { FeatureCard } from "../FeatureCard/FeatureCard";
import { TestimonialCard } from "../TestimonialCard/TestimonialCard";
import gsap from "gsap";

// Mock data
const features = [
  {
    icon: "🚀",
    title: "Personalized Matching",
    description:
      "Our AI algorithms match you with like-minded roommates based on your lifestyle, habits, and preferences.",
  },
  {
    icon: "💬",
    title: "Secure Messaging",
    description:
      "Connect with potential roommates through our secure in-app messaging system before making decisions.",
  },
];

const testimonials = [
  {
    content:
      "Finding a compatible roommate was always a challenge until I used this platform. The matching algorithm is surprisingly accurate!",
    author: "Sarah Johnson",
    title: "Stanford University",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    content:
      "As an international student, I was worried about housing. This platform made it so easy to find both a great apartment and amazing roommates.",
    author: "Miguel Alvarez",
    title: "MIT",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    content:
      "The roommate agreement feature helped us set clear boundaries from day one. We've been living together happily for over a year now!",
    author: "Aisha Patel",
    title: "UC Berkeley",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
];

export const FeaturedSection: React.FC = () => {
  const theme = useMantineTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Animate the section title when it enters viewport
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <div
      ref={sectionRef}
      style={{ padding: "80px 0", backgroundColor: theme.colors.dark[9] }}
    >
      <Container size="lg">
        <Stack gap="xl" mb={60}>
          <Title
            ref={titleRef}
            order={2}
            ta="center"
            c={theme.white}
            style={{ fontSize: "2.5rem" }}
          >
            Features & Testimonials
          </Title>
          <Text
            ta="center"
            c={theme.colors.dark[2]}
            size="lg"
            maw={700}
            mx="auto"
          >
            Discover why thousands of students trust our platform to find their
            perfect living situation.
          </Text>
        </Stack>

        {/* Features section */}
        <Title order={3} mb="lg" c={theme.white}>
          Our Features
        </Title>
        <Grid gutter={30} mb={60}>
          {features.map((feature, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 6 }}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Grid.Col>
          ))}
        </Grid>

        {/* Testimonials section */}
        <Title order={3} mb="lg" c={theme.white}>
          What Students Say
        </Title>
        <Grid gutter="xl">
          {testimonials.map((testimonial, index) => (
            <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <TestimonialCard
                content={testimonial.content}
                author={testimonial.author}
                title={testimonial.title}
                avatar={testimonial.avatar}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default FeaturedSection;
