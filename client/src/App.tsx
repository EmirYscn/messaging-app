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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeContextProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              {/* <Route path="/dashboard" element={<div>Dashboard</div>} />
            <Route path="/settings" element={<div>Settings</div>} />
            <Route path="/messages" element={<div>Messages</div>} />
            <Route path="/contacts" element={<div>Contacts</div>} />
            <Route path="/profile" element={<div>Profile</div>} /> */}
            </Route>

            <Route path="signup" />
            <Route path="login" />
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
    </ThemeContextProvider>
  );
}

export default App;
