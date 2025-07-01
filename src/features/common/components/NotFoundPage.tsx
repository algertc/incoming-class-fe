import React from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Box,
  ThemeIcon,
  Group,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router";
import {
  IconHome,
  IconArrowLeft,
  IconSearch,
  IconMapPin,
} from "@tabler/icons-react";

const NotFoundPage: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "1rem" : "2rem",
      }}
    >
      <Container size="sm">
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
            <ThemeIcon
              size={isMobile ? 100 : 120}
              radius="50%"
              variant="gradient"
              gradient={{ from: "indigo", to: "cyan" }}
              style={{ marginBottom: "1rem" }}
            >
              <IconMapPin size={isMobile ? 50 : 60} />
            </ThemeIcon>

            <Stack gap="md" align="center">
              <Title
                order={1}
                size={isMobile ? "3rem" : "4rem"}
                style={{ 
                  color: theme.white,
                  fontWeight: 900,
                  background: "linear-gradient(45deg, #4c6ef5, #15aabf)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                404
              </Title>
              <Title
                order={2}
                size={isMobile ? "h3" : "h2"}
                style={{ color: theme.white, marginBottom: "0.5rem" }}
              >
                Page Not Found
              </Title>
              <Text
                size={isMobile ? "md" : "lg"}
                style={{ color: theme.colors.gray[3] }}
                maw={500}
                ta="center"
              >
                Oops! The page you are looking for does not exist. It might have been moved, deleted, or you entered the wrong URL.
              </Text>
            </Stack>

            <Paper
              p={isMobile ? "md" : "lg"}
              radius="md"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                width: "100%",
              }}
            >
              <Group justify="center" mb="sm">
                <ThemeIcon
                  size="md"
                  radius="md"
                  variant="light"
                  color="blue"
                >
                  <IconSearch size={18} />
                </ThemeIcon>
                <Text
                  fw={600}
                  style={{ color: theme.white }}
                  size={isMobile ? "sm" : "md"}
                >
                  What you can do:
                </Text>
              </Group>
              <Stack gap="xs">
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • Check the URL for any typos
                </Text>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • Go back to the previous page
                </Text>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • Visit our homepage to explore
                </Text>
                <Text
                  size={isMobile ? "xs" : "sm"}
                  style={{ color: theme.colors.gray[4] }}
                >
                  • Use the navigation menu to find what you need
                </Text>
              </Stack>
            </Paper>

            <Stack gap="md" style={{ width: "100%" }}>
              <Button
                size={isMobile ? "md" : "lg"}
                fullWidth
                variant="gradient"
                gradient={{ from: "indigo", to: "cyan" }}
                leftSection={<IconHome size={isMobile ? 16 : 18} />}
                onClick={handleGoHome}
              >
                Go to Homepage
              </Button>
              
              <Button
                size={isMobile ? "sm" : "md"}
                variant="outline"
                fullWidth
                leftSection={<IconArrowLeft size={isMobile ? 14 : 16} />}
                onClick={handleGoBack}
                style={{
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: theme.white,
                }}
              >
                Go Back
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFoundPage;
