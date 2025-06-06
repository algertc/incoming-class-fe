import React from "react";
import { Box, Flex } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import SignupForm from "./components/SignupForm";
import Logo from "../../../components/Header/Logo";

const SignupPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box 
      w="100%"
      h="100vh"
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'flex-start',
        overflow: 'hidden', // Prevent outer scrolling
        padding: '0',
        width: '100%'
      }}
    >
      {/* Logo at top for mobile - fixed positioning */}
      {isMobile && (
        <Flex
          justify="center"
          style={{
            width: '100%',
            paddingTop: '20px',
            paddingBottom: '15px',
            zIndex: 10,
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Logo darkMode />
        </Flex>
      )}
      
      {/* Form container - scrollable */}
      <Box
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          justifyContent: 'center',
          padding: isMobile ? '10px 20px 20px 20px' : '0',
          overflowY: isMobile ? 'auto' : 'visible',
          overflowX: 'hidden',
        }}
      >
        <SignupForm />
      </Box>
    </Box>
  );
};

export default SignupPage; 