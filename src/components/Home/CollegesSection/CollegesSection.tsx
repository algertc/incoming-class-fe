import React, { useRef, useEffect, useMemo } from 'react';
import { Box, Container, Grid, Stack, Title, Badge, useMantineTheme } from '@mantine/core';
import gsap from 'gsap';
import { CollegeCard } from '../CollegeCard/CollegeCard';
import { useFeaturedColleges } from '../../../hooks/api';
import type { College } from '../../../hooks/api/types';

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
];

export const CollegesSection: React.FC = () => {
  const theme = useMantineTheme();
  const sectionTitleRef = useRef<HTMLHeadingElement>(null);

  const {data} = useFeaturedColleges();

  const colleges=useMemo(()=>{
    if(!data) return [];
    if(data.data.length===0) return COLLEGES;
    return data?.data.map((college:College)=>({
      id:college.name,
      label:college.name,
      description:college.location,
    })) || [];
  },[data]);

  useEffect(() => {
    // Set up scroll animations for section title
    if (sectionTitleRef.current) {
      gsap.fromTo(
        sectionTitleRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          scrollTrigger: {
            trigger: sectionTitleRef.current,
            start: "top bottom-=100",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, []);

  return (
    <Box style={{ backgroundColor: theme.colors.dark[9], padding: '80px 0' }}>
      <Container size="lg">
        <Stack gap="lg" align="center" mb={60}>
          <Badge 
            variant="filled" 
            color="blue"
            size="lg"
            radius="sm"
          >
            UNIVERSITIES
          </Badge>
          <Title 
            ref={sectionTitleRef}
            order={2} 
            ta="center" 
            c={theme.white} 
            maw={700} 
            mx="auto" 
            className="section-title"
          >
            Popular universities on our platform
          </Title>
        </Stack>
        
        <Grid>
          {colleges.map((college, index) => (
            <Grid.Col span={{ base: 6, sm: 4, md: 3 }} key={college.label}>
              <CollegeCard 
                name={college.label}
                count={college.label.length}
                index={index}
              />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default CollegesSection; 