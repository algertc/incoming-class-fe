import React from 'react';
import { Flex, Loader, Text } from '@mantine/core';

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <Flex 
      direction="column" 
      align="center" 
      justify="center" 
      style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)'
      }}
    >
      <Loader size="xl" color="blue" />
      <Text mt={20} size="lg" color="white">
        {message}
      </Text>
    </Flex>
  );
};

export default LoadingScreen; 