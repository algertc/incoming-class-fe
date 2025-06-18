import React, { useState, type FormEvent } from "react";
import {
  Button,
  Stack,
  Text,
  Box,
  Group,
  Alert,
  useMantineTheme,
} from "@mantine/core";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { IconAlertCircle, IconShield } from "@tabler/icons-react";
import stripeConfig from "../../../config/stripe.config";

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  onSuccess,
  onError,
  onCancel,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const theme = useMantineTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you`,
        },
        ...stripeConfig.confirmationOptions,
      });

      if (error) {
        // Payment failed
        const message = error.message || "Payment failed. Please try again.";
        setErrorMessage(message);
        onError(message);
      } else {
        // Payment succeeded
        onSuccess();
      }
    } catch {
      const message = "An unexpected error occurred. Please try again.";
      setErrorMessage(message);
      onError(message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {/* Payment Summary */}
        <Box
          p="md"
          style={{
            background: theme.colors.dark[6],
            borderRadius: theme.radius.md,
          }}
        >
          <Group justify="space-between">
            <Text size="sm">Instagram Feature Post</Text>
            <Text fw={600}>${amount.toFixed(2)}</Text>
          </Group>
        </Box>

        {/* Payment Element */}
        <Box>
          <Text size="sm" fw={500} mb="xs">
            Payment Information
          </Text>
          <Box
            p="md"
            style={{
              border: `1px solid ${theme.colors.dark[4]}`,
              borderRadius: theme.radius.md,
              background: theme.colors.dark[7],
            }}
          >
            <PaymentElement
              options={stripeConfig.paymentElementOptions}
            />
          </Box>
        </Box>

        {/* Error Display */}
        {errorMessage && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            variant="light"
          >
            {errorMessage}
          </Alert>
        )}

        {/* Security Notice */}
        <Text size="xs" c="dimmed" ta="center">
          <IconShield
            size={12}
            style={{ display: "inline", marginRight: 4 }}
          />
          Your payment information is secure and encrypted
        </Text>

        {/* Action Buttons */}
        <Group justify="space-between" mt="md">
          <Button
            variant="subtle"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isProcessing}
            disabled={!stripe || isProcessing}
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            {isProcessing ? "Processing..." : `Pay $${amount.toFixed(2)}`}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CheckoutForm; 