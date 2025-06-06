import React from 'react';
import { Box, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import LoginForm from './components/LoginForm';
import Logo from '../../../components/Header/Logo';

const LoginPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box 
      w="100%" 
      h={isMobile ? "100vh" : "100%"}
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: isMobile ? 'flex-start' : 'center',
        overflow: 'visible',
        padding: isMobile ? '0' : '0',
      }}
    >
      {/* Logo at top for mobile */}
      {isMobile && (
        <Flex
          justify="center"
          style={{
            width: '100%',
            paddingTop: '40px',
            paddingBottom: '30px',
            zIndex: 2,
          }}
        >
          <Logo darkMode />
        </Flex>
      )}
      
      {/* Form container */}
      <Box
        style={{
          flex: isMobile ? 1 : 'none',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '0 20px 40px 20px' : '0',
        }}
      >
        <LoginForm />
      </Box>
    </Box>
  );
};

export default LoginPage; 