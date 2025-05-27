import React from 'react';
import { Box } from '@mantine/core';
import LoginForm from './LoginForm/LoginForm';

// Since the background is already set in AuthLayout, we don't need to set it here
const Login: React.FC = () => {
  return (
    <Box 
      w="100%" 
      h="100%"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: 'visible'
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default Login;