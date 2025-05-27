import React from 'react'
import { Text, Container, Title, SimpleGrid, Card, Image, Badge, Group, Button } from '@mantine/core'

const CollegesPage: React.FC = () => {
  // Sample colleges data (in a real app, this would come from an API)
  const colleges = [
    {
      id: 1,
      name: 'Harvard University',
      location: 'Cambridge, MA',
      image: 'https://images.unsplash.com/photo-1583656696771-8f8483c48072',
      tags: ['Ivy League', 'Research'],
      deadline: 'Dec 15, 2023'
    },
    {
      id: 2,
      name: 'Stanford University',
      location: 'Stanford, CA',
      image: 'https://images.unsplash.com/photo-1602560623440-ef54db76c1e8',
      tags: ['Research', 'Tech'],
      deadline: 'Jan 2, 2024'
    },
    {
      id: 3,
      name: 'MIT',
      location: 'Cambridge, MA',
      image: 'https://images.unsplash.com/photo-1571168072506-11bce9619c9c',
      tags: ['Engineering', 'Tech'],
      deadline: 'Jan 5, 2024'
    },
    {
      id: 4,
      name: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      image: 'https://images.unsplash.com/photo-1616516114086-275cfebcc3a3',
      tags: ['Public', 'Research'],
      deadline: 'Nov 30, 2023'
    }
  ]
  
  return (
    <Container py="xl">
      <Title order={1} mb={8} ta="center">Explore Colleges</Title>
      <Text size="lg" ta="center" c="dimmed" mb={40}>
        Discover top universities and find your perfect match
      </Text>
      
      <SimpleGrid 
        cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
        spacing={{ base: 16, sm: 24 }}
      >
        {colleges.map((college) => (
          <Card 
            key={college.id} 
            shadow="sm" 
            padding="lg" 
            radius="md" 
            withBorder
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              height: '100%',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            <Card.Section>
              <Image
                src={college.image}
                height={160}
                alt={college.name}
              />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
              <Title order={5}>{college.name}</Title>
            </Group>

            <Text size="sm" color="dimmed" mb={8}>
              {college.location}
            </Text>
            
            <Group gap={8} mb={16}>
              {college.tags.map((tag) => (
                <Badge key={tag} color="blue" variant="light">
                  {tag}
                </Badge>
              ))}
            </Group>
            
            <Text size="xs" mb={16} c="dimmed">
              <strong>Application Deadline:</strong> {college.deadline}
            </Text>
            
            <Button variant="light" color="blue" fullWidth mt="auto">
              View Details
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  )
}

export default CollegesPage 