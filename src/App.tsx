import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Login } from "./pages/auth/login";
import { Toaster } from "./components/ui/toaster";
import { Register } from "./pages/auth/register";
import { ResetPassword } from "./pages/auth/reset-password";
import { ResetPasswordForm } from "./pages/auth/reset-password-form";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordForm />}
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
