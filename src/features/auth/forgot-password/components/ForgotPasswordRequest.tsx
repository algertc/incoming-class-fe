import React, { useState } from "react";
import {
  Button,
  Flex,
  Text,
  TextInput,
  Box,
  Title,
  Alert,
} from "@mantine/core";
import { Link } from "react-router";
import classes from "./ForgotPassword.module.scss";
import { IconArrowLeft, IconMail } from "@tabler/icons-react";
import { useRequestPasswordReset } from "../../../../hooks/api";
import { object, string } from "yup";
import { showError } from "../../../../utils";

const ForgotPasswordRequest: React.FC = () => {
  const [email, setEmail] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const { mutateAsync, isPending } = useRequestPasswordReset();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await object()
      .shape({
        email: string().email("Invalid email").required("Email is required"),
      })
      .isValid({ email });

    if (!result) return showError("Please enter a valid email address");

    try {
      const response = await mutateAsync(email);
      if (response.status) {
        setRequestSent(true);
      }
    } catch (error) {
      const errMsg = (error as Error).message;
      showError(errMsg || "Failed to send OTP. Please try again.");
    }
  };

  return (
    <Box
      style={{
        width: "100%",
        height: "100%",
        maxHeight: "700px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <Box className={classes.formContainer}>
        <form onSubmit={handleSendOTP}>
          <Flex direction={"column"} gap={{ base: 20, md: 24 }}>
            <Box>
              <Link to="/login">
                <Text
                  fz={{ base: "14px", md: "16px" }}
                  fw={500}
                  c="#4361ee"
                  className={classes.linkText}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <IconArrowLeft size={16} />
                  Back to login
                </Text>
              </Link>
              <Title order={3} mb="sm" mt="md" className={classes.formTitle}>
                Reset Your Password
              </Title>
              <Text size="sm" className={classes.formText} mb="lg">
                Enter your email address and we'll send you a one-time password
                (OTP) to reset your password.
              </Text>
            </Box>

            {requestSent ? (
              <Alert
                icon={<IconMail size={16} />}
                title="Check your email"
                color="blue"
                radius="md"
              >
                We've sent a one-time password (OTP) to <b>{email}</b>. Please
                check your inbox and proceed to the next step.
                <Flex mt="md">
                  <Link to="/forgot-password/reset">
                    <Button
                      color="#4361ee"
                      radius="md"
                      size="sm"
                      className={classes.primaryButton}
                      fullWidth
                    >
                      Continue to Reset Password
                    </Button>
                  </Link>
                </Flex>
              </Alert>
            ) : (
              <>
                <TextInput
                  classNames={{ label: classes.label, input: classes.input }}
                  label={"Email address"}
                  placeholder="Enter your email"
                  radius="md"
                  size="md"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={
                    email === ""
                      ? ""
                      : !email.includes("@")
                      ? "Please enter a valid email"
                      : null
                  }
                />

                <Button
                  type="submit"
                  color="#4361ee"
                  radius="md"
                  size="lg"
                  fullWidth
                  loading={isPending}
                  className={classes.primaryButton}
                  disabled={!email || !email.includes("@")}
                >
                  Send OTP
                </Button>
              </>
            )}

            <Box style={{ marginTop: "16px", textAlign: "center" }}>
              <Text size="sm" className={classes.formText}>
                Remember your password?{" "}
                <Link to="/login">
                  <Text
                    component="span"
                    fz={{ base: "14px", md: "14px" }}
                    fw={600}
                    c="#4361ee"
                    className={classes.linkText}
                  >
                    Log in
                  </Text>
                </Link>
              </Text>
            </Box>

            {/* Decorative elements to match the login form theme */}
            <Box className={classes.decorativeCircle1} />
            <Box className={classes.decorativeCircle2} />
          </Flex>
        </form>
      </Box>
    </Box>
  );
};

export default ForgotPasswordRequest; 