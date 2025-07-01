import React, { Component } from "react";
import type { ReactNode } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Box,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import {
  IconBug,
  IconRefresh,
  IconHome,
  IconAlertTriangle,
} from "@tabler/icons-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #000000 0%, #2d1b2e 50%, #000000 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <Container size="md">
            <Paper
              p="3rem"
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
              }}
            >
              <Stack gap="xl" align="center">
                <ThemeIcon
                  size={100}
                  radius="50%"
                  variant="gradient"
                  gradient={{ from: "red", to: "pink" }}
                >
                  <IconBug size={50} />
                </ThemeIcon>

                <Stack gap="md" align="center">
                  <Title
                    order={1}
                    size="h1"
                    style={{ color: "white" }}
                  >
                    Oops! Something went wrong
                  </Title>
                  <Text
                    size="lg"
                    style={{ color: "#c1c2c5" }}
                    maw={600}
                    ta="center"
                  >
                    We encountered an unexpected error. Please try refreshing the page or go back to the homepage.
                  </Text>
                </Stack>

                <Alert
                  icon={<IconAlertTriangle size={16} />}
                  color="yellow"
                  variant="light"
                  style={{ width: "100%" }}
                >
                  <Text size="sm">
                    Error: {this.state.error?.message || "Unknown error occurred"}
                  </Text>
                </Alert>

                <Stack gap="md" style={{ width: "100%" }}>
                  <Button
                    size="lg"
                    fullWidth
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan" }}
                    leftSection={<IconRefresh size={18} />}
                    onClick={this.handleReload}
                  >
                    Reload Page
                  </Button>
                  
                  <Button
                    size="md"
                    variant="outline"
                    fullWidth
                    leftSection={<IconHome size={16} />}
                    onClick={this.handleGoHome}
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "white",
                    }}
                  >
                    Go to Homepage
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Container>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
