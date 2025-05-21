import React, { useState } from 'react';
import {
  Group,
  Button,
  Stack,
  Text,
  rem,
  useMantineTheme,
  Paper,
  TextInput,
  NumberInput,
  Divider,
  Box,
  Alert,
} from '@mantine/core';
import { IconCreditCard, IconAlertCircle } from '@tabler/icons-react';
import { useForm } from '@mantine/form';

interface PaymentProps {
  onComplete: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onComplete }) => {
  const theme = useMantineTheme();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      name: '',
    },
    validate: {
      cardNumber: (value) => {
        if (!value) return 'Card number is required';
        if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) return 'Invalid card number';
        return null;
      },
      expiryDate: (value) => {
        if (!value) return 'Expiry date is required';
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return 'Invalid expiry date (MM/YY)';
        return null;
      },
      cvc: (value) => {
        if (!value) return 'CVC is required';
        if (!/^\d{3,4}$/.test(value)) return 'Invalid CVC';
        return null;
      },
      name: (value) => (!value ? 'Name is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsProcessing(true);
    setError(null);
    try {
      // TODO: Integrate with Stripe
      console.log(values);
      onComplete();
    } catch (error) {
      setError('Payment failed. Please try again.');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <Stack gap="xl">
      <Text
        size="lg"
        fw={600}
        style={{
          color: theme.white,
          textAlign: 'center',
        }}
      >
        Complete Your Profile
      </Text>

      <Paper
        p="xl"
        radius="md"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Stack gap="md">
          <Group>
            <IconCreditCard
              style={{ width: rem(24), height: rem(24), color: theme.white }}
            />
            <Text fw={600} style={{ color: theme.white }}>
              Payment Details
            </Text>
          </Group>

          <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          {error && (
            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Error"
              color="red"
              variant="filled"
            >
              {error}
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                required
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                leftSection={<IconCreditCard style={{ width: rem(16), height: rem(16) }} />}
                {...form.getInputProps('cardNumber')}
                onChange={(event) => {
                  const formatted = formatCardNumber(event.currentTarget.value);
                  form.setFieldValue('cardNumber', formatted);
                }}
                maxLength={19}
                styles={{
                  label: { color: theme.white },
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: theme.white,
                    '&::placeholder': { color: theme.colors.gray[5] },
                  },
                }}
              />

              <Group grow>
                <TextInput
                  required
                  label="Expiry Date"
                  placeholder="MM/YY"
                  {...form.getInputProps('expiryDate')}
                  onChange={(event) => {
                    const formatted = formatExpiryDate(event.currentTarget.value);
                    form.setFieldValue('expiryDate', formatted);
                  }}
                  maxLength={5}
                  styles={{
                    label: { color: theme.white },
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: theme.white,
                      '&::placeholder': { color: theme.colors.gray[5] },
                    },
                  }}
                />

                <TextInput
                  required
                  label="CVC"
                  placeholder="123"
                  {...form.getInputProps('cvc')}
                  maxLength={4}
                  styles={{
                    label: { color: theme.white },
                    input: {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      color: theme.white,
                      '&::placeholder': { color: theme.colors.gray[5] },
                    },
                  }}
                />
              </Group>

              <TextInput
                required
                label="Name on Card"
                placeholder="John Doe"
                {...form.getInputProps('name')}
                styles={{
                  label: { color: theme.white },
                  input: {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    color: theme.white,
                    '&::placeholder': { color: theme.colors.gray[5] },
                  },
                }}
              />

              <Box
                p="md"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: theme.radius.md,
                }}
              >
                <Group justify="space-between" mb="xs">
                  <Text style={{ color: theme.white }}>Profile Completion</Text>
                  <Text fw={600} style={{ color: theme.white }}>
                    $9.99
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text style={{ color: theme.white }}>Tax</Text>
                  <Text fw={600} style={{ color: theme.white }}>
                    $0.00
                  </Text>
                </Group>
                <Divider my="sm" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <Group justify="space-between">
                  <Text fw={600} style={{ color: theme.white }}>
                    Total
                  </Text>
                  <Text fw={600} style={{ color: theme.white }}>
                    $9.99
                  </Text>
                </Group>
              </Box>

              <Button
                type="submit"
                size="lg"
                loading={isProcessing}
                style={{
                  background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #FF5252, #3DBEB6)',
                  },
                }}
              >
                Complete Payment
              </Button>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Payment; 