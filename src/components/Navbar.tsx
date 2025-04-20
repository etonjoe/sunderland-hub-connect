
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import DesktopNavMenu from './navbar/DesktopNavMenu';
import MobileNavMenu from './navbar/MobileNavMenu';
import UserMenu from './navbar/UserMenu';

interface NavbarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar = ({ isAuthenticated, isAdmin, isPremium, onLogin, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-family-blue mr-6">
            SunderlandFamily Hub
          </Link>
          <DesktopNavMenu isAuthenticated={isAuthenticated} />
        </div>

        <div className="flex items-center gap-2">
          <UserMenu 
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            onLogin={onLogin}
            onLogout={onLogout}
          />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <MobileNavMenu
          isAuthenticated={isAuthenticated}
          isAdmin={isAdmin}
          onClose={toggleMenu}
          onLogout={onLogout}
        />
      )}
    </header>
  );
};

export default Navbar;
