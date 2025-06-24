import React from 'react'
import { Box } from '@mantine/core'
import { useLocation } from 'react-router'
import ForgotPasswordRequest from './components/ForgotPasswordRequest'
import ForgotPasswordReset from './components/ForgotPasswordReset'

const ForgotPasswordPage: React.FC = () => {
  const location = useLocation();
  const isResetStep = location.pathname.includes('/reset');
  
  return (
    <Box 
      w="100%"
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

export default ForgotPasswordPage 