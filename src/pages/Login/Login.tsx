import React from 'react';
import { Box } from '@mantine/core';
import LoginForm from './LoginForm/LoginForm';

const Login: React.FC = () => {
  return (
    <Box 
      w="100%" 
      h="100vh" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default Login;