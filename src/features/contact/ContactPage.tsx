import React, { useRef, useEffect, useState } from 'react';
import {
  Container,
  Title,
  Text,
  Box,
  Stack,
  Grid,
  Paper,
  Group,
  ThemeIcon,
  useMantineTheme,
  Badge,
  TextInput,
  Textarea,
  Button,
  Select,
} from '@mantine/core';
import { 
  IconMail, 
  IconPhone, 
  IconMapPin,
  IconSend,
  IconCheck,
  IconQuestionMark,
  IconHeadphones,
  IconMessageCircle
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from '../feed/components/AnimatedBackground';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Contact methods data
const contactMethods = [
  {
    icon: IconMail,
    title: "Email Support",
    description: "Get help via email within 24 hours",
    value: "support@incomingclass.com",
    action: "mailto:support@incomingclass.com"
  },
  {
    icon: IconPhone,
    title: "Phone Support",
    description: "Speak with our team directly",
    value: "+1 (555) 123-4567",
    action: "tel:+15551234567"
  },
  {
    icon: IconMessageCircle,
    title: "Live Chat",
    description: "Chat with us in real-time",
    value: "Available 9 AM - 6 PM EST",
    action: "#"
  },
  {
    icon: IconHeadphones,
    title: "Support Center",
    description: "Browse our knowledge base",
    value: "Visit Help Center",
    action: "/help"
  }
];

// Support categories
const supportCategories = [
  "General Inquiry",
  "Account Issues", 
  "Profile Setup",
  "Payment & Billing",
  "Technical Support",
  "Partnership/Business",
  "Bug Report",
  "Feature Request"
];

// Office locations
const offices = [
  {
    city: "San Francisco",
    address: "123 Tech Street, Suite 100\nSan Francisco, CA 94105",
    hours: "Monday - Friday\n9:00 AM - 6:00 PM PST"
  },
  {
    city: "New York",
    address: "456 Innovation Ave, Floor 15\nNew York, NY 10001", 
    hours: "Monday - Friday\n9:00 AM - 6:00 PM EST"
  }
];

// FAQ data
const faqs = [
  {
    question: "How do I complete my profile?",
    answer: "After signing up, you'll be guided through a step-by-step profile completion process. Upload photos, add your bio, and connect with classmates!"
  },
  {
    question: "Is my data secure?",
    answer: "Yes! We use industry-standard encryption and security measures to protect your personal information. Your privacy is our top priority."
  },
  {
    question: "How do I find students from my college?",
    answer: "Use our college search feature to find and connect with students from your specific university. You can filter by graduation year, major, and interests."
  },
  {
    question: "What if I need to cancel my account?",
    answer: "You can delete your account anytime from your profile settings. All your data will be permanently removed from our servers."
  }
];

const ContactPage: React.FC = () => {
  const theme = useMantineTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const contactMethodsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const officesRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  // Form handling
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      category: '',
      subject: '',
      message: ''
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      category: (value) => (value ? null : 'Please select a category'),
      subject: (value) => (value.length < 5 ? 'Subject must have at least 5 characters' : null),
      message: (value) => (value.length < 10 ? 'Message must have at least 10 characters' : null),
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    notifications.show({
      title: 'Message Sent!',
      message: 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
      color: 'green',
      icon: <IconCheck size={16} />,
      autoClose: 5000,
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  useEffect(() => {
    // Hero section animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out"
        }
      );
    }

    // Contact methods animation
    if (contactMethodsRef.current) {
      gsap.fromTo(
        contactMethodsRef.current.querySelectorAll('.contact-method'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: contactMethodsRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Form animation
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: formRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // Offices animation
    if (officesRef.current) {
      gsap.fromTo(
        officesRef.current.querySelectorAll('.office-card'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: officesRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }

    // FAQ animation
    if (faqRef.current) {
      gsap.fromTo(
        faqRef.current.querySelectorAll('.faq-item'),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: faqRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <Box style={{ backgroundColor: theme.colors.dark[9], minHeight: "100vh" }}>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Hero Section */}
      <Box
        style={{
          background: `linear-gradient(135deg, #000000 0%, #1a0030 100%)`,
          padding: "120px 0 80px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background decorations */}
        <Box
          style={{
            position: "absolute",
            top: "15%",
            left: "8%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(67, 97, 238, 0.12) 0%, rgba(67, 97, 238, 0) 70%)",
            filter: "blur(35px)",
            zIndex: 0
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "25%",
            right: "12%",
            width: 140,
            height: 140,
            borderRadius: "50%",
            background: "radial-gradient(circle at center, rgba(229, 56, 59, 0.1) 0%, rgba(229, 56, 59, 0) 70%)",
            filter: "blur(25px)",
            zIndex: 0
          }}
        />

        <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
          <Stack align="center" gap="xl" ref={heroRef}>
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: "#4361ee", to: "#3a0ca3" }}
              style={{ fontWeight: 600 }}
            >
              GET IN TOUCH
            </Badge>
            
            <Title
              order={1}
              ta="center"
              style={{
                fontSize: "3.5rem",
                lineHeight: 1.1,
                fontWeight: 500,
                maxWidth: 800
              }}
            >
              <Text inherit component="span" c={theme.white}>
                We're here to{" "}
              </Text>
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: "#4361ee", to: "#3a0ca3", deg: 45 }}
              >
                help you succeed
              </Text>
            </Title>

            <Text
              size="xl"
              c="gray.3"
              ta="center"
              style={{ maxWidth: 700, lineHeight: 1.6 }}
            >
              Have questions about IncomingClass? Need support with your profile? 
              We'd love to hear from you and help you make the most of your college journey.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Contact Methods Section */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="xl">
          <Stack gap="xl" ref={contactMethodsRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                How Can We Help?
              </Title>
              <Text size="lg" c="gray.3" maw={600} mx="auto">
                Choose the best way to reach us based on your needs
              </Text>
            </Box>

            <Grid>
              {contactMethods.map((method, index) => (
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }} key={index}>
                  <Paper
                    className="contact-method"
                    component="a"
                    href={method.action}
                    p="xl"
                    radius="lg"
                    h="100%"
                    ta="center"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      transition: "all 0.3s ease",
                      textDecoration: "none",
                      cursor: "pointer",
                      display: "block"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)";
                      e.currentTarget.style.borderColor = theme.colors.blue[5];
                      e.currentTarget.style.boxShadow = "0 20px 40px rgba(67, 97, 238, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Stack gap="md" align="center">
                      <ThemeIcon
                        size={60}
                        radius="50%"
                        variant="gradient"
                        gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                      >
                        <method.icon size={28} />
                      </ThemeIcon>
                      <Title order={4} c={theme.white}>
                        {method.title}
                      </Title>
                      <Text c="gray.4" size="sm" ta="center">
                        {method.description}
                      </Text>
                      <Text c="blue.4" fw={600} size="sm">
                        {method.value}
                      </Text>
                    </Stack>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Contact Form Section */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[8] }}>
        <Container size="md">
          <Stack gap="xl" ref={formRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                Send Us a Message
              </Title>
              <Text size="lg" c="gray.3" maw={500} mx="auto">
                Fill out the form below and we'll get back to you as soon as possible
              </Text>
            </Box>

            <Paper
              p="xl"
              radius="lg"
              style={{
                background: "linear-gradient(135deg, rgba(67, 97, 238, 0.08) 0%, rgba(58, 12, 163, 0.08) 100%)",
                border: "1px solid rgba(67, 97, 238, 0.2)",
                backdropFilter: "blur(10px)"
              }}
            >
              <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="lg">
                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Full Name"
                        placeholder="Enter your name"
                        {...form.getInputProps('name')}
                        styles={{
                          label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                          input: {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: theme.white,
                            '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
                            '&:focus': { borderColor: theme.colors.blue[5] }
                          }
                        }}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Email Address"
                        placeholder="Enter your email"
                        type="email"
                        {...form.getInputProps('email')}
                        styles={{
                          label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                          input: {
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 255, 255, 0.2)",
                            color: theme.white,
                            '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
                            '&:focus': { borderColor: theme.colors.blue[5] }
                          }
                        }}
                      />
                    </Grid.Col>
                  </Grid>

                  <Select
                    label="Category"
                    placeholder="Select a category"
                    data={supportCategories}
                    {...form.getInputProps('category')}
                    styles={{
                      label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                      input: {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: theme.white,
                        '&:focus': { borderColor: theme.colors.blue[5] }
                      },
                      dropdown: {
                        backgroundColor: theme.colors.dark[8],
                        border: `1px solid ${theme.colors.dark[6]}`
                      },
                      option: {
                        color: theme.white,
                        '&[data-hovered]': { backgroundColor: theme.colors.dark[7] }
                      }
                    }}
                  />

                  <TextInput
                    label="Subject"
                    placeholder="Brief description of your inquiry"
                    {...form.getInputProps('subject')}
                    styles={{
                      label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                      input: {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: theme.white,
                        '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
                        '&:focus': { borderColor: theme.colors.blue[5] }
                      }
                    }}
                  />

                  <Textarea
                    label="Message"
                    placeholder="Tell us more about your question or issue..."
                    rows={6}
                    {...form.getInputProps('message')}
                    styles={{
                      label: { color: theme.white, fontWeight: 600, marginBottom: 8 },
                      input: {
                        backgroundColor: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        color: theme.white,
                        '&::placeholder': { color: 'rgba(255, 255, 255, 0.5)' },
                        '&:focus': { borderColor: theme.colors.blue[5] }
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    leftSection={<IconSend size={18} />}
                    loading={isSubmitting}
                    style={{
                      background: "linear-gradient(45deg, #4361ee, #3a0ca3)",
                      transition: "all 0.3s ease"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 10px 20px rgba(67, 97, 238, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Stack>
        </Container>
      </Box>

      {/* Office Locations Section */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="xl">
          <Stack gap="xl" ref={officesRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                Our Offices
              </Title>
              <Text size="lg" c="gray.3" maw={500} mx="auto">
                Visit us at our locations or reach out remotely
              </Text>
            </Box>

            <Grid>
              {offices.map((office, index) => (
                <Grid.Col span={{ base: 12, sm: 6 }} key={index}>
                  <Paper
                    className="office-card"
                    p="xl"
                    radius="lg"
                    h="100%"
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)"
                    }}
                  >
                    <Stack gap="lg">
                      <Group>
                        <ThemeIcon size="lg" radius="md" color="blue">
                          <IconMapPin size={20} />
                        </ThemeIcon>
                        <Title order={3} c={theme.white}>
                          {office.city}
                        </Title>
                      </Group>
                      
                      <Stack gap="md">
                        <Box>
                          <Text c="gray.4" size="sm" fw={600} mb="xs">
                            ADDRESS
                          </Text>
                          <Text c="gray.2" style={{ whiteSpace: 'pre-line' }}>
                            {office.address}
                          </Text>
                        </Box>
                        
                        <Box>
                          <Text c="gray.4" size="sm" fw={600} mb="xs">
                            HOURS
                          </Text>
                          <Text c="gray.2" style={{ whiteSpace: 'pre-line' }}>
                            {office.hours}
                          </Text>
                        </Box>
                      </Stack>
                    </Stack>
                  </Paper>
                </Grid.Col>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box py={80} style={{ backgroundColor: theme.colors.dark[8] }}>
        <Container size="md">
          <Stack gap="xl" ref={faqRef}>
            <Box ta="center" mb={40}>
              <Title
                order={2}
                c={theme.white}
                mb="md"
                style={{ fontSize: "2.5rem" }}
              >
                Frequently Asked Questions
              </Title>
              <Text size="lg" c="gray.3" maw={500} mx="auto">
                Quick answers to common questions
              </Text>
            </Box>

            <Stack gap="lg">
              {faqs.map((faq, index) => (
                <Paper
                  key={index}
                  className="faq-item"
                  p="lg"
                  radius="md"
                  style={{
                    backgroundColor: theme.colors.dark[9],
                    border: `1px solid ${theme.colors.dark[7]}`,
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.blue[5];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.colors.dark[7];
                  }}
                >
                  <Group align="flex-start" gap="md">
                    <ThemeIcon size="md" radius="md" color="blue" mt={4}>
                      <IconQuestionMark size={16} />
                    </ThemeIcon>
                    <Stack gap="sm" style={{ flex: 1 }}>
                      <Title order={4} c={theme.white}>
                        {faq.question}
                      </Title>
                      <Text c="gray.3" size="sm" style={{ lineHeight: 1.6 }}>
                        {faq.answer}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              ))}
            </Stack>

            <Box ta="center" mt="xl">
              <Text c="gray.4" mb="md">
                Still have questions?
              </Text>
              <Button
                component="a"
                href="mailto:support@incomingclass.com"
                variant="outline"
                color="blue"
                radius="md"
                leftSection={<IconMail size={16} />}
              >
                Contact Support
              </Button>
            </Box>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default ContactPage; 