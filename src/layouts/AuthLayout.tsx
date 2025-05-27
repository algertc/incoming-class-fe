import React from "react";
import { Flex, Box } from "@mantine/core";
import { Navigate } from "react-router";

import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import FeatureSlideshow from "../components/auth/FeatureSlideshow/FeatureSlideshow";

import Logo from "../components/Header/Logo";

interface IProps {
  formType: "login" | "signup" | "forgotPassword";
}

const AuthLayout: React.FC<IProps> = ({ formType }) => {

  const token=window.localStorage.getItem("token");
  if(token){
    return <Navigate to="/app" />;
  }

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
      h={"100vh"}
      style={{
        background: `
          radial-gradient(circle at 0% 0%, #1971C2 0%, transparent 50%),
          radial-gradient(circle at 100% 0%, #1E3A8A 0%, transparent 50%),
          radial-gradient(circle at 100% 100%, #4A5DFD 0%, transparent 50%),
          radial-gradient(circle at 0% 100%, #4361ee 0%, transparent 50%),
          linear-gradient(135deg, #0F172A 0%, #1E293B 100%)
        `,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <div 
        style={{
          position: "absolute",
          top: "-50%",
          right: "-50%",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(74, 93, 253, 0.15) 0%, rgba(74, 93, 253, 0) 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />
      <div 
        style={{
          position: "absolute",
          bottom: "-30%",
          left: "-30%",
          width: "80%",
          height: "80%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(25, 113, 194, 0.15) 0%, rgba(25, 113, 194, 0) 70%)",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      {/* Feature Slideshow - desktop version (left side) */}
      <Flex
        display={{ base: "none", md: "flex" }}
        h={"100vh"}
        w={{ md: "50%", lg: "60%" }}
        style={{ 
          overflow: "hidden",
          boxShadow: "inset -10px 0 30px rgba(0, 0, 0, 0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <FeatureSlideshow />
      </Flex>
      
      {/* Form section - full height and width */}
      <Flex
        justify={"center"}
        align={"center"}
        direction={"column"}
        w={{ base: "100%", md: "50%", lg: "40%" }}
        h={"100%"}
        style={{
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%)`,
          backdropFilter: "blur(10px)",
          position: "relative",
          zIndex: 1,
          padding: "40px 30px",
        }}
      >
        {/* Logo at the top */}
        <Flex
          justify={"center"}
          mb={30}
          style={{
            position: "absolute",
            top: "30px",
            left: 0,
            right: 0,
          }}
        >
          <Logo darkMode />
        </Flex>

        {/* Form content */}
        <Flex
          style={{
            width: "100%",
            maxWidth: "650px",
            margin: "0 auto",
            marginTop: "80px", // Add space for the logo
          }}
        >
          {renderForm()}
        </Flex>
        
        {/* Mobile footer with copyright - replaces slideshow */}
        <Box
          display={{ base: "block", md: "none" }}
          style={{
            position: "absolute",
            bottom: "20px",
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          
        </Box>
      </Flex>

      {/* Removed the mobile version of FeatureSlideshow */}
    </Flex>
  );
};

export default AuthLayout;
