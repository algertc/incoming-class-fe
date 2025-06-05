import { rem } from '@mantine/core';
import type { MantineTheme } from '@mantine/core';

// Modern Glassmorphism styles for Gen-Z UI
export const glassCardStyles = (_theme: MantineTheme, variant: 'primary' | 'secondary' | 'accent' = 'primary') => {
  const variants = {
    primary: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      backdropFilter: 'blur(20px)',
    },
    secondary: {
      background: 'rgba(99, 102, 241, 0.1)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      backdropFilter: 'blur(15px)',
    },
    accent: {
      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(25px)',
    }
  };

  return {
    ...variants[variant],
    borderRadius: rem(16),
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.12),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 1px 2px rgba(0, 0, 0, 0.1)
    `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `
        0 12px 40px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        0 2px 4px rgba(0, 0, 0, 0.1)
      `,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '1px',
      background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    }
  };
}; 