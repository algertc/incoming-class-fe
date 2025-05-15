import React from 'react'
import { Button, Checkbox, Divider, Flex, Image, Text, TextInput, PasswordInput } from '@mantine/core'
import classes from './index.module.scss'
import { Link } from 'react-router'
import icons from '../../../assets/icons'

const LoginForm: React.FC = () => {
  return (
    <form>
      <Flex direction={"column"} gap={{ base: 16, md: 20 }}>
        <TextInput
          classNames={{ label: classes.label, input: classes.input,  }} 
          label={"Email"} 
          placeholder="Enter your email"
        />
        <PasswordInput 
          classNames={{ label: classes.label, input: classes.input }} 
          label={"Password"}
          placeholder="Enter your password" 
        />
        
        <Flex justify="space-between" align="center">
          <Checkbox 
            classNames={{ label: classes.checkBoxLabel }} 
            c={"black"} 
            label={"Remember me"}
          />
          <Link to="/forgot-password">
            <Text fz={{ base: "14px", md: "16px" }} fw={500} c={"coral"}>Forgot password?</Text>
          </Link>
        </Flex>
        
        <Button 
          color={"blue.5"} 
          classNames={{ root: classes.btnRoot, inner: classes.btnLabel }}
        >
          Log In
        </Button>
        
        <Flex justify={"center"} align="center" direction={{ base: "column", sm: "row" }} gap={{ base: 8, sm: 16 }}>
          <Text fz={{ base: "16px", md: "h4" }} fw={600} c={"black"}>Don't have an account? </Text>
          <Link to={"/signup"}>
            <Text fz={{ base: "16px", md: "h4" }} fw={600} c={"coral"}>Sign up here</Text>
          </Link>
        </Flex>
        
        <Divider classNames={{ label: classes.divLabel }} my="xs" label="Or" labelPosition="center" />
        
        <Flex 
          justify={"center"} 
          direction={{ base: "column", md: "row" }} 
          gap={{ base: 16, md: 40 }}
        >
          <Button 
            classNames={{ root: classes.socialBtn }} 
            w={{ base: "100%", md: "auto" }}
            fz={{ base: "16px", md: "18px" }} 
            h={{ base: "48px", md: "56px" }} 
            bg={"white"} 
            leftSection={<Image h={24} w={24} src={icons.GOOGLE} />} 
            variant="default" 
            c={"black"}
          >
            Continue with Google
          </Button>
          <Button 
            classNames={{ root: classes.socialBtn }} 
            w={{ base: "100%", md: "auto" }}
            fz={{ base: "16px", md: "18px" }} 
            h={{ base: "48px", md: "56px" }} 
            bg={"white"} 
            leftSection={<Image h={24} w={24} src={icons.APPLE} />} 
            variant="default" 
            c={"black"}
          >
            Continue with Apple
          </Button>
        </Flex>
      </Flex>
    </form>
  )
}

export default LoginForm