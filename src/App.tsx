import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from '@/contexts/auth/AuthContext';
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import ForumPost from "./pages/ForumPost";
import ForumCategory from "./pages/ForumCategory";
import Resources from "./pages/Resources";
import Chat from "./pages/Chat";
import Announcements from "./pages/Announcements";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ConfirmationSuccess from "./pages/ConfirmationSuccess";
import AuthRedirect from "./pages/AuthRedirect";
import AboutUs from "./pages/AboutUs";
import AIAssistant from "./components/AIAssistant";
import Index from "./pages/Index";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        isAuthenticated={isAuthenticated}
        isAdmin={isAdmin}
        isPremium={user?.isPremium}
        onLogin={() => {}}
        onLogout={logout}
      />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/" replace /> : <Register />
          } />
          <Route path="/forgot-password" element={
            isAuthenticated ? <Navigate to="/" replace /> : <ForgotPassword />
          } />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/auth/confirm" element={<ConfirmationSuccess />} />
          <Route path="/auth/callback" element={<AuthRedirect />} />
          
          {/* Special catch-all route for handling Supabase auth returns */}
          <Route path="/index.html" element={<Index />} />

          {/* Protected routes */}
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/forum" element={
            <ProtectedRoute>
              <Forum />
            </ProtectedRoute>
          } />
          <Route path="/forum/post/:postId" element={
            <ProtectedRoute>
              <ForumPost />
            </ProtectedRoute>
          } />
          <Route path="/forum/category/:categoryId" element={
            <ProtectedRoute>
              <ForumCategory />
            </ProtectedRoute>
          } />
          <Route path="/resources" element={
            <ProtectedRoute>
              <Resources />
            </ProtectedRoute>
          } />
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          } />
          <Route path="/announcements" element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          } />
          <Route path="/ai-assistant" element={
            <ProtectedRoute>
              <div className="container py-8">
                <h1 className="text-2xl font-bold mb-6">Family Hub Assistant</h1>
                <AIAssistant />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/family-hub-assistant" element={<Navigate to="/ai-assistant" replace />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="bg-muted py-6 mt-12">
        <div className="container text-center text-muted-foreground">
          <p>© 2025 SunderlandFamily Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
