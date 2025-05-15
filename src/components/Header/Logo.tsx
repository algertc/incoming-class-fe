import { Stack, Text, useMantineTheme } from "@mantine/core";

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
        fz={30}
        c={darkMode ? theme.colors.blue[3] : "blue"}
      >
        INCOMING
      </Text>
      <Text 
        span
        fw={700} 
        fz={30}
        c={darkMode ? theme.white : "black"}
        style={{
          position: "absolute",
          top: 20
        }}
      >
        CLASS
      </Text>
    </Stack>
  );
};

export default Logo;