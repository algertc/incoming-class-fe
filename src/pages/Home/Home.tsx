import React from 'react'
import { Text, Container, Title } from '@mantine/core'

const Home: React.FC = () => {
  return (
    <Container py="xl">
      <Title order={1} mb="md" ta="center">Welcome to InClass</Title>
      <Text size="lg" ta="center" c="dimmed">
        Your platform for exploring educational opportunities
      </Text>
    </Container>
  )
}

export default Home