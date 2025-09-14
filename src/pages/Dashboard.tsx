import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer,
  TrendingUp,
  TrendingDown,
  Calendar,
  MapPin,
  User,
  Bell,
  Settings,
  LogOut,
  Leaf
} from "lucide-react";
import WeatherSection from "@/components/WeatherSection";
import NewsSection from "@/components/NewsSection";
import MarketSection from "@/components/MarketSection";
import FloatingActionButton from "@/components/FloatingActionButton";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    location: "Mumbai, Maharashtra"
  });

  const [weatherAlerts] = useState([
    {
      type: "Heavy Rain",
      severity: "high",
      message: "Heavy rainfall expected in the next 48 hours. Secure your crops and equipment.",
      time: "2 hours ago"
    },
    {
      type: "High Temperature",
      severity: "medium", 
      message: "Temperature expected to rise above 35°C tomorrow. Ensure adequate irrigation.",
      time: "5 hours ago"
    }
  ]);

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "See you soon!"
    });
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-glass backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-primary p-2 rounded-xl shadow-green">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold text-foreground">CropDrop</h1>
                <p className="text-sm text-muted-foreground">Smart Farming Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-gradient-primary p-2 rounded-lg">
              <User className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">
                Welcome back, John! 👋
              </h2>
              <p className="text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {currentWeather.location}
              </p>
            </div>
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherAlerts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-warning" />
              Weather Alerts
            </h3>
            <div className="space-y-3">
              {weatherAlerts.map((alert, index) => (
                <Card 
                  key={index} 
                  className={`
                    animate-slide-down bg-gradient-card shadow-card border-l-4 transition-smooth
                    ${alert.severity === 'high' ? 'border-l-destructive' : 'border-l-warning'}
                  `}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge 
                            variant={alert.severity === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {alert.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{alert.time}</span>
                        </div>
                        <p className="text-sm text-foreground">{alert.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Current Weather Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="text-2xl font-bold text-foreground">{currentWeather.temperature}°C</p>
                </div>
                <Thermometer className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Humidity</p>
                  <p className="text-2xl font-bold text-foreground">{currentWeather.humidity}%</p>
                </div>
                <Droplets className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wind Speed</p>
                  <p className="text-2xl font-bold text-foreground">{currentWeather.windSpeed} km/h</p>
                </div>
                <Wind className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Condition</p>
                  <p className="text-lg font-semibold text-foreground">{currentWeather.condition}</p>
                </div>
                <CloudSun className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weather Section */}
          <div className="lg:col-span-2">
            <WeatherSection />
          </div>
          
          {/* Market Section */}
          <div>
            <MarketSection />
          </div>
        </div>

        {/* News Section */}
        <div className="mt-8">
          <NewsSection />
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};

export default Dashboard;