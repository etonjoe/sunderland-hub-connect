
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Forum from "./pages/Forum";
import Resources from "./pages/Resources";
import Chat from "./pages/Chat";
import Announcements from "./pages/Announcements";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import ConfirmationSuccess from "./pages/ConfirmationSuccess";
import AboutUs from "./pages/AboutUs";
import AIAssistant from "./components/AIAssistant";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // For admin routes, check if user is admin
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
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route path="/forum" element={<Forum />} />
          <Route 
            path="/resources" 
            element={
              <ProtectedRoute>
                <Resources />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/chat" 
            element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route path="/announcements" element={<Announcements />} />
          <Route 
            path="/ai-assistant" 
            element={
              <ProtectedRoute>
                <div className="container py-8">
                  <h1 className="text-2xl font-bold mb-6">Family Hub Assistant</h1>
                  <AIAssistant />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route path="/family-hub-assistant" element={<Navigate to="/ai-assistant" replace />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route path="/auth/confirm" element={<ConfirmationSuccess />} />
          <Route path="/about" element={<AboutUs />} />
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
