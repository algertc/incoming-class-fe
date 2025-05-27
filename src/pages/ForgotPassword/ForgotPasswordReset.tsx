import React, { useState } from 'react'
import { 
  Button, 
  Flex, 
  Text, 
  Box,
  Title,
  Alert,
  PinInput,
  PasswordInput,
  Group
} from '@mantine/core'
import { Link, useNavigate } from 'react-router'
import classes from './styles.module.scss'
import { IconArrowLeft, IconCheck, IconLock } from '@tabler/icons-react'

const ForgotPasswordReset: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const navigate = useNavigate();
  
  const passwordError = password.length > 0 && password.length < 8 
    ? 'Password must be at least 8 characters' 
    : null;
  
  const confirmPasswordError = confirmPassword.length > 0 && password !== confirmPassword
    ? 'Passwords do not match'
    : null;
  
  const isFormValid = 
    otp.length === 6 && 
    password.length >= 8 && 
    password === confirmPassword;
  
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setResetComplete(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    }, 1500);
  };
  
  return (
    <Box style={{ width: "100%", height: "100%", maxHeight: "700px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <Box className={classes.formContainer}>
        <form onSubmit={handleResetPassword}>
          <Flex direction={"column"} gap={{ base: 20, md: 24 }}>
            <Box>
              <Link to="/forgot-password">
                <Text 
                  fz={{ base: "14px", md: "16px" }} 
                  fw={500} 
                  c="#4361ee"
                  className={classes.linkText}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  <IconArrowLeft size={16} />
                  Back to reset request
                </Text>
              </Link>
              <Title order={3} mb="sm" mt="md" className={classes.formTitle}>Reset Your Password</Title>
              <Text size="sm" className={classes.formText} mb="lg">
                Enter the verification code sent to your email and create a new password.
              </Text>
            </Box>
            
            {resetComplete ? (
              <Alert 
                icon={<IconCheck size={16} />} 
                title="Password Reset Complete" 
                color="green" 
                radius="md"
              >
                Your password has been successfully reset. You will be redirected to the login page shortly.
              </Alert>
            ) : (
              <>
                <Box>
                  <Text className={classes.label} component="label" htmlFor="otp">
                    Verification Code
                  </Text>
                  <Group justify="center" mt="xs">
                    <PinInput 
                      id="otp"
                      length={6} 
                      size="md" 
                      radius="md"
                      value={otp}
                      onChange={setOtp}
                      inputMode="numeric"
                      oneTimeCode
                      aria-label="Verification code"
                      classNames={{ input: classes.input }}
                    />
                  </Group>
                </Box>
                
                <PasswordInput 
                  classNames={{ label: classes.label, input: classes.input }} 
                  label={"New Password"} 
                  placeholder="Enter new password"
                  radius="md"
                  size="md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={passwordError}
                  leftSection={<IconLock size={16} />}
                />
                
                <PasswordInput 
                  classNames={{ label: classes.label, input: classes.input }} 
                  label={"Confirm Password"} 
                  placeholder="Confirm new password"
                  radius="md"
                  size="md"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={confirmPasswordError}
                  leftSection={<IconLock size={16} />}
                />
                
                <Button 
                  type="submit"
                  color="#4361ee"
                  radius="md"
                  size="lg"
                  fullWidth
                  loading={isLoading}
                  className={classes.primaryButton}
                  disabled={!isFormValid}
                >
                  Reset Password
                </Button>
              </>
            )}
            
            <Box style={{ marginTop: '16px', textAlign: 'center' }}>
              <Text size="sm" className={classes.formText}>
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
            
            {/* Decorative elements */}
            <Box className={classes.decorativeCircle1} />
            <Box className={classes.decorativeCircle2} />
          </Flex>
        </form>
      </Box>
    </Box>
  )
}

export default ForgotPasswordReset 