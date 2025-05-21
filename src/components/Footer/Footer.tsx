import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Group,
  Stack, 
  Text, 
  Title,
  ActionIcon,
  useMantineTheme
} from '@mantine/core';
import { IconBrandTwitter, IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react';

export const Footer: React.FC = () => {
  const theme = useMantineTheme();
  
  return (
    <Box bg={theme.colors.dark[8]} py={50}>
      <Container size="xl">
        <Grid mb={40}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Title order={4} c={theme.white} mb="xs">CollegeConnect</Title>
              <Text size="sm" c="dimmed" maw={300}>
                Connecting college students before they even step on campus. Find roommates, make friends, and start your college journey right.
              </Text>
              <Group mt="md" gap="xs">
                <ActionIcon size="lg" variant="filled" radius="xl" color="blue">
                  <IconBrandTwitter size={18} />
                </ActionIcon>
                <ActionIcon size="lg" variant="filled" radius="xl" color="blue">
                  <IconBrandInstagram size={18} />
                </ActionIcon>
                <ActionIcon size="lg" variant="filled" radius="xl" color="blue">
                  <IconBrandFacebook size={18} />
                </ActionIcon>
              </Group>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Title order={5} c={theme.white} mb="md">Product</Title>
            <Stack gap={8}>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Features</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Pricing</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Schools</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Testimonials</Text>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Title order={5} c={theme.white} mb="md">Company</Title>
            <Stack gap={8}>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>About</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Careers</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Blog</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Press</Text>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Title order={5} c={theme.white} mb="md">Support</Title>
            <Stack gap={8}>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Contact</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>FAQ</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Privacy</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Terms</Text>
            </Stack>
          </Grid.Col>
          
          <Grid.Col span={{ base: 6, md: 2 }}>
            <Title order={5} c={theme.white} mb="md">Resources</Title>
            <Stack gap={8}>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Campus Guides</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Roommate Tips</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Dorm Essentials</Text>
              <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Student Discounts</Text>
            </Stack>
          </Grid.Col>
        </Grid>
        
        <Box
          style={{ 
            borderTop: `1px solid ${theme.colors.dark[6]}`,
            paddingTop: 20,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10
          }}
        >
          <Text size="xs" c="dimmed">
            © 2023 CollegeConnect. All rights reserved.
          </Text>
          <Group gap="md">
            <Text size="xs" c="dimmed" style={{ cursor: 'pointer' }}>Privacy Policy</Text>
            <Text size="xs" c="dimmed" style={{ cursor: 'pointer' }}>Terms of Service</Text>
            <Text size="xs" c="dimmed" style={{ cursor: 'pointer' }}>Cookie Policy</Text>
          </Group>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 