import React from 'react'
import { 
  Button, 
  Checkbox, 
  Divider, 
  Flex, 
  Image, 
  Text, 
  TextInput, 
  PasswordInput,
  Box,
  Container
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import classes from './index.module.scss'
import { Link } from 'react-router'
import icons from '../../../assets/icons'
import { useLogin } from '../../../hooks/api'
import type { LoginCredentials } from '../../../models/user.model'
import { loginSchema, loginInitialValues } from '../../../forms'
import { showSuccess, showError, showInfo } from '../../../utils'

const LoginForm: React.FC = () => {
  // Use the login mutation hook
  const login = useLogin()
  
  // Initialize form with Mantine useForm and yupResolver
  const form = useForm({
    initialValues: loginInitialValues,
    validate: yupResolver(loginSchema)
  })

  // Form submission handler
  const handleSubmit = (values: typeof form.values) => {
    // Call the login mutation with the form values
    const loginData: LoginCredentials = {
      email: values.email,
      password: values.password
    }
    
    console.log("Login form", loginData)
    
    // Uncomment in production
    // login.mutate(loginData, {
    //   onSuccess: (response) => {
    //     if (response.status) {
    //       showSuccess('You have successfully logged in');
    //     } else {
    //       showError(response.message || 'Login failed');
    //     }
    //   },
    //   onError: (error) => {
    //     showError(error instanceof Error ? error.message : 'An error occurred during login');
    //   }
    // });
    
    // For demo purposes only
    setTimeout(() => {
      if (values.email === 'demo@example.com' && values.password === 'password') {
        showSuccess('You have successfully logged in');
      } else {
        showError('Invalid email or password');
      }
    }, 2000);
  }

  return (
    <Container 
    size={"100%"}
    w={"100%"}
    className={classes.formContainer}
    >
      <form style={{width:"100%"}} onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction={"column"} gap={{ base: 20, md: 24 }}>
          {/* API errors are now handled through notifications */}
        
          <TextInput
            classNames={{ label: classes.label, input: classes.input }} 
            label={"Email"} 
            placeholder="Enter your email"
            radius="md"
            size="md"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput 
            classNames={{ label: classes.label, input: classes.input }} 
            label={"Password"}
            placeholder="Enter your password" 
            radius="md"
            size="md"
            required
            {...form.getInputProps('password')}
          />
          
          <Flex justify="space-between" align="center">
            <Checkbox 
              classNames={{ label: classes.checkBoxLabel }} 
              color="blue"
              label={"Remember me"}
              c={"black"}
            />
            <Link to="/forgot-password">
              <Text 
                fz={{ base: "14px", md: "16px" }} 
                fw={500} 
                c="#4361ee"
                className={classes.linkText}
              >
                Forgot password?
              </Text>
            </Link>
          </Flex>
          
          <Button 
            type="submit"
            color="#4361ee"
            radius="md"
            size="lg"
            fullWidth
            classNames={{ root: classes.btnRoot, inner: classes.btnLabel }}
            className={classes.primaryButton}
            loading={login.isPending}
          >
            Log In
          </Button>
          
          <Flex justify={"center"} align="center" direction={{ base: "column", sm: "row" }} gap={{ base: 8, sm: 16 }}>
            <Text c={"black"} fz={{ base: "16px", md: "18px" }} fw={500}>Don't have an account? </Text>
            <Link to={"/signup"}>
              <Text 
                fz={{ base: "16px", md: "18px" }} 
                fw={700} 
                c="#e5383b"
                className={classes.linkText}
              >
                Sign up here
              </Text>
            </Link>
          </Flex>
          
          <Divider 
            my="xs" 
            label="Or continue with" 
            labelPosition="center"
            color="gray.3"
            
          />
          
          <Flex 
            justify={"center"} 
            direction={{ base: "column", md: "row" }} 
            gap={{ base: 16, md: 20 }}
          >
            <Button 
              classNames={{ root: classes.socialBtn }} 
              w={{ base: "100%", md: "auto" }}
              fz={{ base: "16px", md: "16px" }} 
              h={{ base: "48px", md: "50px" }} 
              bg={"white"} 
              leftSection={<Image h={20} w={20} src={icons.GOOGLE} />} 
              variant="default" 
              radius="xl"
              c="dark.8"
              className={classes.socialButton}
              onClick={() => showInfo('Google login is not implemented yet')}
            >
              Google
            </Button>
            <Button 
              classNames={{ root: classes.socialBtn }} 
              w={{ base: "100%", md: "auto" }}
              fz={{ base: "16px", md: "16px" }} 
              h={{ base: "48px", md: "50px" }} 
              bg={"white"} 
              leftSection={<Image h={20} w={20} src={icons.APPLE} />} 
              variant="default" 
              radius="xl"
              c="dark.8"
              className={classes.socialButton}
              onClick={() => showInfo('Apple login is not implemented yet')}
            >
              Apple
            </Button>
          </Flex>
          
          {/* Decorative elements to match the landing page theme */}
          <Box className={classes.decorativeCircle1} />
          <Box className={classes.decorativeCircle2} />
        </Flex>
      </form>
    </Container>
  )
}

export default LoginForm