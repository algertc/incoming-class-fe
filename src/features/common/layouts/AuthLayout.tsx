import React from "react";
import { Flex, Box } from "@mantine/core";
import LoginPage from "../../auth/login/LoginPage";
import SignupPage from "../../auth/signup/SignupPage";
import ForgotPasswordPage from "../../auth/forgot-password/ForgotPasswordPage";
import FeatureSlideshow from "../../../components/auth/FeatureSlideshow/FeatureSlideshow";
import Logo from "../../../components/Header/Logo";
import { withAuthRedirect } from "../../auth/components/withAuthRedirect";

interface IProps {
  formType: "login" | "signup" | "forgotPassword";
}

const AuthLayout: React.FC<IProps> = ({ formType }) => {
  const renderForm = () => {
    switch (formType) {
      case "login":
        return <LoginPage />;
      case "signup":
        return <SignupPage />;
      case "forgotPassword":
        return <ForgotPasswordPage />;
      default:
        return <LoginPage />;
    }
  };

  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      w={"100vw"}
      h={"100vh"}
      style={{
        background: `
          radial-gradient(circle at 0% 0%, #1971C2 0%, transparent 40%),
          radial-gradient(circle at 100% 0%, #1E3A8A 0%, transparent 40%),
          radial-gradient(circle at 100% 100%, #4A5DFD 0%, transparent 40%),
          radial-gradient(circle at 0% 100%, #4361ee 0%, transparent 40%),
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
          background: "radial-gradient(circle, rgba(74, 93, 253, 0.2) 0%, rgba(74, 93, 253, 0) 70%)",
          filter: "blur(60px)",
          zIndex: 0,
          animation: "pulse 15s ease-in-out infinite alternate",
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
          background: "radial-gradient(circle, rgba(25, 113, 194, 0.2) 0%, rgba(25, 113, 194, 0) 70%)",
          filter: "blur(60px)",
          zIndex: 0,
          animation: "pulse 12s ease-in-out infinite alternate-reverse",
        }}
      />
      <div 
        style={{
          position: "absolute",
          top: "20%",
          left: "45%",
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(67, 97, 238, 0.15) 0%, rgba(67, 97, 238, 0) 70%)",
          filter: "blur(50px)",
          zIndex: 0,
          animation: "float 18s ease-in-out infinite",
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
          background: `linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.8) 100%)`,
          backdropFilter: "blur(15px)",
          position: "relative",
          zIndex: 1,
          padding: "40px 30px",
        }}
      >
        {/* Glass overlay for enhanced effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
            zIndex: 0,
          }}
        />

        {/* Logo at the top */}
        <Flex
          justify={"center"}
          mb={30}
          style={{
            position: "absolute",
            top: "30px",
            left: 0,
            right: 0,
            zIndex: 2,
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
            position: "relative",
            zIndex: 2,
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
            zIndex: 2,
          }}
        >
          
        </Box>
      </Flex>

      {/* Add global keyframes for animations */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 0.6; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
      `}</style>
    </Flex>
  );
};

// Wrap with the redirect HOC to prevent authenticated users from accessing auth pages
export default withAuthRedirect(AuthLayout); 