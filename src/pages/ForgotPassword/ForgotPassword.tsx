import React from 'react'
import { Box } from '@mantine/core'
import ForgotPasswordRequest from './ForgotPasswordRequest'
import ForgotPasswordReset from './ForgotPasswordReset'
import { useLocation } from 'react-router'

const ForgotPassword: React.FC = () => {
  const location = useLocation();
  const isResetStep = location.pathname.includes('/reset');
  
  return (
    <Box 
      w="100%"
      h="100%" 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}
    >
      {isResetStep ? <ForgotPasswordReset /> : <ForgotPasswordRequest />}
    </Box>
  )
}

export default ForgotPassword 