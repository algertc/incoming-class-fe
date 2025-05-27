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
import { useMediaQuery, useLocalStorage } from '@mantine/hooks';
import authClasses from "../../../styles/authStyles.module.scss";
import { Link, useNavigate } from "react-router";
import icons from "../../../assets/icons";
import type { SignupData } from "../../../models/user.model";
import { signupSchema, signupInitialValues } from "../../../forms";
import { showError, showSuccess } from "../../../utils";
import { useSendEmailOtp, useVerifyEmail } from "../../../hooks/api/useAuth";
import ROUTES from "../../../constants/routes";

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
  
  const isMobile = useMediaQuery('(max-width: 768px)');

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

  // Handle verify email button click
  const handleVerifyEmail = async (values: typeof form.values) => {
    const { email } = values;

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
      className={authClasses.formContainer}
      style={{ 
        position: "relative",
        minHeight: "auto",
        overflowY: isMobile ? "auto" : "visible",
        overflowX: "hidden",
        maxHeight: isMobile ? "100vh" : "none",
        width: "100%"
      }}
    >
      {/* Decorative elements */}
      <Box className={authClasses.decorativeCircle1} />
      <Box className={authClasses.decorativeCircle2} />

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
            className={authClasses.formTitle}
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
                label: authClasses.label,
                input: authClasses.input,
              }}
              label={"First Name"}
              placeholder="Enter your first name"
              required
              {...form.getInputProps("firstName")}
            />
            <TextInput
              w={{ base: "100%", sm: "48%" }}
              classNames={{
                label: authClasses.label,
                input: authClasses.input,
              }}
              label={"Last Name"}
              placeholder="Enter your last name"
              required
              {...form.getInputProps("lastName")}
            />
          </Flex>

          {/* Email */}
          <TextInput
            classNames={{ label: authClasses.label, input: authClasses.input }}
            label={"Email"}
            placeholder="your.email@example.com"
            required
            {...form.getInputProps("email")}
          />

          {/* Password and Confirm Password */}
          <Flex
            direction={{ base: "column", sm: "row" }}
            gap={{ base: 12, sm: 20 }}
            justify={"space-between"}
          >
            <PasswordInput
              w={{ base: "100%", sm: "48%" }}
              classNames={{
                label: authClasses.label,
                input: authClasses.input,
              }}
              label={"Password"}
              placeholder="Create a secure password"
              required
              {...form.getInputProps("password")}
            />
            <PasswordInput
              w={{ base: "100%", sm: "48%" }}
              classNames={{
                label: authClasses.label,
                input: authClasses.input,
              }}
              label={"Confirm Password"}
              placeholder="Repeat your password"
              required
              {...form.getInputProps("confirmPassword")}
            />
          </Flex>

          {/* Terms and Conditions */}
          <Checkbox
            classNames={{ label: authClasses.checkBoxLabel }}
            styles={{ input: { root: { marginTop: '3px' } } }}
            label={
              <Text size="xs" style={{ lineHeight: 1.4 }}>
                By checking this box I am agreeing to the Terms of Service and Privacy Policy
              </Text>
            }
            {...form.getInputProps("termsAccepted", { type: "checkbox" })}
          />

          {/* OTP Input */}
          {isOtpSent && (
            <Stack gap="xs" align="center" mt={2}>
              <Text
                size="sm"
                fw={600}
                className={authClasses.formTitle}
                ta="center"
              >
                Enter Verification Code
              </Text>
              <Text
                size="xs"
                className={authClasses.formText}
                mb={8}
                ta="center"
                px={10}
              >
                We've sent a 6-digit verification code to{" "}
                <Text span fw={600} className={authClasses.linkText}>
                  {form.values.email}
                </Text>
              </Text>
              <PinInput
                length={6}
                value={otp}
                onChange={setOtp}
                size="sm"
                radius="md"
                classNames={{ input: authClasses.input }}
                placeholder=""
              />
              <Flex align="center" justify="center" gap={6} mt={8}>
                <Text
                  size="xs"
                  className={authClasses.formText}
                  ta="center"
                >
                  Didn't receive the code?{" "}
                  {countdown > 0 ? (
                    <Flex align="center" gap={4}>
                      <Text span size="xs" fw={500} className={authClasses.formText}>
                        Resend in {formatTime(countdown)}
                      </Text>
                    </Flex>
                  ) : (
                    <Text
                      span
                      className={authClasses.linkText}
                      fw={600}
                      style={{ cursor: "pointer" }}
                      onClick={async () => {
                        await handleVerifyEmail(form.values);
                      }}
                    >
                      Resend
                    </Text>
                  )}
                </Text>
              </Flex>
            </Stack>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            radius="md"
            size="md"
            fullWidth
            className={authClasses.primaryButton}
            loading={isPending || isOtpVerificationPending}
            my={2}
          >
            {isOtpSent ? "Sign Up" : "Verify Email"}
          </Button>

          {/* Login Link */}
          <Flex justify="center" align="center" gap={8}>
            <Text 
              className={authClasses.formText} 
              size="xs"
            >
              Already have an account?
            </Text>
            <Link to={"/login"}>
              <Text 
                size="xs"
                fw={700} 
                className={authClasses.linkText}
              >
                Login here
              </Text>
            </Link>
          </Flex>

          {/* Social Login Options */}
          <Divider
            label="Or continue with"
            labelPosition="center"
            classNames={{
              root: authClasses.divider,
              label: authClasses.dividerLabel,
            }}
            my={8}
          />

          <Button
            w="100%"
            h={38}
            leftSection={<Image h={18} w={18} src={icons.GOOGLE} />}
            radius="xl"
            className={authClasses.socialButton}
          >
            Google
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default SignupForm;
