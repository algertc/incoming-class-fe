import { Box } from '@mantine/core';
import React from 'react';

interface ProfileGlowEffectProps {
  children: React.ReactNode;
  isActive?: boolean;
  borderRadius?: string | number;
}

export const ProfileGlowEffect: React.FC<ProfileGlowEffectProps> = ({
  children,
  isActive = true,
  borderRadius = '50%',
}) => {
  if (!isActive) return <>{children}</>;

  return (
    <Box
      style={{
        position: 'relative',
        borderRadius,
        animation: 'glowPulse 2s ease-in-out infinite',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -2,
          right: -2,
          bottom: -2,
          left: -2,
          background: 'linear-gradient(45deg, #4361ee, #3a0ca3)',
          borderRadius: 'inherit',
          opacity: 0.5,
          zIndex: -1,
        },
      }}
    >
      <style>
        {`
          @keyframes glowPulse {
            0% { box-shadow: 0 0 5px 2px rgba(67, 97, 238, 0.3); }
            50% { box-shadow: 0 0 15px 5px rgba(67, 97, 238, 0.5); }
            100% { box-shadow: 0 0 5px 2px rgba(67, 97, 238, 0.3); }
          }
        `}
      </style>
      {children}
    </Box>
  );
};

export default ProfileGlowEffect; 