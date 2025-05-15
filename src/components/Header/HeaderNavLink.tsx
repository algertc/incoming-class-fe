import { Box, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { Link, useLocation } from "react-router";

interface NavLinkProps {
  to: string;
  label: string;
  darkMode?: boolean;
  onClick?: () => void;
}

const NavLink = ({ to, label, darkMode = false, onClick }: NavLinkProps) => {
  const location = useLocation();
  const theme = useMantineTheme();
  const isActive = location.pathname === to;

  return (
    <Link to={to} style={{ textDecoration: 'none' }} onClick={onClick}>
      <UnstyledButton
        px={24}
        py={10}
        style={{
          borderRadius: theme.radius.md,
          background: isActive 
            ? darkMode 
              ? 'rgba(67, 97, 238, 0.15)'
              : 'rgba(84, 111, 248, 0.1)' 
            : 'transparent',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            background: darkMode
              ? 'rgba(67, 97, 238, 0.1)'
              : 'rgba(84, 111, 248, 0.05)',
          }
        }}
      >
        <Text 
          fw={isActive ? 600 : 500}
          c={isActive 
            ? darkMode 
              ? theme.colors.blue[3]
              : theme.colors.blue[6] 
            : darkMode 
              ? theme.white 
              : "black"
          }
          size="lg"
        >
          {label}
        </Text>
        {isActive && (
          <Box 
            style={{
              position: 'absolute',
              bottom: (6),
              left: '10%',
              width: '80%',
              height: (3),
              background: darkMode ? theme.colors.red[5] : 'coral',
              borderRadius: theme.radius.xl,
              zIndex: 1,
            }}
          />
        )}
      </UnstyledButton>
    </Link>
  );
};

export default NavLink;