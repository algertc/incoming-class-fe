import React from 'react';
import { 
  Box, 
  Container, 
  Group,
  Text, 
  Title,
  ActionIcon,
  Flex,
  useMantineTheme
} from '@mantine/core';
import { IconBrandTwitter, IconBrandInstagram, IconBrandFacebook } from '@tabler/icons-react';

export const Footer: React.FC = () => {
  const theme = useMantineTheme();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <Box bg={theme.colors.dark[8]} py={{ base: 30, md: 40 }}>
      <Container size="xl">
        <Flex 
          direction={{ base: 'column', sm: 'row' }}
          justify={{ sm: 'space-between' }}
          align={{ base: 'center', sm: 'flex-start' }}
          gap={20}
          mb={30}
        >
          <Box ta={{ base: 'center', sm: 'left' }} maw={300} miw={{ sm: 200 }}>
            <Title order={4} c={theme.white} mb="xs">CollegeConnect</Title>
            <Text size="sm" c="dimmed">
              Connecting college students before they step on campus.
            </Text>
          </Box>
          
          <Flex 
            gap={{ base: 40, md: 60 }}
            wrap="wrap"
            justify="center"
          >
            <Box>
              <Title order={5} c={theme.white} mb="xs" ta={{ base: 'center', sm: 'left' }}>Links</Title>
              <Flex gap={15} direction={{ base: 'row', xs: 'column' }} wrap="wrap" justify={{ base: 'center', sm: 'flex-start' }}>
                <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>About</Text>
                <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Features</Text>
                <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Schools</Text>
                <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Contact</Text>
              </Flex>
            </Box>
            
            <Box>
              <Title order={5} c={theme.white} mb="xs" ta={{ base: 'center', sm: 'left' }}>Legal</Title>
              <Flex gap={15} direction={{ base: 'row', xs: 'column' }} wrap="wrap" justify={{ base: 'center', sm: 'flex-start' }}>
                <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Privacy</Text>
                <Text size="sm" c="dimmed" style={{ cursor: 'pointer' }}>Terms</Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
        
        <Box
          style={{ 
            borderTop: `1px solid ${theme.colors.dark[6]}`,
            paddingTop: 20
          }}
        >
          <Flex 
            justify="space-between" 
            align="center" 
            direction={{ base: 'column', sm: 'row' }}
            gap={{ base: 20, sm: 0 }}
          >
            <Text size="xs" c="dimmed">
              © {currentYear} CollegeConnect. All rights reserved.
            </Text>
            
            <Group gap="md">
              <ActionIcon size="md" variant="subtle" radius="xl" color="blue">
                <IconBrandTwitter size={18} />
              </ActionIcon>
              <ActionIcon size="md" variant="subtle" radius="xl" color="blue">
                <IconBrandInstagram size={18} />
              </ActionIcon>
              <ActionIcon size="md" variant="subtle" radius="xl" color="blue">
                <IconBrandFacebook size={18} />
              </ActionIcon>
            </Group>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 