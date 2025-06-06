import React, { useState } from "react";
import {
  Group,
  Button,
  Stack,
  Text,
  useMantineTheme,
  Paper,
  Divider,
  Box,
  List,
  ThemeIcon,
  Card,
  SimpleGrid,
  LoadingOverlay,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import {
  IconCheck,
  IconFilter,
  IconEye,
  IconHeartHandshake,
  IconLock,
  IconStar,
  IconSparkles,
  IconShield,
  IconUserCheck,
  IconGift,
  IconRocket,
} from "@tabler/icons-react";
import { useUpdateCurrentUserProfile } from "../../../hooks/api";
import { showSuccess, showError } from "../../../utils";

interface PaymentProps {
  onComplete: () => void;
}

// Platform features data
const PLATFORM_FEATURES = [
  {
    title: "Advanced Matching Filters",
    description: "Filter by major, interests, location, and more",
    icon: IconFilter,
    color: "blue",
  },
  {
    title: "Unlimited Profile Views",
    description: "Browse through all profiles without restrictions",
    icon: IconEye,
    color: "cyan",
  },
  {
    title: "Smart Matching Algorithm",
    description: "Get matched with the most compatible classmates",
    icon: IconHeartHandshake,
    color: "indigo",
  },
  {
    title: "Profile Flexibility",
    description: "Edit and update your profile whenever you need",
    icon: IconLock,
    color: "violet",
  },
  {
    title: "Priority Support",
    description: "Get dedicated customer support when you need help",
    icon: IconShield,
    color: "green",
  },
  {
    title: "Verified Profile Badge",
    description: "Stand out with your verified student status",
    icon: IconUserCheck,
    color: "yellow",
  },
];

const PRICING = {
  monthlyPrice: 9.99,
  tax: 0.00,
};

const Payment: React.FC<PaymentProps> = ({ onComplete }) => {
  const theme = useMantineTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateCurrentUserProfile();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const total = PRICING.monthlyPrice + PRICING.tax;

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      // TODO: Integrate with payment processor
      
      // Update profile to mark as complete
      const profileResponse = await updateProfile({
        isProfileCompleted: true,
      });

      if (!profileResponse.status) {
        throw new Error(profileResponse.message || 'Failed to complete profile setup');
      }
      
      showSuccess("Profile setup completed successfully! Welcome to the platform!");
      onComplete(); // Move to next step in the UI
    } catch (error) {
      showError((error as Error).message || 'Failed to complete profile setup');
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = isProcessing || isUpdatingProfile;

  return (
    <Paper 
      p={isMobile ? "sm" : "xl"} 
      radius="md"
      style={{
        background: "rgba(255, 255, 255, 0.05)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative",
        ...(isMobile && {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        })
      }}
    >
      <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
      
      <Stack gap={isMobile ? "md" : "xl"} style={isMobile ? { flex: 1 } : {}}>
        {/* Header */}
        <Box ta="center">
          <Group justify="center" mb={isMobile ? "xs" : "sm"}>
            <ThemeIcon
              size={isMobile ? "lg" : "xl"}
              radius="md"
              variant="gradient"
              gradient={{ from: "blue", to: "cyan" }}
            >
              <IconRocket size={isMobile ? 20 : 24} />
            </ThemeIcon>
          </Group>
          <Text
            size={isMobile ? "lg" : "xl"}
            fw={700}
            style={{ color: theme.white }}
            mb="xs"
          >
            Complete Your Profile
          </Text>
          <Text
            size={isMobile ? "xs" : "sm"}
            style={{ color: theme.colors.gray[4] }}
          >
            Unlock all platform features and start connecting with classmates
          </Text>
        </Box>

        <SimpleGrid cols={{ base: 1, md: isMobile ? 1 : 2 }} spacing={isMobile ? "md" : "xl"}>
          {/* Platform Features Section */}
          <Paper
            p={isMobile ? "md" : "xl"}
            radius="lg"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Group mb={isMobile ? "sm" : "lg"}>
              <ThemeIcon
                size={isMobile ? "sm" : "md"}
                radius="md"
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
              >
                <IconSparkles size={isMobile ? 16 : 18} />
              </ThemeIcon>
              <Text fw={600} style={{ color: theme.white }} size={isMobile ? "sm" : "md"}>
                What You Get
              </Text>
            </Group>

            <Stack gap={isMobile ? "sm" : "md"}>
              {PLATFORM_FEATURES.map((feature, index) => (
                <Card
                  key={index}
                  p={isMobile ? "sm" : "md"}
                  radius="md"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                  }}
                >
                  <Group gap="sm" mb={isMobile ? "4px" : "xs"}>
                    <ThemeIcon
                      size={isMobile ? "xs" : "sm"}
                      radius="xl"
                      variant="light"
                      color={feature.color}
                    >
                      <feature.icon size={isMobile ? 12 : 14} />
                    </ThemeIcon>
                    <Text size={isMobile ? "xs" : "sm"} fw={500} style={{ color: theme.white }}>
                      {feature.title}
                    </Text>
                  </Group>
                  <Text size={isMobile ? "10px" : "xs"} style={{ color: theme.colors.gray[5] }}>
                    {feature.description}
                  </Text>
                </Card>
              ))}
            </Stack>

            {/* What's Included Summary */}
            <Box
              p={isMobile ? "sm" : "md"}
              mt={isMobile ? "sm" : "lg"}
              style={{
                background: "rgba(74, 93, 253, 0.1)",
                borderRadius: theme.radius.md,
                border: "1px solid rgba(74, 93, 253, 0.2)",
              }}
            >
              <Text size={isMobile ? "xs" : "sm"} fw={500} style={{ color: theme.white }} mb={isMobile ? "xs" : "sm"}>
                Platform Access Includes
              </Text>
              <List
                spacing={isMobile ? "4px" : "xs"}
                size={isMobile ? "xs" : "sm"}
                center
                styles={{
                  itemWrapper: { color: theme.white },
                }}
                icon={
                  <ThemeIcon color="blue" size={isMobile ? "xs" : "xs"} radius="xl">
                    <IconCheck size={isMobile ? 8 : 10} />
                  </ThemeIcon>
                }
              >
                <List.Item>Advanced matching algorithms</List.Item>
                <List.Item>Unlimited profile browsing</List.Item>
                <List.Item>Smart filters and search</List.Item>
                <List.Item>Priority customer support</List.Item>
                <List.Item>Verified student badge</List.Item>
              </List>
            </Box>
          </Paper>

          {/* Billing Summary Section */}
          <Paper
            p={isMobile ? "md" : "xl"}
            radius="lg"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
            }}
          >
            <Group mb={isMobile ? "sm" : "lg"}>
              <ThemeIcon
                size={isMobile ? "sm" : "md"}
                radius="md"
                variant="gradient"
                gradient={{ from: "green", to: "teal" }}
              >
                <IconStar size={isMobile ? 16 : 18} />
              </ThemeIcon>
              <Text fw={600} style={{ color: theme.white }} size={isMobile ? "sm" : "md"}>
                Billing Summary
              </Text>
            </Group>

            {/* Subscription Plan */}
            <Card
              p={isMobile ? "md" : "lg"}
              radius="md"
              mb={isMobile ? "md" : "xl"}
              style={{
                background: "rgba(74, 93, 253, 0.2)",
                border: "1px solid rgba(74, 93, 253, 0.4)",
              }}
            >
              <Group justify="space-between" align="center">
                <Box>
                  <Text fw={600} size={isMobile ? "md" : "lg"} style={{ color: theme.white }}>
                    Monthly Access
                  </Text>
                  <Text size={isMobile ? "xs" : "sm"} style={{ color: theme.colors.gray[4] }}>
                    Full platform access, billed monthly
                  </Text>
                </Box>
                <Text fw={700} size={isMobile ? "lg" : "xl"} style={{ color: theme.white }}>
                  ${PRICING.monthlyPrice}/mo
                </Text>
              </Group>
            </Card>

            {/* Order Summary */}
            <Box
              p={isMobile ? "md" : "lg"}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: theme.radius.md,
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <Text fw={600} style={{ color: theme.white }} mb={isMobile ? "sm" : "md"} size={isMobile ? "sm" : "md"}>
                Order Summary
              </Text>

              <Stack gap={isMobile ? "xs" : "sm"}>
                <Group justify="space-between">
                  <Text style={{ color: theme.white }} size={isMobile ? "xs" : "sm"}>
                    Monthly Access Plan
                  </Text>
                  <Text fw={500} style={{ color: theme.white }} size={isMobile ? "xs" : "sm"}>
                    ${PRICING.monthlyPrice.toFixed(2)}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text style={{ color: theme.colors.gray[5] }} size={isMobile ? "xs" : "sm"}>
                    Tax
                  </Text>
                  <Text style={{ color: theme.colors.gray[5] }} size={isMobile ? "xs" : "sm"}>
                    ${PRICING.tax.toFixed(2)}
                  </Text>
                </Group>

                <Divider style={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />

                <Group justify="space-between">
                  <Text fw={600} size={isMobile ? "md" : "lg"} style={{ color: theme.white }}>
                    Total
                  </Text>
                  <Text fw={600} size={isMobile ? "md" : "lg"} style={{ color: theme.white }}>
                    ${total.toFixed(2)}
                  </Text>
                </Group>
              </Stack>
            </Box>

            {/* Payment Button */}
            <Button
              size={isMobile ? "md" : "lg"}
              fullWidth
              mt={isMobile ? "md" : "xl"}
              loading={isLoading}
              onClick={handleComplete}
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              leftSection={<IconGift size={isMobile ? 16 : 18} />}
            >
              {isLoading ? "Processing..." : "Complete Profile Setup"}
            </Button>

            {/* Money-back guarantee */}
            <Text
              size={isMobile ? "10px" : "xs"}
              ta="center"
              mt="sm"
              style={{ color: theme.colors.gray[5] }}
            >
              30-day money-back guarantee • Cancel anytime
            </Text>
          </Paper>
        </SimpleGrid>
      </Stack>
    </Paper>
  );
};

export default Payment;
