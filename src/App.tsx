
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TodoProvider } from "@/contexts/TodoContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AuthRoute from "@/components/AuthRoute";
import { supabase } from "@/lib/supabase";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <AuthProvider>
          <LanguageProvider>
            <TodoProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter basename="/">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <Index />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/login"
                    element={
                      <AuthRoute>
                        <Login />
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <AuthRoute>
                        <Register />
                      </AuthRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/forgot-password"
                    element={
                      <AuthRoute>
                        <ForgotPassword />
                      </AuthRoute>
                    }
                  />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TodoProvider>
          </LanguageProvider>
        </AuthProvider>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;
