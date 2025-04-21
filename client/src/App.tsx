import { BrowserRouter, Route, Routes } from "react-router";
import PageNotFound from "./pages/PageNotFound";
import AuthSuccess from "./pages/AuthSuccess";
import AppLayout from "./ui/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider } from "./contexts/DarkMode/ThemeContextProvider";
import Home from "./pages/Home";
import Chat from "./pages/ChatPage";
import Login from "./pages/Login";
import ProtectedRoute from "./ui/ProtectedRoute";

import Signup from "./pages/Signup";

import { AsideContextProvider } from "./contexts/Aside/AsideContextProvider";
import { useEffect } from "react";
import { connectSocket } from "./services/socket";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      connectSocket();
    }
  }, []);

  return (
    <ThemeContextProvider>
      <AsideContextProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <BrowserRouter>
            <Routes>
              <Route
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<Home />} />
                <Route path="/chat/:chatId" element={<Chat />} />
              </Route>

              <Route path="signup" element={<Signup />} />
              <Route path="login" element={<Login />} />
              <Route path="auth-success" element={<AuthSuccess />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster
            position="top-center"
            gutter={12}
            containerStyle={{ margin: "8px" }}
            toastOptions={{
              success: {
                duration: 3000,
              },
              error: {
                duration: 5000,
              },
              style: {
                fontSize: "16px",
                maxWidth: "500px",
                padding: "16px 24px",
                backgroundColor: "var(--color-grey-0)",
                color: "var(--color-grey-700)",
              },
            }}
          />
        </QueryClientProvider>
      </AsideContextProvider>
    </ThemeContextProvider>
  );
}

export default App;
