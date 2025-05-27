import { Box, Text, UnstyledButton, useMantineTheme, rem } from "@mantine/core";
import { Link, useLocation } from "react-router";
import { useState } from "react";

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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={to} 
      style={{ 
        textDecoration: 'none',
        width: isVertical ? "100%" : "auto",
        textAlign: isVertical ? "center" : "center",
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
            : isHovered
              ? darkMode
                ? 'rgba(67, 97, 238, 0.1)'
                : 'rgba(84, 111, 248, 0.05)'
              : 'transparent',
          textAlign: isVertical ? "center" : "left",
          minWidth: isVertical ? "auto" : rem(100),
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
          boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Text 
          fw={isActive ? 600 : 500}
          c={isActive 
            ? darkMode 
              ? isHovered ? theme.colors.blue[2] : theme.colors.blue[3]
              : isHovered ? theme.colors.blue[7] : theme.colors.blue[6] 
            : darkMode 
              ? isHovered ? theme.colors.blue[3] : theme.white 
              : isHovered ? theme.colors.blue[6] : "black"
          }
          size="md"
          style={{
            transition: 'all 0.3s ease',
          }}
        >
          {label}
        </Text>
        
        {/* Active indicator */}
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
              boxShadow: darkMode ? '0 0 8px rgba(229, 56, 59, 0.5)' : 'none',
              animation: 'pulse 2s infinite'
            }}
          />
        )}
        
        {/* Hover indicator */}
        {!isActive && (
          <Box 
            style={{
              position: 'absolute',
              bottom: 6,
              left: isVertical ? '10%' : '5%',
              height: 3,
              width: isHovered ? (isVertical ? '80%' : '90%') : 0,
              opacity: isHovered ? 0.7 : 0,
              background: darkMode ? theme.colors.red[5] : 'coral',
              borderRadius: theme.radius.xl,
              zIndex: 1,
              transition: 'width 0.3s ease, opacity 0.3s ease'
            }}
          />
        )}
        
        {/* Background glow effect */}
        <Box 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '120%',
            height: '120%',
            transform: `translate(-50%, -50%) scale(${isHovered ? 1 : 0})`,
            opacity: isHovered ? 1 : 0,
            background: darkMode 
              ? 'radial-gradient(circle, rgba(67, 97, 238, 0.15) 0%, transparent 70%)' 
              : 'radial-gradient(circle, rgba(84, 111, 248, 0.1) 0%, transparent 70%)',
            zIndex: 0,
            transition: 'transform 0.3s ease, opacity 0.3s ease',
          }}
        />
      </UnstyledButton>
      
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: ${darkMode ? '0 0 8px rgba(229, 56, 59, 0.5)' : 'none'}; }
            50% { box-shadow: ${darkMode ? '0 0 16px rgba(229, 56, 59, 0.7)' : 'none'}; }
            100% { box-shadow: ${darkMode ? '0 0 8px rgba(229, 56, 59, 0.5)' : 'none'}; }
          }
        `}
      </style>
    </Link>
  );
};

export default NavLink;