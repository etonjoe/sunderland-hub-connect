
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, BookOpen, Settings, User, Shield, MessageSquare, Bell, Bot, LogOut } from 'lucide-react';

interface MobileNavMenuProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileNavMenu = ({ isAuthenticated, isAdmin, onClose, onLogout }: MobileNavMenuProps) => {
  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="md:hidden border-t py-4">
      <nav className="container flex flex-col space-y-4">
        <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md" onClick={onClose}>
          <div className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Home
          </div>
        </Link>
        <Link to="/forum" className="px-4 py-2 hover:bg-accent rounded-md" onClick={onClose}>
          <div className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Forum
          </div>
        </Link>
        <Link to="/resources" className="px-4 py-2 hover:bg-accent rounded-md" onClick={onClose}>
          <div className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Resources
          </div>
        </Link>
        <Link to="/about" className="px-4 py-2 hover:bg-accent rounded-md" onClick={onClose}>
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            About Us
          </div>
        </Link>
        {isAuthenticated && (
          <>
            <Link to="/ai-assistant" className="px-4 py-2 hover:bg-accent rounded-md" onClick={onClose}>
              <div className="flex items-center">
                <Bot className="mr-2 h-4 w-4" />
                Family Hub Assistant
              </div>
            </Link>
            <Link to="/chat" className="px-4 py-2 hover:bg-accent rounded-md" onClick={onClose}>
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                Chat
              </div>
            </Link>
            <Link to="/announcements" className="px-4 py-2 hover:bg-accent rounded-md" onClick={onClose}>
              <div className="flex items-center">
                <Bell className="mr-2 h-4 w-4" />
                Announcements
              </div>
            </Link>
            <Link to="/profile" className="px-4 py-2 hover:bg-accent rounded-md" onClick={onClose}>
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </div>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="px-4 py-2 hover:bg-accent rounded-md" onClick={onClose}>
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </div>
              </Link>
            )}
            <button 
              className="px-4 py-2 hover:bg-accent rounded-md text-left flex items-center" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNavMenu;
