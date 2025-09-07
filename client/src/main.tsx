import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createHead, UnheadProvider } from "@unhead/react/client";

const head = createHead();
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <UnheadProvider head={head}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </UnheadProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
