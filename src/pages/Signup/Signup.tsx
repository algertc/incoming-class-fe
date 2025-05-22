import React from "react";
import { Card, Flex, Stack, Title, Text } from "@mantine/core";
import Logo from "../../components/Header/Logo";
import SignupForm from "./SignupForm/SignupForm";

const Signup: React.FC = () => {
  return (
    <Card shadow="xs" w="100%" h="100%" bg={"white"}>
      <Flex direction="column" justify="flex-start" align="center" gap="xl">
        <Logo />
        <Stack gap="xs" align="center">
          <Title order={2} size="h3" c="black">
            Welcome, sign up to continue
          </Title>
          <Text size="md" c="dimmed">
            Please enter your details
          </Text>
        </Stack>
        <SignupForm />
      </Flex>
    </Card>
  );
};

export default Signup;
