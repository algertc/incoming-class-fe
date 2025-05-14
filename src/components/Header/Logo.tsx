import {  Flex, Text } from "@mantine/core";

const Logo = () => {
    return (
      <Flex direction={"column"} justify={"center"} align={"center"} >
        <Text 
          fw={700} 
          fz={16}
          c={"blue"}
        >
          Incoming
        </Text>
        <Text 
          fw={700} 
          fz={16}
          c={"black"}
        >
          Class
        </Text>
      </Flex>
    );
  };

  export default Logo;