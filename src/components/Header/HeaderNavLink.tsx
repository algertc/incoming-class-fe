import { Box, Text, UnstyledButton, useMantineTheme, rem } from "@mantine/core";
import { Link, useLocation } from "react-router";

interface NavLinkProps {
  to: string;
  label: string;
  darkMode?: boolean;
  displayMode?: "horizontal" | "vertical";
  onClick?: () => void;
}

const NavLink = ({ 
  to, 
  label, 
  darkMode = false, 
  displayMode = "horizontal",
  onClick 
}: NavLinkProps) => {
  const location = useLocation();
  const theme = useMantineTheme();
  const isActive = location.pathname === to;
  const isVertical = displayMode === "vertical";

  return (
    <Link 
      to={to} 
      style={{ 
        textDecoration: 'none',
        width: isVertical ? "100%" : "auto",
        textAlign: isVertical ? "center" : "left",
        display: "block"
      }} 
      onClick={onClick}
    >
      <UnstyledButton
        px={{ base: 16, sm: 20, md: 24 }}
        py={{ base: 8, sm: 10 }}
        w={isVertical ? "100%" : "auto"}
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
          textAlign: isVertical ? "center" : "left",
          minWidth: isVertical ? "auto" : rem(100),
          '&:hover': {
            background: darkMode
              ? 'rgba(67, 97, 238, 0.1)'
              : 'rgba(84, 111, 248, 0.05)',
            transform: 'translateY(-2px)'
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
          size="md"
        >
          {label}
        </Text>
        {isActive && (
          <Box 
            style={{
              position: 'absolute',
              bottom: 6,
              left: isVertical ? '10%' : '5%',
              width: isVertical ? '80%' : '90%',
              height: 3,
              background: darkMode ? theme.colors.red[5] : 'coral',
              borderRadius: theme.radius.xl,
              zIndex: 1,
              boxShadow: darkMode ? '0 0 8px rgba(229, 56, 59, 0.5)' : 'none'
            }}
          />
        )}
      </UnstyledButton>
    </Link>
  );
};

export default NavLink;