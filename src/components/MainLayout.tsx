import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home,
  CloudSun, 
  Newspaper, 
  TrendingUp,
  User,
  Bell,
  Settings,
  LogOut,
  Leaf,
  Menu,
  X
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Newsticker from "@/components/Newsticker";
import FloatingActionButton from "@/components/FloatingActionButton";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: Home,
      description: "Overview & alerts"
    },
    {
      name: "Weather",
      path: "/weather",
      icon: CloudSun,
      description: "Forecast & insights"
    },
    {
      name: "News",
      path: "/news",
      icon: Newspaper,
      description: "Agricultural updates"
    },
    {
      name: "Market",
      path: "/market",
      icon: TrendingUp,
      description: "Crop prices & trends"
    },
    {
      name: "Profile",
      path: "/profile",
      icon: User,
      description: "Account settings"
    }
  ];

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "See you soon!"
    });
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* News Ticker */}
      <Newsticker />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-glass backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-2 rounded-xl shadow-green animate-pulse-glow">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold text-foreground">CropDrop</h1>
                <p className="text-sm text-muted-foreground">Smart Farming Platform</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    onClick={() => navigate(item.path)}
                    className={`
                      relative group transition-all duration-300
                      ${isActive(item.path) 
                        ? 'bg-gradient-primary shadow-green text-primary-foreground' 
                        : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                    
                    {/* Hover tooltip */}
                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-card border border-border/50 rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {item.description}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </nav>
            
            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                <Settings className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden text-muted-foreground hover:text-primary"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gradient-card border-b border-border/50 animate-slide-down">
          <div className="container mx-auto px-6 py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={isActive(item.path) ? "default" : "ghost"}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`
                      w-full justify-start transition-all duration-300
                      ${isActive(item.path) 
                        ? 'bg-gradient-primary shadow-green text-primary-foreground' 
                        : 'text-muted-foreground hover:text-primary hover:bg-secondary/50'
                      }
                    `}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs opacity-70">{item.description}</div>
                    </div>
                  </Button>
                );
              })}
              
              <div className="flex space-x-2 pt-4 border-t border-border/50">
                <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-primary">
                  <Bell className="h-4 w-4 mr-2" />
                  Alerts
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-primary">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex-1 text-muted-foreground hover:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        {children}
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default MainLayout;