import { useState } from 'react'
import { 
  Box, 
  Button, 
  Container, 
  Flex, 
  Grid, 
  Group,
  Image, 
  Paper,
  Stack, 
  Text, 
  Title,
  TextInput,
  Select,
  Badge,
  Divider,
  Kbd
} from '@mantine/core'
import { useHover } from '@mantine/hooks'

// Mock data for colleges
const COLLEGES = [
  { value: 'harvard', label: 'Harvard University', count: 1240 },
  { value: 'mit', label: 'MIT', count: 987 },
  { value: 'stanford', label: 'Stanford University', count: 1532 },
  { value: 'yale', label: 'Yale University', count: 845 },
  { value: 'columbia', label: 'Columbia University', count: 936 },
  { value: 'princeton', label: 'Princeton University', count: 742 },
  { value: 'berkeley', label: 'UC Berkeley', count: 2154 },
  { value: 'ucla', label: 'UCLA', count: 1891 }
]

// Mock data for testimonials
const TESTIMONIALS = [
  { 
    name: 'Alex J.', 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    college: 'Harvard University',
    text: 'Found my roommate and best friend before even stepping on campus! This platform is a lifesaver!'
  },
  { 
    name: 'Maya L.', 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    college: 'Stanford University',
    text: 'Connected with people in my major and already have study buddies lined up. So clutch!' 
  },
  { 
    name: 'Carlos R.', 
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    college: 'UC Berkeley',
    text: 'The AI matching is scary accurate! Found people with the exact same interests and vibe as me.'
  }
]

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  const { hovered, ref } = useHover();
  
  return (
    <Paper
      ref={ref}
      p="xl"
      radius="md"
      style={{
        height: '100%',
        backgroundColor: hovered ? 'rgba(0, 71, 171, 0.03)' : '#111',
        border: `1px solid ${hovered ? '#0047AB' : 'rgba(255, 255, 255, 0.1)'}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        transform: hovered ? 'translateY(-8px)' : 'none',
      }}
    >
      <Stack gap="md" align="center">
        <Text size="xxl" style={{ fontSize: 48 }}>
          {icon}
        </Text>
        <Title order={3} fw={700} c="white" ta="center">
          {title}
        </Title>
        <Text c="dimmed" size="md" ta="center">
          {description}
        </Text>
      </Stack>
    </Paper>
  )
}

const StepCard: React.FC<{ number: number; title: string; description: string }> = ({ 
  number, title, description 
}) => {
  return (
    <Paper
      p="lg"
      radius="md"
      style={{
        backgroundColor: '#111',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: -15,
          left: -15,
          width: 60,
          height: 60,
          borderRadius: '50%',
          backgroundColor: '#0047AB',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1
        }}
      >
        <Text fw={700} size="xl" c="white">
          {number}
        </Text>
      </Box>
      
      <Stack gap="sm" pl={40} pt={15}>
        <Title order={4} c="white">
          {title}
        </Title>
        <Text c="dimmed" size="sm">
          {description}
        </Text>
      </Stack>
    </Paper>
  )
}

const TestimonialCard: React.FC<{ 
  name: string; 
  image: string; 
  college: string; 
  text: string 
}> = ({ name, image, college, text }) => {
  return (
    <Paper
      p="lg"
      radius="md"
      style={{
        backgroundColor: '#111',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        height: '100%',
      }}
    >
      <Stack gap="md">
        <Group justify="apart">
          <Group>
            <Image
              src={image}
              width={50}
              height={50}
              radius="xl"
            />
            <Box>
              <Text fw={600} c="white">{name}</Text>
              <Text size="xs" c="dimmed">{college}</Text>
            </Box>
          </Group>
          <Text size="xl">🔥</Text>
        </Group>
        <Text c="white" fz="md" style={{ fontStyle: 'italic' }}>"{text}"</Text>
      </Stack>
    </Paper>
  )
}

const CollegeCard: React.FC<{ name: string; count: number }> = ({ name, count }) => {
  const { hovered, ref } = useHover();
  
  return (
    <Paper
      ref={ref}
      p="md"
      radius="md"
      style={{
        backgroundColor: hovered ? 'rgba(0, 71, 171, 0.1)' : '#111', 
        border: `1px solid ${hovered ? '#0047AB' : 'rgba(255, 255, 255, 0.1)'}`,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
      }}
    >
      <Stack gap="xs" align="center">
        <Text fw={600} c="white" ta="center">{name}</Text>
        <Badge 
          variant="filled" 
          color={hovered ? '#0047AB' : 'gray'}
          radius="sm"
        >
          {count} students
        </Badge>
      </Stack>
    </Paper>
  )
}

const Home: React.FC = () => {
  const [selectedCollege, setSelectedCollege] = useState<string | null>(null);
  const [email, setEmail] = useState('');

  return (
    <Box 
      style={{
        backgroundColor: 'black',
        color: 'white',
        minHeight: '100vh'
      }}
    >
      {/* Hero Section */}
      <Container size="xl" py={80}>
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          gap={{ base: 40, md: 60 }}
          align="center" 
          justify="space-between"
        >
          <Box w={{ base: '100%', md: '50%' }}>
            <Badge 
              variant="filled" 
              color="#0047AB"
              size="lg"
              radius="sm"
              mb="md"
            >
              NEW WAY TO CONNECT
            </Badge>
            <Title 
              order={1} 
              mb="sm"
              style={{ 
                fontSize: '3.5rem',
                lineHeight: 1.1,
                fontWeight: 800
              }}
            >
              <Text
                inherit
                component="span"
                c="white"
              >
                College Connections
              </Text>{' '}
              <Text
                inherit
                component="span"
                variant="gradient"
                gradient={{ from: '#0047AB', to: '#5e9fff', deg: 45 }}
              >
                Unleashed
              </Text>
            </Title>
            <Title 
              order={2} 
              size="h4" 
              mb="xl" 
              c="dimmed"
              style={{ fontWeight: 500 }}
            >
              Find your squad before freshman year starts
            </Title>
            
            <Text 
              size="md"
              c="dimmed" 
              mb="xl"
            >
              Connect with classmates, find roommates, and build your circle before you even step on campus. 
              Join the 10,000+ students already making connections for the upcoming school year.
            </Text>
            
            <Group>
              <Button 
                size="lg" 
                radius="md"
                style={{
                  backgroundColor: '#0047AB',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#003d91',
                    transform: 'translateY(-5px)',
                  }
                }}
              >
                Select Your College
              </Button>
              
              <Button 
                size="lg" 
                radius="md"
                variant="outline"
                color="white"
              >
                Watch Demo
              </Button>
            </Group>
            
            <Group gap="xs" mt="xl">
              <Kbd>trusted by</Kbd>
              <Text c="dimmed" size="sm">Harvard, Stanford, Yale, and 50+ top schools</Text>
            </Group>
          </Box>
          
          <Box 
            w={{ base: '100%', md: '45%' }}
            style={{ position: 'relative' }}
          >
            <Box
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, rgba(0,71,171,0.2) 0%, rgba(0,71,171,0.1) 70%, rgba(0,0,0,0) 100%)',
                transform: 'translate(-50px, -50px) scale(1.5)',
                filter: 'blur(60px)',
                zIndex: 0
              }}
            />
            <Paper
              radius="md"
              style={{
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden',
                border: '2px solid rgba(0, 71, 171, 0.3)',
                backgroundColor: '#111',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="College students connecting"
                radius="md"
              />
            </Paper>
            
            <Paper
              style={{
                position: 'absolute',
                bottom: -20,
                right: -20,
                zIndex: 2,
                backgroundColor: '#0047AB',
                borderRadius: '50%',
                width: 120,
                height: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                border: '4px solid black',
              }}
            >
              <Text fw={700} size="lg" c="white" ta="center">Join<br/>Now</Text>
            </Paper>
          </Box>
        </Flex>
      </Container>
      
      {/* Statistics Bar */}
      <Box 
        style={{ 
          backgroundColor: '#0047AB',
          padding: '20px 0'
        }}
      >
        <Container size="xl">
          <Group justify="center" grow>
            <Stack gap={0} align="center">
              <Text fw={700} size="xl" c="white">10,000+</Text>
              <Text size="sm" c="white" opacity={0.8}>Active Students</Text>
            </Stack>
            
            <Stack gap={0} align="center">
              <Text fw={700} size="xl" c="white">78%</Text>
              <Text size="sm" c="white" opacity={0.8}>Find Roommates</Text>
            </Stack>
            
            <Stack gap={0} align="center">
              <Text fw={700} size="xl" c="white">50+</Text>
              <Text size="sm" c="white" opacity={0.8}>Colleges</Text>
            </Stack>
          </Group>
        </Container>
      </Box>
      
      {/* Value Proposition */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center" mb={60}>
          <Badge 
            variant="filled" 
            color="#0047AB"
            size="lg"
            radius="sm"
          >
            WHY CHOOSE US
          </Badge>
          <Title order={2} ta="center" c="white" maw={700} mx="auto">
            Create your college circle before you even arrive
          </Title>
        </Stack>
        
        <Grid>
          <Grid.Col span={4}>
            <FeatureCard 
              icon="👥"
              title="Connect with Classmates"
              description="Find people in your major and courses. Start building your study groups early."
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <FeatureCard 
              icon="🏠"
              title="Find Your Roommate"
              description="Match with potential roommates based on lifestyle, sleep habits, and interests."
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <FeatureCard 
              icon="🎯"
              title="Build Your Circle"
              description="Join interest groups and event chats to find your people before day one."
            />
          </Grid.Col>
        </Grid>
        
        {/* Social Proof */}
        <Box mt={120}>
          <Stack gap="xl" align="center" mb={60}>
            <Badge 
              variant="filled" 
              color="#0047AB"
              size="lg"
              radius="sm"
            >
              SUCCESS STORIES
            </Badge>
            <Title order={2} ta="center" c="white" maw={700} mx="auto">
              Join thousands of students already connected
            </Title>
            <Text c="dimmed" ta="center" size="lg" maw={600} mx="auto">
              <Text component="span" c="#0047AB" fw={700}>78% of users</Text> find their roommates through our platform
            </Text>
          </Stack>
          
          <Grid>
            {TESTIMONIALS.map((testimonial, index) => (
              <Grid.Col span={4} key={index}>
                <TestimonialCard 
                  name={testimonial.name}
                  image={testimonial.image}
                  college={testimonial.college}
                  text={testimonial.text}
                />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      </Container>
      
      {/* How It Works */}
      <Box 
        style={{ 
          backgroundColor: '#0a0a0a',
          padding: '100px 0'
        }}
      >
        <Container size="xl">
          <Stack gap="xl" align="center" mb={60}>
            <Badge 
              variant="filled" 
              color="#0047AB"
              size="lg"
              radius="sm"
            >
              HOW IT WORKS
            </Badge>
            <Title order={2} ta="center" c="white" maw={700} mx="auto">
              Four simple steps to get connected
            </Title>
          </Stack>
          
          <Grid>
            <Grid.Col span={3}>
              <StepCard 
                number={1}
                title="Select Your College"
                description="Choose from our list of 50+ partner colleges and universities."
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <StepCard 
                number={2}
                title="Create Your Profile"
                description="Add your interests, major, and what you're looking for."
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <StepCard 
                number={3}
                title="Get Matched"
                description="Our AI matches you with compatible classmates."
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <StepCard 
                number={4}
                title="Start Connecting"
                description="Message, join groups, and plan meetups for move-in day."
              />
            </Grid.Col>
          </Grid>
        </Container>
      </Box>
      
      {/* Featured Schools */}
      <Container size="xl" py={100}>
        <Stack gap="xl" align="center" mb={60}>
          <Badge 
            variant="filled" 
            color="#0047AB"
            size="lg"
            radius="sm"
          >
            FEATURED SCHOOLS
          </Badge>
          <Title order={2} ta="center" c="white" maw={700} mx="auto">
            Join students from top colleges nationwide
          </Title>
          <Text c="dimmed" ta="center" size="lg" maw={600} mx="auto">
            Access exclusive school-specific communities
          </Text>
        </Stack>
        
        <Grid>
          {COLLEGES.map((college, index) => (
            <Grid.Col span={3} key={index}>
              <CollegeCard 
                name={college.label}
                count={college.count}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
      
      {/* CTA Section */}
      <Box 
        style={{ 
          background: 'linear-gradient(45deg, #000000, #0a0a0a)',
          padding: '80px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '140%',
            height: '140%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(0,71,171,0.1) 0%, rgba(0,0,0,0) 70%)',
            zIndex: 0
          }}
        />
        
        <Container size="md" style={{ position: 'relative', zIndex: 1 }}>
          <Paper
            p="xl"
            radius="lg"
            style={{
              backgroundColor: '#111',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Stack gap="xl" align="center">
              <Title order={2} ta="center" c="white">
                Ready to find your college crew?
              </Title>
              <Text c="dimmed" ta="center" size="lg" mb="xl">
                Get early access to connect with your future classmates
              </Text>
              
              <Group style={{ width: '100%' }} justify="center" gap="md">
                <Select
                  placeholder="Select your college"
                  data={COLLEGES.map(c => ({ value: c.value, label: c.label }))}
                  value={selectedCollege}
                  onChange={setSelectedCollege}
                  style={{ flex: 1, maxWidth: 250 }}
                />
                <TextInput
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  style={{ flex: 1, maxWidth: 250 }}
                />
                <Button 
                  size="md" 
                  style={{ backgroundColor: '#0047AB' }}
                >
                  Get Started — Free!
                </Button>
              </Group>
              
              <Text size="xs" c="dimmed">
                Free to join. Premium features available for upgrade. By signing up, you agree to our Terms of Service.
              </Text>
            </Stack>
          </Paper>
        </Container>
      </Box>
      
      {/* Footer */}
      <Box style={{ backgroundColor: '#0a0a0a', padding: '40px 0' }}>
        <Container size="xl">
          <Stack gap="xl">
            <Group justify="apart">
              <Text fw={700} size="lg" c="white">College Connections Unleashed</Text>
              <Group gap="lg">
                <Text size="md" style={{ cursor: 'pointer' }}>✨</Text>
                <Text size="md" style={{ cursor: 'pointer' }}>📱</Text>
                <Text size="md" style={{ cursor: 'pointer' }}>💬</Text>
              </Group>
            </Group>
            
            <Divider color="rgba(255, 255, 255, 0.1)" />
            
            <Group justify="apart">
              <Text size="xs" c="dimmed">© 2023 College Connections Unleashed. All rights reserved.</Text>
              <Group gap="md">
                <Text size="xs" c="dimmed" style={{ cursor: 'pointer' }}>Terms</Text>
                <Text size="xs" c="dimmed" style={{ cursor: 'pointer' }}>Privacy</Text>
                <Text size="xs" c="dimmed" style={{ cursor: 'pointer' }}>Contact</Text>
              </Group>
            </Group>
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}

export default Home