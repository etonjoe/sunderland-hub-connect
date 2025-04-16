
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { Bell, Menu, MessageSquare, Users, FileText, Home, LogIn, LogOut } from 'lucide-react';

interface NavbarProps {
  isAuthenticated: boolean;
  isAdmin?: boolean;
  isPremium?: boolean;
  unreadNotifications?: number;
  unreadMessages?: number;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  isAdmin = false,
  isPremium = false,
  unreadNotifications = 0,
  unreadMessages = 0,
  onLogin,
  onLogout
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);

  const renderAuthButtons = () => {
    if (isAuthenticated) {
      return (
        <Button variant="ghost" className="text-white" onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      );
    }

    return (
      <Button className="bg-family-orange hover:bg-orange-600" onClick={onLogin}>
        <LogIn className="mr-2 h-4 w-4" />
        <span>Sign In</span>
      </Button>
    );
  };

  const links = [
    { to: "/", label: "Home", icon: <Home className="mr-2 h-4 w-4" /> },
    { to: "/forum", label: "Forum", icon: <Users className="mr-2 h-4 w-4" /> },
    {
      to: "/resources",
      label: "Resources",
      icon: <FileText className="mr-2 h-4 w-4" />,
      premium: true
    },
    {
      to: "/chat",
      label: "Chat",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      premium: true,
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    {
      to: "/announcements",
      label: "Announcements",
      icon: <Bell className="mr-2 h-4 w-4" />,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined
    }
  ];

  if (isAdmin) {
    links.push({
      to: "/admin",
      label: "Admin",
      icon: <Users className="mr-2 h-4 w-4" />
    });
  }

  const renderLinks = () => {
    return links.map((link) => {
      // Skip premium features if user is not premium
      if (link.premium && !isPremium) {
        return null;
      }

      const LinkContent = (
        <>
          {link.icon}
          <span>{link.label}</span>
          {link.badge && (
            <span className="ml-1 bg-family-orange text-white text-xs rounded-full px-2 py-0.5">
              {link.badge}
            </span>
          )}
        </>
      );

      if (isMobile) {
        return (
          <Button
            key={link.to}
            variant="ghost"
            className="justify-start w-full"
            asChild
            onClick={handleClose}
          >
            <Link to={link.to}>{LinkContent}</Link>
          </Button>
        );
      }

      return (
        <Button key={link.to} variant="ghost" className="text-white" asChild>
          <Link to={link.to}>{LinkContent}</Link>
        </Button>
      );
    });
  };

  return (
    <nav className="bg-family-blue p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold flex items-center">
          <span className="mr-2">👪</span>
          <span>SunderlandFamily Hub</span>
        </Link>

        {isMobile ? (
          <div className="flex items-center">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" className="text-white p-1">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] pt-10">
                <div className="flex flex-col space-y-4 mt-8">
                  {renderLinks()}
                  <div className="pt-4 mt-4 border-t">
                    {isAuthenticated ? (
                      <>
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          asChild
                          onClick={handleClose}
                        >
                          <Link to="/profile">Profile</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start w-full"
                          onClick={() => {
                            onLogout();
                            handleClose();
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Sign Out</span>
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full bg-family-orange hover:bg-orange-600"
                        onClick={() => {
                          onLogin();
                          handleClose();
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Sign In</span>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            {renderLinks()}
            {isAuthenticated && (
              <Button variant="ghost" className="text-white" asChild>
                <Link to="/profile">Profile</Link>
              </Button>
            )}
            {renderAuthButtons()}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
