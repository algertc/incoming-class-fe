import React from 'react'
import { Card, Flex, Stack, Title, Text } from '@mantine/core'
import Logo from '../../components/Header/Logo'
import ForgotPasswordRequest from './ForgotPasswordRequest'
import ForgotPasswordReset from './ForgotPasswordReset'
import { useLocation } from 'react-router'

const ForgotPassword: React.FC = () => {
  const location = useLocation();
  const isResetStep = location.pathname.includes('/reset');
  
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
        gap="md"
      >
        <Logo />
        <Stack gap="xs" align="center">
          <Title order={1} size="h3" c="black">Password Recovery</Title>
          <Text size="md" c="black">
            {isResetStep ? 'Enter your verification code' : 'Get back into your account'}
          </Text>
        </Stack>
        {isResetStep ? <ForgotPasswordReset /> : <ForgotPasswordRequest />}
      </Flex>
    </Card>
  )
}

export default ForgotPassword 