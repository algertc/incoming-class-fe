import React, { useState } from "react";
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
} from "@mantine/core";
import { useForm, yupResolver } from "@mantine/form";
import classes from "./index.module.scss";
import { Link } from "react-router";
import icons from "../../../assets/icons";
import { useSignup } from "../../../hooks/api";
import type { SignupData } from "../../../models/user.model";
import { signupSchema, signupInitialValues } from "../../../forms";
import { showError, showSuccess } from "../../../utils";
// import ROUTES from "../../../constants/routes";
import { useVerifyEmail } from "../../../hooks/api/useAuth";

const SignupForm: React.FC = () => {
  // const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const { mutateAsync, isPending } = useSignup();
  const { mutateAsync: mutateVerifyOtp, isPending: isOtpVerificationPending } =
    useVerifyEmail();

  const form = useForm({
    initialValues: signupInitialValues,
    validate: yupResolver(signupSchema),
  });

  // Handle verify email button click
  const handleVerifyEmail = async (values: typeof form.values) => {
    // Call the signup mutation with the form values
    const signupData: SignupData = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    };

    try {
      const response = await mutateAsync(signupData);
      if (!response.status) throw new Error(response.message);
      showSuccess(response.message);
      setIsOtpSent(true);
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

    try {
      const response = await mutateVerifyOtp({ email: values.email, otp });
      if (!response.status) throw new Error(response.message);
      showSuccess(response.message);
      // showSuccess("OTP sent to your email");
    } catch (error) {
      showError((error as Error).message);
    }
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Flex direction={"column"} gap={{ base: 16, md: 20 }}>
        {/* First and Last Name */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 16, sm: 0 }}
          justify={"space-between"}
        >
          <TextInput
            w={{ base: "100%", sm: "45%" }}
            classNames={{ label: classes.label, input: classes.input }}
            label={"First Name"}
            placeholder="Enter your first name"
            required
            {...form.getInputProps("firstName")}
          />
          <TextInput
            w={{ base: "100%", sm: "45%" }}
            classNames={{ label: classes.label, input: classes.input }}
            label={"Last Name"}
            placeholder="Enter your last name"
            required
            {...form.getInputProps("lastName")}
          />
        </Flex>

        {/* Email */}
        <TextInput
          classNames={{ label: classes.label, input: classes.input }}
          label={"Email"}
          placeholder="your.email@example.com"
          required
          {...form.getInputProps("email")}
        />

        {/* Password and Confirm Password */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 16, sm: 0 }}
          justify={"space-between"}
        >
          <PasswordInput
            w={{ base: "100%", sm: "45%" }}
            classNames={{ label: classes.label, input: classes.input }}
            label={"Password"}
            placeholder="Create a secure password"
            required
            {...form.getInputProps("password")}
          />
          <PasswordInput
            w={{ base: "100%", sm: "45%" }}
            classNames={{ label: classes.label, input: classes.input }}
            label={"Confirm Password"}
            placeholder="Repeat your password"
            required
            {...form.getInputProps("confirmPassword")}
          />
        </Flex>

        {/* Terms and Conditions */}
        <Checkbox
          classNames={{ label: classes.checkBoxLabel }}
          c={"black"}
          label={
            "By checking this box I am agreeing to the Terms of Service and Privacy Policy"
          }
          {...form.getInputProps("termsAccepted", { type: "checkbox" })}
        />

        {/* OTP Input */}
        {isOtpSent && (
          <Stack gap="xs" align="center">
            <Text
              size="md"
              fw={600}
              c="blue.5"
              className={classes.label}
              ta="center"
            >
              Enter Verification Code
            </Text>
            <Text size="sm" c="blue.7" mb="md" ta="center">
              We've sent a 6-digit verification code to{" "}
              <Text span fw={600} c="blue.5">
                {form.values.email}
              </Text>
            </Text>
            <PinInput
              length={6}
              value={otp}
              onChange={setOtp}
              size="md"
              radius="md"
              classNames={{ input: classes.input }}
              placeholder=""
            />
            <Text size="xs" c="blue.7" ta="center" mt="md">
              Didn't receive the code?{" "}
              <Text
                span
                c="blue.5"
                fw={600}
                style={{ cursor: "pointer" }}
                onClick={async () => {
                  await handleVerifyEmail(form.values);
                }}
              >
                Resend
              </Text>
            </Text>
          </Stack>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          color={"blue.5"}
          classNames={{ root: classes.btnRoot, inner: classes.btnLabel }}
          loading={isPending || isOtpVerificationPending}
        >
          {isOtpSent ? "Sign Up" : "Verify Email"}
        </Button>

        {/* Login Link */}
        <Flex
          justify={"center"}
          align="center"
          direction={{ base: "column", sm: "row" }}
          gap={{ base: 8, sm: 16 }}
        >
          <Text size="sm" fw={500} c={"black"}>
            Already have an account?{" "}
          </Text>
          <Link to={"/login"}>
            <Text size="sm" fw={600} c={"coral"}>
              Login here
            </Text>
          </Link>
        </Flex>

        {/* Social Login Options */}
        <Divider
          classNames={{ label: classes.divLabel }}
          my="xs"
          label="Or"
          labelPosition="center"
        />
        <Flex
          justify={"center"}
          direction={{ base: "column", md: "row" }}
          gap={{ base: 16, md: 40 }}
        >
          <Button
            classNames={{ root: classes.socialBtn }}
            w={{ base: "100%", md: "auto" }}
            size="md"
            h={{ base: "42px", md: "46px" }}
            bg={"white"}
            leftSection={<Image h={20} w={20} src={icons.GOOGLE} />}
            variant="default"
            c={"black"}
          >
            Continue with Google
          </Button>
          <Button
            classNames={{ root: classes.socialBtn }}
            w={{ base: "100%", md: "auto" }}
            size="md"
            h={{ base: "42px", md: "46px" }}
            bg={"white"}
            leftSection={<Image h={20} w={20} src={icons.APPLE} />}
            variant="default"
            c={"black"}
          >
            Continue with Apple
          </Button>
        </Flex>
      </Flex>
    </form>
  );
};

export default SignupForm;
