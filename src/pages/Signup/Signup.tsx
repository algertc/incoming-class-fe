import React from 'react'
import { Card, Flex, Stack, Title, Text } from '@mantine/core'
import Logo from '../../components/Header/Logo'
import SignupForm from './SignupForm/SignupForm'

const Signup: React.FC = () => {
  return (
    <Card
      shadow="xs"
      p="md"
      w="100%"
      h="100%"
      bg={"white"}
    >
      <Flex
        direction="column"
        justify="flex-start"
        align="center"
        gap="xl"
      >
        <Logo />
        <Stack gap="xs" align="center">
          <Title order={1} size="h1" c="black">Welcome, sign up to continue</Title>
          <Text size="h2" c="dark">Please enter your details</Text>
        </Stack>
        <SignupForm />
      </Flex>
    </Card>
  )
}

export default Signup
