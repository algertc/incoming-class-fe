import { Flex, Image } from "@mantine/core";
import React from "react";
import images from "../assets/images";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";

interface IProps {
  formType: "login" | "signup" | "forgotPassword";
}

const AuthLayout: React.FC<IProps> = ({ formType }) => {
  const renderForm = () => {
    switch (formType) {
      case "login":
        return <Login />;
      case "signup":
        return <Signup />;
      case "forgotPassword":
        return <ForgotPassword />;
      default:
        return <Login />;
    }
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      w={"100vw"}
      h={{ base: "auto", md: "100vh" }}
    >
      <Flex
        justify={"center"}
        align={"center"}
        py={{ base: "24px", md: "28px" }}
        // px={{ base: "16px", sm: "32px", md: "60px", lg: "80px" }}
        w={{ base: "100%", md: "50%", lg: "40%" }}
        bg={"white"}
        mih={{ base: "100vh", md: "auto" }}
      >
        {renderForm()}
      </Flex>
      <Image
        display={{ base: "none", md: "block" }}
        h={"100vh"}
        w={{ md: "50%", lg: "60%" }}
        src={images.authImg}
        fit="cover"
      />
    </Flex>
  );
};

export default AuthLayout;
