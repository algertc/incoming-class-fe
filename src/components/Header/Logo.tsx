import { Stack, Text,  useMantineTheme } from "@mantine/core";

interface LogoProps {
  darkMode?: boolean;
}

const Logo = ({ darkMode = false }: LogoProps) => {
  const theme = useMantineTheme();
  
  return (
    <Stack gap={0} style={{ position: "relative" }} align="center">
      <Text 
        span
        fw={700} 
        fz={{ base: 24, sm: 26, md: 30 }}
        c={darkMode ? theme.colors.blue[3] : "blue"}
        style={{
          letterSpacing: "0.5px",
          textShadow: darkMode ? "0 0 10px rgba(67, 97, 238, 0.3)" : "none"
        }}
      >
        INCOMING
      </Text>
      <Text 
        span
        fw={700} 
        fz={{ base: 24, sm: 26, md: 30 }}
        c={darkMode ? theme.white : "black"}
        style={{
          position: "absolute",
          top: 18,
          letterSpacing: "0.5px"
        }}
      >
        CLASS
      </Text>
     
    </Stack>
  );
};

export default Logo;