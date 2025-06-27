import React, { useState } from "react";
import {
  Button,
  Flex,
  Text,
  TextInput,
  PasswordInput,
  Box,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import classes from "./LoginForm.module.scss";
import { Link, useNavigate } from "react-router";
import { useLogin } from "../../../../hooks/api";
import type {
  LoginCredentials,
  AuthResponse,
} from "../../../../models/user.model";
import { loginSchema, loginInitialValues } from "../../../../forms";
import { showSuccess } from "../../../../utils";
import { ROUTES } from "../../../../routing/routes";
import { useAuthStore } from "../../../../store/auth.store";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const login = useLogin();
  const { fetchUser, setUser } = useAuthStore();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    initialValues: loginInitialValues,
    validate: yupResolver(loginSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    setApiError(null);
    const loginData: LoginCredentials = {
      email: values.email,
      password: values.password,
    };

    try {
      const response = await login.mutateAsync({
        email: loginData.email,
        password: loginData.password,
      });
      

      if (!response.status) throw new Error(response.errorMessage?.message);

      showSuccess("Login Successful!");
      const authResponse = response.data as AuthResponse;

      // Fetch fresh user data from server instead of using login response
      try {
        console.log('Login: Fetching fresh user data from server');
        await fetchUser();
        console.log('Login: User data fetched successfully');
      } catch (fetchError) {
        console.error('Login: Failed to fetch user data:', fetchError);
        // Fallback to login response data if fetchUser fails
        if (authResponse.user) {
          console.log('Login: Using login response user data as fallback');
          setUser(authResponse.user);
        }
      }

      const redirectRoute = authResponse.isProfileCompleted ? ROUTES.APP : ROUTES.PROFILE_COMPLETION;
      console.log('Login successful, redirecting to:', redirectRoute);
      console.log('User profile completed:', authResponse.isProfileCompleted);

      navigate(redirectRoute);
    } catch (error) {
      setApiError((error as Error).message);
    }
  };

  return (
    <Box
      w={{ base: "100%", xs: "100%", sm: "520px" }}
      maw="100%"
      mx="auto"
      className={classes.formContainer}
      style={{
        position: "relative",
        minHeight: "auto",
        maxHeight: "none",
        overflow: "visible",
      }}
    >
      {/* Decorative elements */}
      <Box className={classes.decorativeCircle1} />
      <Box className={classes.decorativeCircle2} />

      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ width: "100%", position: "relative", zIndex: 1 }}
      >
        <Flex direction="column" gap={{ base: 16, sm: 20 }}>
          <Text
            size="xl"
            fw={700}
            ta="center"
            mb={{ base: 10, sm: 16 }}
            className={classes.formTitle}
          >
            Welcome back!
          </Text>

          {apiError && (
            <Text className={classes.errorText} ta="center" mb={8}>
              {apiError}
            </Text>
          )}

          <TextInput
            classNames={{ label: classes.label, input: classes.input }}
            label="Email"
            placeholder="Enter your email"
            radius="md"
            size="md"
            required
            {...form.getInputProps("email")}
          />

          <PasswordInput
            classNames={{ label: classes.label, input: classes.input }}
            label="Password"
            placeholder="Enter your password"
            radius="md"
            size="md"
            required
            {...form.getInputProps("password")}
          />

          <Flex justify="space-between" align="center">
            <Link to={ROUTES.FORGOT_PASSWORD}>
              <Text fz={14} fw={500} className={classes.linkText}>
                Forgot password?
              </Text>
            </Link>
          </Flex>

          <Button
            type="submit"
            radius="md"
            size="lg"
            fullWidth
            className={classes.primaryButton}
            loading={login.isPending}
            my={{ base: 4, sm: 8 }}
          >
            Log In
          </Button>

          <Flex justify="center" align="center" gap={8}>
            <Text c={"white"} fz={14}>
              Don't have an account?
            </Text>
            <Link to={ROUTES.SIGNUP}>
              <Text fz={14} fw={700} className={classes.linkText}>
                Sign up
              </Text>
            </Link>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
};

export default LoginForm;
