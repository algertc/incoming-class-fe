import React from 'react'
import { Card, Flex, Stack, Title, Text } from '@mantine/core'
import Logo from '../../components/Header/Logo'
import LoginForm from './LoginForm/LoginForm'

const Login: React.FC = () => {
  return (
    <Card
      shadow="xs"
      p="md"
      w="100%" 
      bg={"white"}
    >
      <Flex
        direction="column"
        justify="flex-start"
        align="center"
        gap="md"
      
      >
        <Logo />
        <Stack gap="xs" align="center">
          <Title order={1} size="h3" c="black">Welcome back</Title>
          <Text size="md" c="black">Please enter your details to login</Text>
        </Stack>
        <LoginForm />
      </Flex>
    </Card>
  )
}

export default Login