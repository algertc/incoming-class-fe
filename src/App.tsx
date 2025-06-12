import React from "react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { ModalsProvider } from "@mantine/modals";
import "./index.css";
import THEME from "./theme";
import AppRouterProvider from "./routing/AppRouterProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={THEME}>
        <ModalsProvider>
          <Notifications position="top-right" zIndex={2000} limit={1} />
          <AppRouterProvider />s
        </ModalsProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
};

export default App;
