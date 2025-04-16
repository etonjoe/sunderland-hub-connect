
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
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

const queryClient = new QueryClient();

const App = () => {
  // These state values would be managed by the actual auth system in a real app
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Handlers for login/logout that would be replaced with actual auth logic
  const handleLogin = () => {
    // This is just a placeholder for the Navbar component
    // The actual login is handled in the Login page with useAuth
  };
  
  const handleLogout = () => {
    // This is just a placeholder for the Navbar component
    // The actual logout is handled in the Navbar with useAuth
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen flex flex-col">
              <Navbar 
                isAuthenticated={isAuthenticated}
                isAdmin={isAdmin}
                isPremium={isPremium}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/forum" element={<Forum />} />
                  <Route path="/resources" element={<Resources />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <footer className="bg-muted py-6 mt-12">
                <div className="container text-center text-muted-foreground">
                  <p>© 2023 SunderlandFamily Hub. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
