import React, { useEffect } from "react";
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  Image,
  Text,
  TextInput,
  PasswordInput,
  PinInput,
  Stack,
  Box,
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import { useLocalStorage } from '@mantine/hooks';
import classes from "./SignupForm.module.scss";
import { Link, useNavigate } from "react-router";
import icons from "../../../../assets/icons";
import type { SignupData } from "../../../../models/user.model";
import { signupSchema, signupInitialValues } from "../../../../forms";
import { showError, showSuccess } from "../../../../utils";
import { useSendEmailOtp, useVerifyEmail } from "../../../../hooks/api/useAuth";
import ROUTES from "../../../../constants/routes";

// Keys for localStorage
const LS_KEYS = {
  FORM_DATA: 'signup_form_data',
  IS_OTP_SENT: 'signup_is_otp_sent',
  COUNTDOWN: 'signup_countdown',
  OTP: 'signup_otp'
};

const SignupForm: React.FC = () => {
  const navigate = useNavigate();
  
  // Use localStorage for persistent state
  const [storedFormData, setStoredFormData] = useLocalStorage({
    key: LS_KEYS.FORM_DATA,
    defaultValue: signupInitialValues
  });
  
  const [isOtpSent, setIsOtpSent] = useLocalStorage({
    key: LS_KEYS.IS_OTP_SENT,
    defaultValue: false
  });
  
  const [countdown, setCountdown] = useLocalStorage({
    key: LS_KEYS.COUNTDOWN,
    defaultValue: 0
  });
  
  const [otp, setOtp] = useLocalStorage({
    key: LS_KEYS.OTP,
    defaultValue: ""
  });

  const { mutateAsync, isPending } = useSendEmailOtp();
  const { mutateAsync: mutateVerifyOtp, isPending: isOtpVerificationPending } =
    useVerifyEmail();

  // Initialize form with stored values
  const form = useForm({
    initialValues: { ...storedFormData },
    validate: yupResolver(signupSchema),
  });
  
  // Sync form values with localStorage
  const updateStoredFormData = (values: typeof signupInitialValues) => {
    setStoredFormData(values);
  };
  
  // Update localStorage whenever form values change
  useEffect(() => {
    updateStoredFormData(form.values);
  }, [form.values]);
  
  // Set form values from localStorage on mount
  useEffect(() => {
    // Set initial form values from localStorage
    form.setValues({ ...storedFormData });
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let timerId: number | undefined;
    if (countdown > 0) {
      timerId = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    
    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, [countdown, setCountdown]);

  // Format the countdown time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clear all stored signup data
  const clearSignupData = () => {
    window.localStorage.removeItem(LS_KEYS.FORM_DATA);
    window.localStorage.removeItem(LS_KEYS.IS_OTP_SENT);
    window.localStorage.removeItem(LS_KEYS.COUNTDOWN);
    window.localStorage.removeItem(LS_KEYS.OTP);
  };

  // Allow the user to edit their email after OTP is sent
  const handleEditEmail = () => {
    setIsOtpSent(false);
    setOtp("");
    setCountdown(0);
  };

  // Handle verify email button click
  const handleVerifyEmail = async (values: typeof form.values) => {
    const { email } = values;

    console.log("is continue clicked",values);
    

    try {
      const response = await mutateAsync(email);
      console.log("signup error response  : ", response);

      if (!response.status) throw new Error(response.errorMessage?.message);
      showSuccess(response.message);
      setIsOtpSent(true);
      setCountdown(120); // Set 2 minute countdown
    } catch (error) {
      showError((error as Error).message);
    }
  };

  // Form submission handler
  const handleSubmit = async (values: typeof form.values) => {
    console.log("handle submit clicked",values);
    
    if (!isOtpSent) {
      await handleVerifyEmail(values);
      return;
    }

    const signupData: SignupData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
      otp: otp,
    };

    try {
      const response = await mutateVerifyOtp(signupData);
      if (!response.status) throw new Error(response.message);
      showSuccess(response.message);
      // Clear signup data on successful signup
      clearSignupData();
      navigate(ROUTES.LOGIN);
    } catch (error) {
      showError((error as Error).message);
    }
  };

  return (
    <Box
      w={{ base: "100%", xs: "100%", sm: "650px" }}
      mx="auto"
      className={classes.formContainer}
      style={{ 
        position: "relative",
        minHeight: "auto",
        width: "100%"
      }}
    >
      {/* Decorative elements */}
      <Box className={classes.decorativeCircle1} />
      <Box className={classes.decorativeCircle2} />

      <form
        onSubmit={form.onSubmit(handleSubmit)}
        style={{ width: "100%", position: "relative", zIndex: 1 }}
      >
        <Flex direction={"column"} gap={{ base: 14, md: 20 }}>
          <Text
            size="lg"
            fw={700}
            ta="center"
            mb={{ base: 8, sm: 16 }}
            className={classes.formTitle}
          >
            Create an Account
          </Text>

          {/* First and Last Name */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 12, sm: 20 }}
            justify={"space-between"}
          >
            <TextInput
              w={{ base: "100%", sm: "48%" }}
              classNames={{
                label: classes.label,
                input: classes.input,
              }}
              label="First Name"
              placeholder="Enter your first name"
              radius="md"
              size="md"
              required
              {...form.getInputProps("firstName")}
            />

            <TextInput
              w={{ base: "100%", sm: "48%" }}
              classNames={{
                label: classes.label,
                input: classes.input,
              }}
              label="Last Name"
              placeholder="Enter your last name"
              radius="md"
              size="md"
              required
              {...form.getInputProps("lastName")}
            />
          </Flex>

          {/* Email */}
          <TextInput
            classNames={{ label: classes.label, input: classes.input }}
            label="Email"
            placeholder="Enter your email"
            radius="md"
            size="md"
            required
            disabled={isOtpSent}
            {...form.getInputProps("email")}
          />

          {/* Show email status when OTP is sent */}
          {isOtpSent && (
            <Text size="sm" color="dimmed" mt="-16px" mb="4px">
              OTP sent to {form.values.email.replace(/(.{3})(.*)(@.*)/, '$1•••$3')}
            </Text>
          )}

          {/* Password */}
          <PasswordInput
            classNames={{ label: classes.label, input: classes.input }}
            label="Password"
            placeholder="Create a strong password"
            radius="md"
            size="md"
            required
            {...form.getInputProps("password")}
          />

          {/* Confirm Password */}
          <PasswordInput
            classNames={{ label: classes.label, input: classes.input }}
            label="Confirm Password"
            placeholder="Confirm your password"
            radius="md"
            size="md"
            required
            {...form.getInputProps("confirmPassword")}
          />

          {/* OTP Field */}
          {isOtpSent && (
            <Stack gap="xs">
              <Flex justify="space-between" align="center">
                <Text
                  fz={14}
                  fw={600}
                  className={classes.label}
                  style={{ marginBottom: 0 }}
                >
                  Enter OTP sent to your email
                </Text>
                <Button
                  variant="subtle"
                  size="compact-sm"
                  onClick={handleEditEmail}
                  className={classes.linkText}
                  style={{
                    padding: '0 8px',
                    height: 'auto',
                    background: 'transparent',
                  }}
                >
                  Edit Email
                </Button>
              </Flex>
              <Flex
                gap={8}
                direction="column"
                style={{ marginTop: 0 }}
              >
                <PinInput
                  length={6}
                  size="md"
                  radius="md"
                  type="number"
                  inputMode="numeric"
                  value={otp}
                  onChange={setOtp}
                  placeholder=""
                  styles={{
                    input: {
                      background: "rgba(255, 255, 255, 0.1)",
                      color: "#fff",
                      borderColor: "rgba(255, 255, 255, 0.1)",
                      "&:focus": {
                        borderColor: "#4361ee",
                      },
                    },
                  }}
                />
                <Flex justify="flex-start" align="center">
                  {countdown > 0 ? (
                    <Text fz={13} color="dimmed">
                      Resend OTP in {formatTime(countdown)}
                    </Text>
                  ) : (
                    <Button
                      variant="subtle"
                      size="compact-sm"
                      onClick={() => handleVerifyEmail(form.values)}
                      loading={isPending}
                      className={classes.linkText}
                      style={{
                        padding: 0,
                        height: "auto",
                        background: "transparent",
                      }}
                    >
                      Resend OTP
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Stack>
          )}

          {/* Terms and Conditions */}
          <Checkbox
            classNames={{ label: classes.checkBoxLabel }}
            label={
              <Text size="sm">
                I agree to the{" "}
                <Link to="/terms" className={classes.linkText}>
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className={classes.linkText}>
                  Privacy Policy
                </Link>
              </Text>
            }
            required
            {...form.getInputProps("termsAccepted", { type: "checkbox" })}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            radius="md"
            size="lg"
            fullWidth
            className={classes.primaryButton}
            loading={isPending || isOtpVerificationPending}
            my={{ base: 4, sm: 8 }}
          >
            {isOtpSent ? "Complete Signup" : "Continue"}
          </Button>

          {/* Login Link */}
          <Flex justify="center" align="center" gap={8}>
            <Text c="dimmed" fz={14}>
              Already have an account?
            </Text>
            <Link to={ROUTES.LOGIN}>
              <Text fz={14} fw={700} className={classes.linkText}>
                Log in
              </Text>
            </Link>
          </Flex>

          {/* Reset Form Button */}
          <Button
            variant="subtle"
            size="sm"
            onClick={() => {
              form.reset();
              setIsOtpSent(false);
              setOtp("");
              setCountdown(0);
            }}
            className={classes.linkText}
            style={{
              background: "transparent",
              alignSelf: "center",
              marginTop: 8
            }}
          >
            Reset Form
          </Button>

          {/* Social Login */}
          <Divider
            label="Or continue with"
            labelPosition="center"
            classNames={{
              root: classes.divider,
              label: classes.divLabel,
            }}
            my={{ base: 10, sm: 15 }}
          />

          <Button
            w="100%"
            h={{ base: 42, sm: 48 }}
            leftSection={<Image h={20} w={20} src={icons.GOOGLE} />}
            variant="default"
            radius="xl"
            className={classes.socialButton}
            onClick={() => showError("Social login is not implemented yet")}
          >
            Google
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default SignupForm; 