import React, { useState } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Code,
  Alert,
} from "@mantine/core";
import { IconBug, IconAlertTriangle } from "@tabler/icons-react";
import { useErrorHandler } from "../../../hooks/useErrorHandler";

const ErrorTestPage: React.FC = () => {
  const [errorCount, _setErrorCount] = useState(0);
  const { handleError, handleAsyncError } = useErrorHandler();

  const triggerJavaScriptError = () => {
    // This will trigger the ErrorBoundary
    throw new Error("This is a test JavaScript error to trigger the ErrorBoundary!");
  };

  const triggerAsyncError = async () => {
    await handleAsyncError(async () => {
      throw new Error("This is a test async error!");
    });
  };

  const triggerHandledError = () => {
    handleError(new Error("This is a handled error that shows a notification"));
  };

  const triggerNetworkError = async () => {
    try {
      // This will trigger a network error
      await fetch('/api/nonexistent-endpoint');
    } catch (error) {
      handleError(error, { 
        fallbackMessage: "Network request failed" 
      });
    }
  };

  const triggerUndefinedError = () => {
    // This will cause a TypeError and trigger ErrorBoundary
    const obj: any = null;
    console.log(obj.someProperty.anotherProperty);
  };

  return (
    <Container size="md" style={{ padding: "2rem" }}>
      <Paper
        p="xl"
        radius="lg"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Stack gap="xl">
          <div>
            <Title order={1} style={{ color: "white", marginBottom: "1rem" }}>
              Error Testing Page
            </Title>
            <Text style={{ color: "#c1c2c5" }}>
              This page helps test different types of error handling in the application.
              Use the buttons below to trigger different types of errors.
            </Text>
          </div>

          <Alert
            icon={<IconAlertTriangle size={16} />}
            color="yellow"
            variant="light"
          >
            <Text size="sm">
              <strong>Warning:</strong> Some buttons will crash the component and trigger the ErrorBoundary.
              You will need to reload the page to return to normal operation.
            </Text>
          </Alert>

          <div>
            <Title order={3} style={{ color: "white", marginBottom: "1rem" }}>
              Error Types
            </Title>
            
            <Stack gap="md">
              <Group>
                <Button
                  color="red"
                  leftSection={<IconBug size={16} />}
                  onClick={triggerJavaScriptError}
                >
                  Trigger JavaScript Error (ErrorBoundary)
                </Button>
                <Text size="sm" style={{ color: "#c1c2c5" }}>
                  Throws an error that will be caught by ErrorBoundary
                </Text>
              </Group>

              <Group>
                <Button
                  color="orange"
                  leftSection={<IconBug size={16} />}
                  onClick={triggerUndefinedError}
                >
                  Trigger TypeError (ErrorBoundary)
                </Button>
                <Text size="sm" style={{ color: "#c1c2c5" }}>
                  Causes a TypeError by accessing properties on null
                </Text>
              </Group>

              <Group>
                <Button
                  color="blue"
                  onClick={triggerHandledError}
                >
                  Trigger Handled Error
                </Button>
                <Text size="sm" style={{ color: "#c1c2c5" }}>
                  Shows an error notification without crashing
                </Text>
              </Group>

              <Group>
                <Button
                  color="cyan"
                  onClick={triggerAsyncError}
                >
                  Trigger Async Error
                </Button>
                <Text size="sm" style={{ color: "#c1c2c5" }}>
                  Handles an async error gracefully
                </Text>
              </Group>

              <Group>
                <Button
                  color="grape"
                  onClick={triggerNetworkError}
                >
                  Trigger Network Error
                </Button>
                <Text size="sm" style={{ color: "#c1c2c5" }}>
                  Simulates a network request failure
                </Text>
              </Group>
            </Stack>
          </div>

          <div>
            <Title order={4} style={{ color: "white", marginBottom: "0.5rem" }}>
              Error Statistics
            </Title>
            <Text style={{ color: "#c1c2c5" }}>
              Errors triggered: {errorCount}
            </Text>
          </div>

          <div>
            <Title order={4} style={{ color: "white", marginBottom: "0.5rem" }}>
              How to Test
            </Title>
            <Stack gap="xs">
              <Text size="sm" style={{ color: "#c1c2c5" }}>
                1. Click "Trigger JavaScript Error" to see the ErrorBoundary in action
              </Text>
              <Text size="sm" style={{ color: "#c1c2c5" }}>
                2. Click "Trigger Handled Error" to see graceful error handling
              </Text>
              <Text size="sm" style={{ color: "#c1c2c5" }}>
                3. Navigate to a non-existent URL to test the 404 page
              </Text>
              <Text size="sm" style={{ color: "#c1c2c5" }}>
                4. Check the browser console for error logs
              </Text>
            </Stack>
          </div>

          <Code
            block
            style={{
              background: "rgba(0, 0, 0, 0.3)",
              color: "#74c0fc",
              fontSize: "12px",
            }}
          >
            {`// Example: Test 404 page
// Navigate to: /this-page-does-not-exist

// Example: Test ErrorBoundary
// Click the red "Trigger JavaScript Error" button`}
          </Code>
        </Stack>
      </Paper>
    </Container>
  );
};

export default ErrorTestPage;
