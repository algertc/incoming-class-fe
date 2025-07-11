import React, { useEffect, useState } from 'react';
import { Box, Text, useMantineTheme } from '@mantine/core';
import type { MantineTheme } from '@mantine/core';
import { useAuthStore } from '../../store/auth.store';
import { useViewportSize } from '@mantine/hooks';

const getStyles = (theme: MantineTheme, isMobile: boolean) => ({
  hintContainer: {
    position: 'fixed' as const,
    zIndex: 1000,
    ...(isMobile ? {
      top: '75px',
      right: '60px',
    } : {
      top: '90px',
      right: '80px',
    }),
  },

  text: {
    color: 'white',
    fontSize: isMobile ? '12px' : '14px',
    background: `linear-gradient(135deg, ${theme.colors.blue[5]} 0%, ${theme.colors.indigo[5]} 100%)`,
    padding: '8px 12px',
    borderRadius: theme.radius.md,
    boxShadow: theme.shadows.sm,
    maxWidth: '150px',
    textAlign: 'center' as const,
    animation: 'fadeIn 0.5s ease-out',
  },
});

// Define keyframe animations
const getKeyframes = () => `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes avatarGlow {
    0% { box-shadow: 0 0 0 0 rgba(51, 154, 240, 0.4); }
    70% { box-shadow: 0 0 0 15px rgba(51, 154, 240, 0); }
    100% { box-shadow: 0 0 0 0 rgba(51, 154, 240, 0); }
  }

  .avatar-highlight {
    animation: avatarGlow 2s infinite;
    border: 2px solid var(--mantine-color-blue-5) !important;
  }
`;

const ProfilePictureSpotlight: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [showText, setShowText] = useState(false);
  const { user } = useAuthStore();
  const theme = useMantineTheme();
  const { width } = useViewportSize();
  
  const smBreakpoint = parseInt(theme.breakpoints.sm.replace(/\D/g, ''));
  const isMobile = width < (theme.breakpoints.sm.includes('em') ? smBreakpoint * 16 : smBreakpoint);
  const styles = getStyles(theme, isMobile);

  useEffect(() => {
    if (user && !user.profilePicture) {
      // Add a small delay before showing
      const timer = setTimeout(() => {
        setVisible(true);
        setShowText(true);
        // Add the glow effect to the avatar
        const avatar = document.querySelector('.mantine-Avatar-root');
        if (avatar) {
          avatar.classList.add('avatar-highlight');
        }
      }, 1000);

      // Add click listener to dismiss text
      const handleClick = () => {
        setShowText(false);
      };

      window.addEventListener('click', handleClick);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('click', handleClick);
        // Clean up the glow effect
        const avatar = document.querySelector('.mantine-Avatar-root');
        if (avatar) {
          avatar.classList.remove('avatar-highlight');
        }
      };
    }
  }, [user]);

  if (!user || user.profilePicture || !visible) {
    return null;
  }

  return (
    <>
      <style>{getKeyframes()}</style>
      {showText && (
        <Box 
          style={styles.hintContainer}
        >
          <Text 
            style={styles.text}
          >
            Click here to add your profile picture ✨
          </Text>
        </Box>
      )}
    </>
  );
};

export default ProfilePictureSpotlight; 