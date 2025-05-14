import React from 'react'
import { Text, Container, Title } from '@mantine/core'

const Colleges: React.FC = () => {
  return (
    <Container py="xl">
      <Title order={1} mb="md" ta="center">Colleges</Title>
      <Text size="lg" ta="center" c="dimmed">
        Explore colleges and universities here
      </Text>
    </Container>
  )
}

export default Colleges 