import React, { useRef, useEffect } from "react";
import {
  Container,
  Title,
  Text,
  Box,
  Stack,
  Paper,
  Group,
  ThemeIcon,
  useMantineTheme,
  Badge,
  SimpleGrid,
  Table,
  ScrollArea,
  Skeleton,
  Alert,
  ActionIcon,
  Tooltip,
  Button,
} from "@mantine/core";
import {
  IconCreditCard,
  IconCrown,
  IconCalendar,
  IconInfinity,
  IconCheck,
  IconX,
  IconRefresh,
  IconAlertCircle,
  IconReceipt,
} from "@tabler/icons-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AnimatedBackground from "../feed/components/AnimatedBackground";
import { useCurrentUser, useCurrentUserTransactions } from "../../hooks/api";
import { format } from "date-fns";
import { CancelSubscriptionCard, SubscriptionPlans } from "./components";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const SubscriptionPage: React.FC = () => {
  const theme = useMantineTheme();

  // Refs for animations
  const heroRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  // API hooks
  const {
    data: currentUserData,
    isLoading: isLoadingUser,
    refetch: refetchUser,
    error: userError,
  } = useCurrentUser();
  const {
    data: transactionsData,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useCurrentUserTransactions();

  // Check if user is authenticated
  const token = localStorage.getItem("token");

  const user = currentUserData?.data?.user;
  const rawTransactions = transactionsData?.data?.transactions || [];

  // Deduplicate transactions based on ID to prevent duplicates
  const transactions = React.useMemo(() => {
    const seen = new Set<string>();
    return rawTransactions.filter((transaction) => {
      if (seen.has(transaction.id)) {
        return false;
      }
      seen.add(transaction.id);
      return true;
    });
  }, [rawTransactions]);

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
          ease: "power2.out",
        }
      );
    }

    // Status section animation
    if (statusRef.current) {
      gsap.fromTo(
        statusRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: statusRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Table section animation
    if (tableRef.current) {
      gsap.fromTo(
        tableRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: tableRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  // Format amount from cents to dollars
  const formatAmount = (amountInCents: number) => {
    return `$${amountInCents.toFixed(2)}`;
  };

  // Get payment type display
  const getPaymentTypeDisplay = (type: string) => {
    return type === "subscription" ? "Premium Subscription" : "Post Unlock";
  };

  // Get status color
  const getStatusColor = (status: string) => {
    return status === "success" ? "green" : "red";
  };

  // Calculate subscription stats
  const subscriptionStats = {
    totalSpent: transactions
      .filter((t) => t.status === "success")
      .reduce((sum, t) => sum + t.amount, 0),
    successfulPayments: transactions.filter((t) => t.status === "success")
      .length,
    failedPayments: transactions.filter((t) => t.status === "failed").length,
    lastPayment: transactions
      .filter((t) => t.status === "success")
      .sort(
        (a, b) =>
          new Date(b.transactionDate).getTime() -
          new Date(a.transactionDate).getTime()
      )[0],
  };

  return (
    <Box style={{ backgroundColor: theme.colors.dark[9], minHeight: "100vh" }}>
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Hero Section */}
      <Box
        style={{
          background: `linear-gradient(135deg, #000000 0%, #1a0030 100%)`,
          padding: "80px 0 60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorations */}
        <Box
          style={{
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(67, 97, 238, 0.08) 0%, rgba(67, 97, 238, 0) 70%)",
            filter: "blur(25px)",
            zIndex: 0,
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: "30%",
            right: "15%",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at center, rgba(229, 56, 59, 0.06) 0%, rgba(229, 56, 59, 0) 70%)",
            filter: "blur(20px)",
            zIndex: 0,
          }}
        />

        <Container size="lg" style={{ position: "relative", zIndex: 1 }}>
          <Stack align="center" gap="lg" ref={heroRef}>
            <Title
              order={1}
              ta="center"
              style={{
                fontSize: "2.5rem",
                lineHeight: 1.2,
                fontWeight: 500,
                maxWidth: 600,
              }}
              c={theme.white}
            >
              Your Subscription
            </Title>
            <Text c="dimmed" ta="center" size="lg" maw={600}>
              {user?.isSubscribed
                ? "Manage your Premium Watch+ subscription and view your transaction history"
                : user?.isStarterSubscribed
                ? "Manage your Starter Pack subscription and view your transaction history"
                : "Choose a subscription plan to unlock premium features"}
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Subscription Plans Section */}
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <SubscriptionPlans isSubscribed={user?.isSubscribed || false} />

          {/* Show cancel subscription card if user has any active subscription */}
          {(user?.isSubscribed || user?.isStarterSubscribed) && (
            <CancelSubscriptionCard onSubscriptionCanceled={refetchUser} />
          )}
        </Stack>
      </Container>

      {/* Current Subscription Status */}
      <Box py={60} style={{ backgroundColor: theme.colors.dark[9] }}>
        <Container size="lg">
          <Stack gap="xl">
            {/* Authentication Error */}
            {!token && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="orange"
                variant="light"
                title="Authentication Required"
              >
                <Text size="sm">
                  Please log in to view your subscription information.
                </Text>
              </Alert>
            )}

            {/* API Error State */}
            {token && userError && (
              <Alert
                icon={<IconAlertCircle size={16} />}
                color="red"
                variant="light"
                title="Failed to load user data"
              >
                <Text size="sm">
                  {(userError as Error).message ||
                    "Unable to load your subscription information. Please try refreshing the page."}
                </Text>
                <Button
                  variant="light"
                  color="red"
                  size="sm"
                  mt="sm"
                  onClick={() => refetchUser()}
                >
                  Retry
                </Button>
              </Alert>
            )}

            {/* Premium Status Card */}
            <Paper
              ref={statusRef}
              p="xl"
              radius="lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(67, 97, 238, 0.05) 0%, rgba(58, 12, 163, 0.05) 100%)",
                border: "1px solid rgba(67, 97, 238, 0.15)",
                backdropFilter: "blur(10px)",
              }}
            >
              {isLoadingUser ? (
                <Stack gap="lg">
                  <Skeleton height={40} width={300} />
                  <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
                    <Skeleton height={60} />
                    <Skeleton height={60} />
                    <Skeleton height={60} />
                    <Skeleton height={60} />
                  </SimpleGrid>
                </Stack>
              ) : !user ? (
                <Alert
                  icon={<IconAlertCircle size={16} />}
                  color="gray"
                  variant="light"
                  title="No user data available"
                >
                  <Text size="sm">
                    Unable to load user information. Please try refreshing the
                    page.
                  </Text>
                  <Button
                    variant="light"
                    color="gray"
                    size="sm"
                    mt="sm"
                    onClick={() => refetchUser()}
                  >
                    Refresh
                  </Button>
                </Alert>
              ) : (
                <Stack gap="lg">
                  <Group align="center">
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                    >
                      <IconCreditCard size={20} />
                    </ThemeIcon>
                    <Title order={2} c={theme.white}>
                      Premium Status
                    </Title>
                    <Badge
                      color={
                        user?.isSubscribed || user?.isStarterSubscribed
                          ? "green"
                          : "gray"
                      }
                      variant="filled"
                      size="lg"
                      leftSection={
                        user?.isSubscribed || user?.isStarterSubscribed ? (
                          <IconCrown size={14} />
                        ) : undefined
                      }
                    >
                      {user?.isSubscribed
                        ? "Premium Watch+ Active"
                        : user?.isStarterSubscribed
                        ? "Starter Pack Active"
                        : "No Active Subscription"}
                    </Badge>
                  </Group>

                  <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="lg">
                    <Box>
                      <Text size="sm" c="gray.5" mb="xs">
                        Plan Status
                      </Text>
                      <Group align="center" gap="xs">
                        {user?.isSubscribed ? (
                          <>
                            <IconCheck size={16} color="green" />
                            <Text fw={600} c="green" size="lg">
                              Premium Active
                            </Text>
                          </>
                        ) : user?.isStarterSubscribed ? (
                          <>
                            <IconCheck size={16} color="blue" />
                            <Text fw={600} c="blue" size="lg">
                              Starter Active
                            </Text>
                          </>
                        ) : (
                          <>
                            <IconX size={16} color="gray" />
                            <Text fw={600} c="gray" size="lg">
                              No Subscription
                            </Text>
                          </>
                        )}
                      </Group>
                    </Box>

                    <Box>
                      <Text size="sm" c="gray.5" mb="xs">
                        Successful Payments
                      </Text>
                      <Text fw={600} c="green" size="lg">
                        {subscriptionStats.successfulPayments}
                      </Text>
                    </Box>

                    <Box>
                      <Text size="sm" c="gray.5" mb="xs">
                        Posts Access
                      </Text>
                      <Text fw={600} c={theme.white} size="lg">
                        {user?.isSubscribed ? (
                          <Group align="center" gap="xs">
                            <IconInfinity size={16} />
                            <Text>Unlimited</Text>
                          </Group>
                        ) : (
                          "Limited"
                        )}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {subscriptionStats.lastPayment && (
                    <Alert
                      icon={<IconCalendar size={16} />}
                      color="blue"
                      variant="light"
                    >
                      <Text size="sm" c={"white"}>
                        Last successful payment:{" "}
                        {formatAmount(subscriptionStats.lastPayment.amount)} on{" "}
                        {format(
                          new Date(
                            subscriptionStats.lastPayment.transactionDate
                          ),
                          "MMM dd, yyyy"
                        )}
                      </Text>
                    </Alert>
                  )}
                </Stack>
              )}
            </Paper>

            {/* Payment History Table */}
            <Paper
              ref={tableRef}
              p="xl"
              radius="lg"
              style={{
                background:
                  "linear-gradient(135deg, rgba(67, 97, 238, 0.05) 0%, rgba(58, 12, 163, 0.05) 100%)",
                border: "1px solid rgba(67, 97, 238, 0.15)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Stack gap="lg">
                <Group align="center" justify="space-between">
                  <Group align="center">
                    <ThemeIcon
                      size="lg"
                      radius="md"
                      variant="gradient"
                      gradient={{ from: "#4361ee", to: "#3a0ca3" }}
                    >
                      <IconReceipt size={20} />
                    </ThemeIcon>
                    <Title order={2} c={theme.white}>
                      Payment History
                    </Title>
                  </Group>
                  <Tooltip label="Refresh transactions">
                    <ActionIcon
                      variant="light"
                      color="blue"
                      onClick={() => refetchTransactions()}
                      loading={isLoadingTransactions}
                    >
                      <IconRefresh size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>

                {isLoadingTransactions ? (
                  <Stack gap="md">
                    <Skeleton height={40} />
                    <Skeleton height={40} />
                    <Skeleton height={40} />
                  </Stack>
                ) : transactions.length === 0 ? (
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="white"
                    variant="light"
                  >
                    <Text c={"white"} size="sm">
                      No payment history found.
                    </Text>
                  </Alert>
                ) : (
                  <ScrollArea>
                    <Table
                      style={{
                        backgroundColor: "transparent",
                      }}
                    >
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th style={{ color: theme.colors.gray[4] }}>
                            Date
                          </Table.Th>
                          <Table.Th style={{ color: theme.colors.gray[4] }}>
                            College
                          </Table.Th>
                          <Table.Th style={{ color: theme.colors.gray[4] }}>
                            Type
                          </Table.Th>
                          <Table.Th style={{ color: theme.colors.gray[4] }}>
                            Amount
                          </Table.Th>
                          <Table.Th style={{ color: theme.colors.gray[4] }}>
                            Status
                          </Table.Th>
                        </Table.Tr>
                      </Table.Thead>
                      <Table.Tbody>
                        {transactions
                          .sort(
                            (a, b) =>
                              new Date(b.transactionDate).getTime() -
                              new Date(a.transactionDate).getTime()
                          )
                          .map((transaction) => (
                            <Table.Tr key={transaction.id}>
                              <Table.Td style={{ color: theme.colors.gray[3] }}>
                                {format(
                                  new Date(transaction.transactionDate),
                                  "MMM dd, yyyy"
                                )}
                              </Table.Td>
                              <Table.Td style={{ color: theme.colors.gray[3] }}>
                                {transaction.college.name}
                              </Table.Td>
                              <Table.Td style={{ color: theme.colors.gray[3] }}>
                                {getPaymentTypeDisplay(transaction.paymentType)}
                              </Table.Td>
                              <Table.Td style={{ color: theme.colors.gray[3] }}>
                                {formatAmount(transaction.amount)}
                              </Table.Td>
                              <Table.Td>
                                <Badge
                                  color={getStatusColor(transaction.status)}
                                  variant="filled"
                                  size="sm"
                                  leftSection={
                                    transaction.status === "success" ? (
                                      <IconCheck size={12} />
                                    ) : (
                                      <IconX size={12} />
                                    )
                                  }
                                >
                                  {transaction.status === "success"
                                    ? "Success"
                                    : "Failed"}
                                </Badge>
                              </Table.Td>
                            </Table.Tr>
                          ))}
                      </Table.Tbody>
                    </Table>
                  </ScrollArea>
                )}
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default SubscriptionPage;
