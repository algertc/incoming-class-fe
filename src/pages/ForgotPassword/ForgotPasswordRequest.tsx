import React, { useState } from 'react'
import { 
  Button, 
  Flex, 
  Text, 
  TextInput,
  Paper,
  Box,
  Title,
  Alert
} from '@mantine/core'
import { Link } from 'react-router'
import classes from './styles.module.scss'
import { IconArrowLeft, IconMail } from '@tabler/icons-react'

const ForgotPasswordRequest: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  
  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setRequestSent(true);
    }, 1500);
  };
  
  return (
    <Paper 
      p="xl" 
      radius="md" 
      shadow="md" 
      bg="white" 
      className={classes.formContainer}
    >
      <form onSubmit={handleSendOTP}>
        <Flex direction={"column"} gap={{ base: 20, md: 24 }}>
          <Box>
            <Link to="/login">
              <Text 
                fz={{ base: "14px", md: "16px" }} 
                fw={500} 
                c="#4361ee"
                className={classes.linkText}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                <IconArrowLeft size={16} />
                Back to login
              </Text>
            </Link>
            <Title order={3} mb="sm" mt="md">Reset Your Password</Title>
            <Text size="sm" c="dimmed" mb="lg">
              Enter your email address and we'll send you a one-time password (OTP) to reset your password.
            </Text>
          </Box>
          
          {requestSent ? (
            <Alert 
              icon={<IconMail size={16} />} 
              title="Check your email" 
              color="blue" 
              radius="md"
            >
              We've sent a one-time password (OTP) to <b>{email}</b>. Please check your inbox and proceed to the next step.
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
                error={email === '' ? '' : !email.includes('@') ? 'Please enter a valid email' : null}
              />
              
              <Button 
                type="submit"
                color="#4361ee"
                radius="md"
                size="lg"
                fullWidth
                loading={isLoading}
                className={classes.primaryButton}
                disabled={!email || !email.includes('@')}
              >
                Send OTP
              </Button>
            </>
          )}
          
          <Box style={{ marginTop: '16px', textAlign: 'center' }}>
            <Text size="sm" c="dimmed">
              Remember your password?{' '}
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
    </Paper>
  )
}

export default ForgotPasswordRequest 