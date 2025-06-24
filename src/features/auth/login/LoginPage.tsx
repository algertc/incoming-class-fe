import React from 'react';
import { Box } from '@mantine/core';
import LoginForm from './components/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <Box 
      w="100%" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default LoginPage; 