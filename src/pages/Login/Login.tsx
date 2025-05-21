import React from 'react';
import { Container } from '@mantine/core';
import LoginForm from './LoginForm/LoginForm';

const Login: React.FC = () => {
  return (
    <Container 
      size="100%" 
      h="100vh" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'white'
      }}
    >
      <LoginForm />
    </Container>
  );
};

export default Login;