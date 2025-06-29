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
import { useFeaturedTestimonials } from "../../../hooks/api/useTestimonials";
import gsap from "gsap";

// Mock data
const features = [
  {
    icon: "🚀",
    title: "Fast Posting",
    description:
      "Quickly create and share your post to start connecting with potential roommates at your university.",
  },
  {
    icon: "🤖",
    title: "AI Matching",
    description:
      "Our smart algorithms suggest the most compatible matches based on your preferences and interests.",
  },
  {
    icon: "🧩",
    title: "Customizable Profile",
    description:
      "Show off your personality with a flexible profile tailored to your lifestyle, habits, and roommate expectations.",
  },
];

export const FeaturedSection: React.FC = () => {
  const theme = useMantineTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { data: testimonialResponse, isLoading: testimonialsLoading } = useFeaturedTestimonials();

  console.log("log testimonialResponse", testimonialResponse);
  

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

  const testimonials = testimonialResponse?.data .testimonials|| [];

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
            Features
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
          {/* <Title order={3} mb="lg" c={theme.white}>
            Our Features
          </Title> */}
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
        {!testimonialsLoading && testimonials.length > 0 && (
          <>
            <Title order={3} mb="lg" c={theme.white}>
              What Students Say
            </Title>
            <Grid gutter="xl">
              {testimonials.slice(0, 3).map((testimonial) => (
                <Grid.Col key={testimonial.id} span={{ base: 12, sm: 6, md: 4 }}>
                  <TestimonialCard
                    content={testimonial.message}
                    author={testimonial.name}
                    avatar={testimonial.profileImage}
                  />
                </Grid.Col>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
};

export default FeaturedSection;
