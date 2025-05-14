import { Box, Text, UnstyledButton, useMantineTheme } from "@mantine/core";
import { Link, useLocation } from "react-router";

const NavLink = ({ to, label }: { to: string; label: string }) => {
    const location = useLocation();
    const theme = useMantineTheme();
    const isActive = location.pathname === to;
  
    return (
      <Link to={to} style={{ textDecoration: 'none' }}>
        <UnstyledButton
          px={24}
          py={10}
          style={{
            borderRadius: theme.radius.md,
            background: isActive ? 'rgba(84, 111, 248, 0.1)' : 'transparent',
            transition: 'all 0.2s ease',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              background: 'rgba(84, 111, 248, 0.05)',
            }
          }}
        >
          <Text 
            fw={isActive ? 600 : 500}
            c={isActive ? theme.colors.blue[6] : "black"}
            size="xl"
      
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
                background: 'coral',
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