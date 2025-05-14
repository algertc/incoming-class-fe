import React from 'react'
import { Container, TextInput, PasswordInput, Button, Paper, Stack, Title } from '@mantine/core'

const Login: React.FC = () => {
  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg" c="blue">
          Login to InClass
        </Title>
        <form>
          <Stack>
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
            />
            <Button type="submit" color="blue" mt="md" fullWidth>
              Sign in
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default Login