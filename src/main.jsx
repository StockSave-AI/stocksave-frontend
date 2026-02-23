import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { LanguageProvider } from "./components/dashboard/settings/LanguageProvider";
import { AuthProvider } from "./components/hooks/AuthContext";

const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);
