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
  Paper
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import classes from './index.module.scss'
import { Link, useNavigate } from 'react-router'
import icons from '../../../assets/icons'
import { useLogin } from '../../../hooks/api'
import type { LoginCredentials, AuthResponse } from '../../../models/user.model'
import { loginSchema, loginInitialValues } from '../../../forms'
import { showSuccess, showError, showInfo } from '../../../utils'
import { ROUTES } from '../../../routing/routes'

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const login = useLogin()
  
  const form = useForm({
    initialValues: loginInitialValues,
    validate: yupResolver(loginSchema)
  })

  const handleSubmit = async (values: typeof form.values) => {
    const loginData: LoginCredentials = {
      email: values.email,
      password: values.password
    }
    
    try {
      const response = await login.mutateAsync({
        email: loginData.email,
        password: loginData.password
      });

      if (response.status) {
        showSuccess("Login Successful!");
        const authResponse = response.data as AuthResponse;
        navigate(authResponse.isProfileComplete ? ROUTES.APP : ROUTES.PROFILE_COMPLETION);
      } else {
        showError(response.message);
      }
    } catch (error) {
      console.log(error);
      showError('An error occurred during login');
    }
  }

  return (
    <Paper 
      shadow="md" 
      radius="lg" 
      p="xl" 
      w={{ base: '90%', sm: '400px' }}
      className={classes.formContainer}
      bg="white"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction="column" gap={24}>
          <Text size="xl" fw={700} ta="center" mb={20} c="dark.8">
            Welcome back!
          </Text>
          
          <TextInput
            classNames={{ label: classes.label, input: classes.input }} 
            label="Email" 
            placeholder="Enter your email"
            radius="md"
            size="md"
            required
            {...form.getInputProps('email')}
          />
          
          <PasswordInput 
            classNames={{ label: classes.label, input: classes.input }} 
            label="Password"
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
              label="Remember me"
              c="dark.8"
            />
            <Link to={ROUTES.FORGOT_PASSWORD}>
              <Text 
                fz={14} 
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
          
          <Flex justify="center" align="center" gap={8}>
            <Text c="dark.8" fz={14}>Don't have an account?</Text>
            <Link to={ROUTES.SIGNUP}>
              <Text 
                fz={14} 
                fw={700} 
                c="#e5383b"
                className={classes.linkText}
              >
                Sign up
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
            justify="center" 
            gap={16}
          >
            <Button 
              classNames={{ root: classes.socialBtn }} 
              w="100%"
              h={48}
              bg="white" 
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
              w="100%"
              h={48}
              bg="white" 
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
        </Flex>
      </form>
    </Paper>
  )
}

export default LoginForm