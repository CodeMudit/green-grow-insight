import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CloudSun, 
  Cloud, 
  Sun, 
  CloudRain, 
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Compass,
  Sunrise,
  Sunset,
  MapPin,
  Search,
  Calendar,
  TrendingUp,
  Umbrella,
  Snowflake,
  Clock
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useEffect } from "react";
import { getWeather } from "@/lib/api";

const WeatherPage = () => {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedDay, setSelectedDay] = useState(0);

  const [currentWeather, setCurrentWeather] = useState({
    location: "Mumbai, Maharashtra",
    temperature: 28,
    condition: "Partly Cloudy",
    feelsLike: 32,
    humidity: 65,
    windSpeed: 12,
    windDirection: "SW",
    visibility: 10,
    uvIndex: 6,
    sunrise: "06:15 AM",
    sunset: "07:30 PM",
    pressure: 1013
  });

  useEffect(() => {
    (async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const loc = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
            try {
              const data = await getWeather(loc);
              // Best-effort mapping without changing UI
              setCurrentWeather((prev) => ({
                location: data?.location || prev.location,
                temperature: Math.round(data?.current?.temp_c ?? data?.temperature ?? prev.temperature),
                condition: data?.current?.condition?.text || data?.condition || prev.condition,
                feelsLike: Math.round(data?.current?.feelslike_c ?? data?.feels_like ?? prev.feelsLike),
                humidity: Math.round(data?.current?.humidity ?? data?.humidity ?? prev.humidity),
                windSpeed: Math.round(data?.current?.wind_kph ?? data?.windSpeed ?? prev.windSpeed),
                windDirection: data?.current?.wind_dir || prev.windDirection,
                visibility: Math.round(data?.current?.vis_km ?? prev.visibility),
                uvIndex: Math.round(data?.current?.uv ?? prev.uvIndex),
                sunrise: data?.astronomy?.sunrise || prev.sunrise,
                sunset: data?.astronomy?.sunset || prev.sunset,
                pressure: Math.round(data?.current?.pressure_mb ?? prev.pressure)
              }));
            } catch {}
          }, async () => {
            try { await getWeather("Mumbai"); } catch {}
          }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
        }
      } catch {}
    })();
  }, []);

  const hourlyForecast = [
    { time: "Now", temp: 28, condition: "Partly Cloudy", icon: CloudSun, rain: 10 },
    { time: "2 PM", temp: 30, condition: "Sunny", icon: Sun, rain: 0 },
    { time: "3 PM", temp: 32, condition: "Sunny", icon: Sun, rain: 0 },
    { time: "4 PM", temp: 31, condition: "Partly Cloudy", icon: CloudSun, rain: 15 },
    { time: "5 PM", temp: 29, condition: "Cloudy", icon: Cloud, rain: 20 },
    { time: "6 PM", temp: 27, condition: "Light Rain", icon: CloudRain, rain: 60 },
    { time: "7 PM", temp: 25, condition: "Rain", icon: CloudRain, rain: 80 },
    { time: "8 PM", temp: 24, condition: "Heavy Rain", icon: CloudRain, rain: 90 }
  ];

  const weeklyForecast = [
    { day: "Today", date: "Mar 15", high: 32, low: 22, condition: "Partly Cloudy", icon: CloudSun, rain: 20, wind: 12 },
    { day: "Tomorrow", date: "Mar 16", high: 35, low: 24, condition: "Sunny", icon: Sun, rain: 0, wind: 8 },
    { day: "Sunday", date: "Mar 17", high: 30, low: 21, condition: "Cloudy", icon: Cloud, rain: 40, wind: 15 },
    { day: "Monday", date: "Mar 18", high: 27, low: 19, condition: "Rainy", icon: CloudRain, rain: 85, wind: 18 },
    { day: "Tuesday", date: "Mar 19", high: 26, low: 18, condition: "Thunderstorm", icon: CloudRain, rain: 90, wind: 22 },
    { day: "Wednesday", date: "Mar 20", high: 29, low: 20, condition: "Partly Cloudy", icon: CloudSun, rain: 25, wind: 14 },
    { day: "Thursday", date: "Mar 21", high: 33, condition: "Sunny", icon: Sun, rain: 5, wind: 10 }
  ];

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'text-warning';
      case 'partly cloudy': return 'text-primary';
      case 'cloudy': return 'text-muted-foreground';
      case 'rainy':
      case 'light rain':
      case 'heavy rain':
      case 'thunderstorm': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Weather Forecast
              </h1>
              <p className="text-muted-foreground">
                Detailed weather insights for smart farming decisions
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search location..."
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="pl-10 w-64 bg-background/50 border-border focus:border-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Current Weather */}
        <Card className="mb-8 bg-gradient-card shadow-elevated border-border/50 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
            <CardContent className="p-8 relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Weather Info */}
                <div className="lg:col-span-2">
                  <div className="flex items-center mb-4">
                    <MapPin className="h-5 w-5 text-primary mr-2" />
                    <span className="text-lg font-semibold text-foreground">{currentWeather.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-6 mb-6">
                    <div className="text-6xl font-bold text-foreground">{currentWeather.temperature}°C</div>
                    <div>
                      <CloudSun className="h-16 w-16 text-primary animate-float" />
                      <p className="text-lg text-muted-foreground mt-2">{currentWeather.condition}</p>
                      <p className="text-sm text-muted-foreground">Feels like {currentWeather.feelsLike}°C</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Droplets className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Humidity</p>
                        <p className="font-semibold text-foreground">{currentWeather.humidity}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Wind className="h-5 w-5 text-accent" />
                      <div>
                        <p className="text-sm text-muted-foreground">Wind</p>
                        <p className="font-semibold text-foreground">{currentWeather.windSpeed} km/h {currentWeather.windDirection}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-success" />
                      <div>
                        <p className="text-sm text-muted-foreground">Visibility</p>
                        <p className="font-semibold text-foreground">{currentWeather.visibility} km</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Sun className="h-5 w-5 text-warning" />
                      <div>
                        <p className="text-sm text-muted-foreground">UV Index</p>
                        <p className="font-semibold text-foreground">{currentWeather.uvIndex}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                  <Card className="bg-gradient-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Sunrise className="h-5 w-5 text-warning" />
                        <span className="text-sm text-muted-foreground">Sunrise</span>
                        <span className="font-semibold text-foreground">{currentWeather.sunrise}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <Sunset className="h-5 w-5 text-destructive" />
                        <span className="text-sm text-muted-foreground">Sunset</span>
                        <span className="font-semibold text-foreground">{currentWeather.sunset}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-primary/5 border-primary/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <Compass className="h-5 w-5 text-primary" />
                        <span className="text-sm text-muted-foreground">Pressure</span>
                        <span className="font-semibold text-foreground">{currentWeather.pressure} hPa</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Hourly Forecast */}
          <div className="xl:col-span-2">
            <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  24-Hour Forecast
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {hourlyForecast.map((hour, index) => {
                    const Icon = hour.icon;
                    return (
                      <div 
                        key={index}
                        className="text-center p-4 rounded-lg hover:bg-secondary/30 transition-smooth animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <p className="text-sm text-muted-foreground mb-2">{hour.time}</p>
                        <Icon className={`h-8 w-8 mx-auto mb-2 ${getConditionColor(hour.condition)}`} />
                        <p className="font-semibold text-foreground mb-1">{hour.temp}°</p>
                        <div className="flex items-center justify-center space-x-1">
                          <Umbrella className="h-3 w-3 text-primary" />
                          <span className="text-xs text-muted-foreground">{hour.rain}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farming Tips */}
          <div>
            <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
              <CardHeader>
                <CardTitle className="flex items-center text-foreground">
                  <TrendingUp className="h-5 w-5 mr-2 text-success" />
                  Farming Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-gradient-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-semibold text-foreground mb-2">Today's Advice</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Good conditions for irrigation in the morning. Avoid spraying pesticides during afternoon heat.
                  </p>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Optimal Planting Weather
                  </Badge>
                </div>
                
                <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                  <h4 className="font-semibold text-foreground mb-2">Rain Alert</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Heavy rainfall expected this evening. Secure loose equipment and ensure proper drainage.
                  </p>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    Action Required
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 7-Day Forecast */}
        <Card className="mt-8 bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              7-Day Weather Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weeklyForecast.map((day, index) => {
                const Icon = day.icon;
                return (
                  <div 
                    key={index}
                    className={`
                      flex items-center justify-between p-4 rounded-lg border border-border/50
                      hover:bg-secondary/30 transition-smooth cursor-pointer animate-fade-in
                      ${selectedDay === index ? 'bg-primary/5 border-primary/20' : 'bg-background/30'}
                    `}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => setSelectedDay(index)}
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="text-center min-w-[80px]">
                        <p className="font-semibold text-foreground">{day.day}</p>
                        <p className="text-sm text-muted-foreground">{day.date}</p>
                      </div>
                      
                      <Icon className={`h-8 w-8 ${getConditionColor(day.condition)}`} />
                      
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{day.condition}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center space-x-1">
                            <Umbrella className="h-3 w-3" />
                            <span>{day.rain}%</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Wind className="h-3 w-3" />
                            <span>{day.wind} km/h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-lg font-semibold text-foreground">
                        <span>{day.high}°</span>
                        <span className="text-muted-foreground text-sm">/ {day.low}°</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default WeatherPage;