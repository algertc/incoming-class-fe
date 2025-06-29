import React, { useEffect } from "react";
import { AppShell } from "@mantine/core";
import { Outlet, useNavigate } from "react-router";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import { useAuthStore } from "../../../store/auth.store";
import ROUTES from "../../../constants/routes";

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuthStore();

  useEffect(() => {
    if (user && !isLoading) {
      // Check if user should go to /app
      const shouldRedirectToApp =
        user.isSubscribed || user.isProfileCompleted || user.postPaymentDone;

      if (shouldRedirectToApp) {
        navigate(ROUTES.DASHBOARD);
      } else {
        // User needs to complete profile
        navigate(ROUTES.PROFILE_COMPLETION);
      }
    }
  }, [user, isLoading, navigate]);

  return (
    <AppShell
      header={{ height: { base: 70, sm: 80, md: 90 } }}
      bg="black"
      styles={{
        header: {
          background: "linear-gradient(135deg, #000000 0%, #1a0030 100%)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
        },
      }}
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main>
        <Outlet />
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
};

export default MainLayout;
