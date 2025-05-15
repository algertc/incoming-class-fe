import {   Stack, Text } from "@mantine/core";

const Logo = () => {
    return (
      <Stack style={{position:"relative"}}  align="center">
        <Text 
        span
          fw={700} 
          fz={30}
          c={"blue"}
        >
          INCOMING
        </Text>
        <Text 
        span
          fw={700} 
          fz={30}
          c={"black"}
          style={{
            position:"absolute",
            top:20
          }}
        >
          CLASS
        </Text>
      </Stack>
    );
  };

  export default Logo;