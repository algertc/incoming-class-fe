import { Stack, Text, useMantineTheme } from "@mantine/core";

interface LogoProps {
  darkMode?: boolean;
}

const Logo = ({ darkMode = false }: LogoProps) => {
  const theme = useMantineTheme();
  
  return (
    <Stack 
      gap={0} 
      style={{ 
        position: "relative",
        height: "auto",
        minHeight: "32px"
      }} 
      align="center"
    >
      <Text 
        span
        fw={700} 
        fz={{ base: 20, sm: 24, md: 28 }}
        c={darkMode ? theme.colors.blue[3] : "blue"}
        style={{
          letterSpacing: "0.3px",
          textShadow: darkMode ? "0 0 8px rgba(67, 97, 238, 0.3)" : "none",
          lineHeight: 1.1
        }}
      >
        INCOMING
      </Text>
      <Text 
        span
        fw={700} 
        fz={{ base: 20, sm: 24, md: 28 }}
        c={darkMode ? theme.white : "black"}
        style={{
          position: "absolute",
          top: "14px",
          letterSpacing: "0.3px",
          lineHeight: 1.1
        }}
      >
        CLASS
      </Text>
     
    </Stack>
  );
};

export default Logo;