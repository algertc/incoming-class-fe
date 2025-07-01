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
  Code,
  Collapse,
} from "@mantine/core";
import {
  IconBug,
  IconRefresh,
  IconHome,
  IconChevronDown,
  IconChevronUp,
  IconAlertTriangle,
} from "@tabler/icons-react";

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  toggleDetails = () => {
    this.setState(prevState => ({
      showDetails: !prevState.showDetails
    }));
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isMobile = window.innerWidth <= 768;

      return (
        <Box
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #000000 0%, #2d1b2e 50%, #000000 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "1rem" : "2rem",
          }}
        >
          <Container size="md">
            <Paper
              p={isMobile ? "xl" : "3rem"}
              radius="lg"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                textAlign: "center",
              }}
            >
              <Stack gap={isMobile ? "lg" : "xl"} align="center">
                {/* Error Icon */}
                <ThemeIcon
                  size={isMobile ? 80 : 100}
                  radius="50%"
                  variant="gradient"
                  gradient={{ from: "red", to: "pink" }}
                >
                  <IconBug size={isMobile ? 40 : 50} />
                </ThemeIcon>

                {/* Error Message */}
                <Stack gap="md" align="center">
                  <Title
                    order={1}
                    size={isMobile ? "h2" : "h1"}
                    style={{ color: "white" }}
                  >
                    Oops! Something went wrong
                  </Title>
                  <Text
                    size={isMobile ? "md" : "lg"}
                    style={{ color: "#c1c2c5" }}
                    maw={600}
                    ta="center"
                  >
                    We encountered an unexpected error. Don't worry, our team has been notified and is working on a fix.
                  </Text>
                </Stack>

                {/* Error Details Alert */}
                <Alert
                  icon={<IconAlertTriangle size={16} />}
                  color="yellow"
                  variant="light"
                  style={{ width: "100%" }}
                >
                  <Stack gap="xs">
                    <Text size="sm" fw={500}>
                      Error occurred at {new Date().toLocaleString()}
                    </Text>
                    {this.state.error && (
                      <Text size="sm" c="dimmed">
                        {this.state.error.message}
                      </Text>
                    )}
                  </Stack>
                </Alert>

                {/* Technical Details (Collapsible) */}
                {(this.state.error || this.state.errorInfo) && (
                  <Box style={{ width: "100%" }}>
                    <Button
                      variant="subtle"
                      size="sm"
                      leftSection={
                        this.state.showDetails ? (
                          <IconChevronUp size={16} />
                        ) : (
                          <IconChevronDown size={16} />
                        )
                      }
                      onClick={this.toggleDetails}
                      style={{ color: "#c1c2c5" }}
                    >
                      {this.state.showDetails ? "Hide" : "Show"} Technical Details
                    </Button>
                    
                    <Collapse in={this.state.showDetails}>
                      <Paper
                        p="md"
                        mt="xs"
                        style={{
                          background: "rgba(255, 255, 255, 0.03)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                        }}
                      >
                        <Stack gap="xs">
                          {this.state.error && (
                            <div>
                              <Text size="xs" fw={600} mb={4} style={{ color: "#ffd43b" }}>
                                Error:
                              </Text>
                              <Code
                                block
                                style={{
                                  background: "rgba(0, 0, 0, 0.3)",
                                  color: "#ff6b6b",
                                  fontSize: "11px",
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                }}
                              >
                                {this.state.error.stack || this.state.error.message}
                              </Code>
                            </div>
                          )}
                          {this.state.errorInfo && (
                            <div>
                              <Text size="xs" fw={600} mb={4} style={{ color: "#ffd43b" }}>
                                Component Stack:
                              </Text>
                              <Code
                                block
                                style={{
                                  background: "rgba(0, 0, 0, 0.3)",
                                  color: "#74c0fc",
                                  fontSize: "11px",
                                  whiteSpace: "pre-wrap",
                                  wordBreak: "break-word",
                                }}
                              >
                                {this.state.errorInfo.componentStack}
                              </Code>
                            </div>
                          )}
                        </Stack>
                      </Paper>
                    </Collapse>
                  </Box>
                )}

                {/* Action Buttons */}
                <Stack gap="md" style={{ width: "100%" }}>
                  <Button
                    size={isMobile ? "md" : "lg"}
                    fullWidth
                    variant="gradient"
                    gradient={{ from: "indigo", to: "cyan" }}
                    leftSection={<IconRefresh size={isMobile ? 16 : 18} />}
                    onClick={this.handleReload}
                  >
                    Reload Page
                  </Button>
                  
                  <Button
                    size={isMobile ? "sm" : "md"}
                    variant="outline"
                    fullWidth
                    leftSection={<IconHome size={isMobile ? 14 : 16} />}
                    onClick={this.handleGoHome}
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      color: "white",
                    }}
                  >
                    Go to Homepage
                  </Button>
                </Stack>

                {/* Support Info */}
                <Paper
                  p="md"
                  radius="md"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    width: "100%",
                  }}
                >
                  <Text
                    size="xs"
                    style={{ color: "#868e96" }}
                    ta="center"
                  >
                    If this problem persists, please contact our support team with the error details above.
                  </Text>
                </Paper>
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