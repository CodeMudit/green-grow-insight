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
import { getDashboard, getWeather, getWeatherByCoords } from "@/lib/api";
import MainLayout from "@/components/MainLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "@/hooks/useLocation";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { location: userLocation, loading: locationLoading, detectLocation, error: locationError } = useLocation();
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: "Partly Cloudy",
    location: ""
  });
  const [userName, setUserName] = useState<string>("");
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<any[]>([]);
  const [alertsLoading, setAlertsLoading] = useState(true);

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "See you soon!"
    });
    navigate("/");
  };

  // Fetch weather data based on detected location
  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!userLocation.latitude || !userLocation.longitude) return;
      setWeatherLoading(true);
      setAlertsLoading(true);
      setWeatherError(null);
      try {
        const weatherData = await getWeatherByCoords(userLocation.latitude, userLocation.longitude);
        if (weatherData && weatherData.current) {
          setCurrentWeather({
            location: userLocation.city && userLocation.state 
              ? `${userLocation.city}, ${userLocation.state}` 
              : weatherData.location?.name || "Unknown Location",
            temperature: Math.round(weatherData.current.temp_c || 24),
            humidity: Math.round(weatherData.current.humidity || 65),
            windSpeed: Math.round(weatherData.current.wind_kph || 12),
            condition: weatherData.current.condition?.text || "Partly Cloudy"
          });
          console.log("Weather Data:", weatherData);
          console.log("Location Data:", userLocation);
          console.log("Coords:", userLocation.latitude, userLocation.longitude);
          console.log("Current Weather:", currentWeather);
          setWeatherAlerts(weatherData.alerts || []);
        } else {
          setWeatherError("Weather data not available.");
        }
      } catch (error) {
        setWeatherError("Unable to fetch current weather data.");
        toast({
          title: "Weather Update Failed",
          description: "Unable to fetch current weather data",
          variant: "destructive"
        });
      } finally {
        setWeatherLoading(false);
        setAlertsLoading(false);
      }
    };
    fetchWeatherData();
  }, [userLocation.latitude, userLocation.longitude, toast]);

  // Fetch user profile data
  useEffect(() => {
    (async () => {
      try {
        const raw = localStorage.getItem("user_profile");
        const phone = raw ? JSON.parse(raw)?.phone : null;
        if (!phone) return;
        const data = await getDashboard(phone);
        setUserName(data?.name || "");
      } catch (error) {
        setProfileError("Unable to fetch user profile.");
        console.error('Failed to fetch user profile:', error);
      }
    })();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <User className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome back, {userName || "Farmer"}!
                  {profileError && (
                    <span className="block text-destructive text-sm mt-1">{profileError}</span>
                  )}
                </h1>
                {/* District and State Display */}
                <div className="mt-2">
                  {locationLoading ? (
                    <p className="text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Detecting location...
                    </p>
                  ) : locationError ? (
                    <p className="text-destructive text-sm flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {locationError}
                    </p>
                  ) : userLocation.district && userLocation.state ? (
                    <p className="text-foreground font-medium flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-primary" />
                      {userLocation.district}, {userLocation.state}
                    </p>
                  ) : (
                    <p className="text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location not detected
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Manual location detection button for debugging */}
            <Button 
              onClick={detectLocation} 
              disabled={locationLoading}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <MapPin className="h-4 w-4" />
              <span>{locationLoading ? "Detecting..." : "Detect Location"}</span>
            </Button>
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Bell className="h-5 w-5 mr-2 text-warning" />
            Weather Alerts
          </h3>
          {alertsLoading ? (
            <div className="text-muted-foreground py-4">Loading alerts...</div>
          ) : weatherAlerts.length === 0 ? (
            <div className="text-muted-foreground py-4">No weather alerts for your area.</div>
          ) : (
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
                            {alert.event || alert.type || 'Alert'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{alert.effective || alert.time || ''}</span>
                        </div>
                        <p className="text-sm text-foreground">{alert.description || alert.message}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

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
    </MainLayout>
  );
};

export default Dashboard;