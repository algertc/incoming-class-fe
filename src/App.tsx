import React, { useEffect } from "react";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";

import { ModalsProvider } from "@mantine/modals";
import "./index.css";
import THEME from "./theme";
import AppRouterProvider from "./routing/AppRouterProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/auth.store";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Extend the theme to include custom z-index management
const theme = createTheme({
  ...THEME,
  components: {
    ...THEME.components,
    // Modal: {
    //   styles: {
    //     root: { zIndex: 1100 },
    //     overlay: { zIndex: 1100 },
    //   },
    // },
  },
});

// Auth initializer component
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('App: Checking for existing token:', !!token);
    
    if (token) {
      console.log('App: Token found, fetching user data');
      fetchUser().catch((error) => {
        console.error('App: Failed to fetch user on initialization:', error);
        // If token is invalid, remove it
        localStorage.removeItem('token');
      });
    } else {
      console.log('App: No token found, skipping user fetch');
    }
  }, [fetchUser]);

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <ModalsProvider
          modalProps={{
            centered: true,
            overlayProps: {
              blur: 3,
            },
            styles: {
              header: {
                backgroundColor: "#101720",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              },
              title: {
                color: "white",
                fontWeight: 600,
              },
              close: {
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              },
              body: {
                backgroundColor: "#101720",
                color: "white",
              },
              content: {
                backgroundColor: "#101720",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
            },
          }}
          labels={{ confirm: "Confirm", cancel: "Cancel" }}
        >
          <Notifications position={"top-right"} limit={1} />
          <AuthInitializer>
            <AppRouterProvider />
          </AuthInitializer>
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
