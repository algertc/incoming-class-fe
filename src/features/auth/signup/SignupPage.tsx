import React from "react";
import { Box } from "@mantine/core";
import SignupForm from "./components/SignupForm";

const SignupPage: React.FC = () => {
  return (
    <Box 
      w="100%"
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        }}
      >
        <SignupForm />
    </Box>
  );
};

export default SignupPage; 