import React from "react";
import { Box } from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import SignupForm from "./components/SignupForm";

const SignupPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box 
      w="100%"
      h="100%" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        overflow: isMobile ? 'auto' : 'visible',
        overflowX: 'hidden',
        paddingTop: isMobile ? '20px' : '0',
        paddingBottom: isMobile ? '20px' : '0',
        width: '100%'
      }}
    >
      <SignupForm />
    </Box>
  );
};

export default SignupPage; 