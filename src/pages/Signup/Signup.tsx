import React from 'react'
import { Container, TextInput, PasswordInput, Button, Paper, Stack, Title, Divider } from '@mantine/core'

const Signup: React.FC = () => {
  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="md">
        <Title order={2} ta="center" mb="lg" c="blue">
          Create an Account
        </Title>
        <form>
          <Stack>
            <TextInput
              label="Name"
              placeholder="Your full name"
              required
            />
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
            />
            <PasswordInput
              label="Password"
              placeholder="Create a password"
              required
            />
            <PasswordInput
              label="Confirm Password"
              placeholder="Confirm your password"
              required
            />
            <Divider my="xs" />
            <Button type="submit" color="blue" mt="md" fullWidth>
              Sign up
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default Signup
