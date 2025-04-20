import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown, LogOut, User as UserIcon, Home, Settings, BookOpen, MessageSquare, Bell, Shield, Bot } from 'lucide-react';

interface NavbarProps {
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

const Navbar = ({ isAuthenticated, isAdmin, isPremium, onLogin, onLogout }: NavbarProps) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-family-blue mr-6">
            SunderlandFamily Hub
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/forum">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Forum
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/resources">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    Resources
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about">
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    About Us
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              {isAuthenticated && (
                <>
                  <NavigationMenuItem>
                    <Link to="/chat">
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        Chat
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/ai-assistant">
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        <Bot className="mr-2 h-4 w-4" />
                        Family Hub Assistant
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/announcements">
                      <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                        Announcements
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </>
              )}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <div className="flex items-center">
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                  onClick={() => navigate('/admin')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SF</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Shield className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')}>
                Sign Up
              </Button>
            </div>
          )}

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
        <div className="md:hidden border-t py-4">
          <nav className="container flex flex-col space-y-4">
            <Link to="/" className="px-4 py-2 hover:bg-accent rounded-md" onClick={toggleMenu}>
              <div className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Home
              </div>
            </Link>
            <Link to="/forum" className="px-4 py-2 hover:bg-accent rounded-md" onClick={toggleMenu}>
              <div className="flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                Forum
              </div>
            </Link>
            <Link to="/resources" className="px-4 py-2 hover:bg-accent rounded-md" onClick={toggleMenu}>
              <div className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Resources
              </div>
            </Link>
            <Link to="/about" className="px-4 py-2 hover:bg-accent rounded-md" onClick={toggleMenu}>
              <div className="flex items-center">
                <UserIcon className="mr-2 h-4 w-4" />
                About Us
              </div>
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/ai-assistant" className="px-4 py-2 hover:bg-accent rounded-md" onClick={toggleMenu}>
                  <div className="flex items-center">
                    <Bot className="mr-2 h-4 w-4" />
                    Family Hub Assistant
                  </div>
                </Link>
                <Link to="/chat" className="px-4 py-2 hover:bg-accent rounded-md" onClick={toggleMenu}>
                  <div className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat
                  </div>
                </Link>
                <Link to="/announcements" className="px-4 py-2 hover:bg-accent rounded-md" onClick={toggleMenu}>
                  <div className="flex items-center">
                    <Bell className="mr-2 h-4 w-4" />
                    Announcements
                  </div>
                </Link>
                <Link to="/profile" className="px-4 py-2 hover:bg-accent rounded-md" onClick={toggleMenu}>
                  <div className="flex items-center">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Profile
                  </div>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="px-4 py-2 hover:bg-accent rounded-md" onClick={toggleMenu}>
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </div>
                  </Link>
                )}
                <button 
                  className="px-4 py-2 hover:bg-accent rounded-md text-left flex items-center" 
                  onClick={() => { handleLogout(); toggleMenu(); }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
