import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CloudSun, 
  Cloud, 
  Sun, 
  CloudRain, 
  Calendar,
  Thermometer,
  Droplets,
  Wind,
  Loader2
} from "lucide-react";
import { getWeather, getWeatherByCoords } from "@/lib/api";
import { useLocation } from "@/hooks/useLocation";

interface WeatherForecast {
  day: string;
  date: string;
  high: number;
  low: number;
  humidity: number;
  wind: number;
  condition: string;
  icon: any;
  precipitation: number;
}

const WeatherSection = () => {
  const { location: userLocation } = useLocation();
  const [weeklyForecast, setWeeklyForecast] = useState<WeatherForecast[]>([
    // Default fallback data
    {
      day: "Today",
      date: "Mar 15",
      high: 28,
      low: 18,
      humidity: 65,
      wind: 12,
      condition: "Partly Cloudy",
      icon: CloudSun,
      precipitation: 10
    },
    {
      day: "Tomorrow", 
      date: "Mar 16",
      high: 32,
      low: 22,
      humidity: 58,
      wind: 8,
      condition: "Sunny",
      icon: Sun,
      precipitation: 0
    },
    {
      day: "Sunday",
      date: "Mar 17", 
      high: 29,
      low: 20,
      humidity: 75,
      wind: 15,
      condition: "Cloudy",
      icon: Cloud,
      precipitation: 20
    },
    {
      day: "Monday",
      date: "Mar 18",
      high: 26,
      low: 19,
      humidity: 80,
      wind: 18,
      condition: "Rainy",
      icon: CloudRain,
      precipitation: 85
    },
    {
      day: "Tuesday",
      date: "Mar 19",
      high: 25,
      low: 17,
      humidity: 78,
      wind: 14,
      condition: "Rainy",
      icon: CloudRain,
      precipitation: 75
    },
    {
      day: "Wednesday",
      date: "Mar 20",
      high: 30,
      low: 21,
      humidity: 62,
      wind: 10,
      condition: "Partly Cloudy",
      icon: CloudSun,
      precipitation: 15
    },
    {
      day: "Thursday",
      date: "Mar 21",
      high: 33,
      low: 23,
      humidity: 55,
      wind: 7,
      condition: "Sunny",
      icon: Sun,
      precipitation: 5
    }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let weatherData;
        
        // Use coordinates if available, otherwise fallback to profile location
        if (userLocation.latitude && userLocation.longitude) {
          weatherData = await getWeatherByCoords(userLocation.latitude, userLocation.longitude);
          console.log("By Coords",weatherData)
        } else {
          const raw = localStorage.getItem("user_profile");
          const profile = raw ? JSON.parse(raw) : null;
          
          if (profile?.location?.district) {
            weatherData = await getWeather(profile.location.district);
            console.log(weatherData)
          } else {
            setError('Location not available. Please enable location services.');
            return;
          }
        }
        
        if (weatherData && weatherData.forecast && weatherData.forecast.forecastday) {
          const forecast = weatherData.forecast.forecastday.slice(0, 7).map((day: any, index: number) => {
            const date = new Date(day.date);
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            
            return {
              day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : dayNames[date.getDay()],
              date: `${monthNames[date.getMonth()]} ${date.getDate()}`,
              high: Math.round(day.day.maxtemp_c),
              low: Math.round(day.day.mintemp_c),
              humidity: Math.round(day.day.avghumidity),
              wind: Math.round(day.day.maxwind_kph),
              condition: day.day.condition.text,
              icon: getWeatherIcon(day.day.condition.text),
              precipitation: Math.round(day.day.daily_chance_of_rain || day.day.daily_chance_of_snow || 0)
            };
          });
          setWeeklyForecast(forecast);
          console.log("Forecast",forecast)
        }
      } catch (err) {
        console.error('Failed to fetch weather forecast:', err);
        setError('Failed to load weather forecast');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherForecast();
  }, [userLocation.latitude, userLocation.longitude]);

  const getWeatherIcon = (condition: string) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('sunny') || conditionLower.includes('clear')) return Sun;
    if (conditionLower.includes('rain') || conditionLower.includes('shower')) return CloudRain;
    if (conditionLower.includes('cloud')) {
      if (conditionLower.includes('partly')) return CloudSun;
      return Cloud;
    }
    return CloudSun;
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny': return 'text-warning';
      case 'partly cloudy': return 'text-primary';
      case 'cloudy': return 'text-muted-foreground';
      case 'rainy': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getPrecipitationBadge = (precipitation: number) => {
    if (precipitation >= 70) return { variant: 'destructive' as const, text: 'High' };
    if (precipitation >= 30) return { variant: 'secondary' as const, text: 'Medium' };
    return { variant: 'outline' as const, text: 'Low' };
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Calendar className="h-5 w-5 mr-2 text-primary" />
            7-Day Weather Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading forecast...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center text-foreground">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          7-Day Weather Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {weeklyForecast.map((day, index) => {
            const Icon = day.icon;
            const precipitationBadge = getPrecipitationBadge(day.precipitation);
            
            return (
              <div 
                key={index}
                className={`
                  flex items-center justify-between p-4 rounded-lg border border-border/50
                  hover:bg-secondary/30 transition-smooth animate-fade-in
                  ${index === 0 ? 'bg-gradient-primary/5 border-primary/20' : 'bg-background/30'}
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="text-center min-w-[80px]">
                    <p className="font-semibold text-foreground">{day.day}</p>
                    <p className="text-sm text-muted-foreground">{day.date}</p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-6 w-6 ${getConditionColor(day.condition)}`} />
                    <div>
                      <p className="font-medium text-foreground">{day.condition}</p>
                      <Badge 
                        variant={precipitationBadge.variant}
                        className="text-xs mt-1"
                      >
                        {day.precipitation}% rain
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Thermometer className="h-4 w-4 text-warning" />
                    <span className="text-foreground">
                      <span className="font-semibold">{day.high}°</span>
                      <span className="text-muted-foreground">/{day.low}°</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Droplets className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{day.humidity}%</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Wind className="h-4 w-4 text-accent" />
                    <span className="text-muted-foreground">{day.wind}km/h</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Dynamic Farming Recommendations */}
        <div className="mt-6 p-4 bg-gradient-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2 flex items-center">
            <Sun className="h-4 w-4 mr-2 text-warning" />
            Farming Recommendation
          </h4>
          <p className="text-sm text-muted-foreground">
            {(() => {
              const highRainDays = weeklyForecast.filter(day => day.precipitation > 70);
              const hotDays = weeklyForecast.filter(day => day.high > 35);
              
              if (highRainDays.length > 2) {
                return "Heavy rainfall expected this week. Consider harvesting mature crops and ensuring proper drainage. Avoid field operations during wet conditions.";
              } else if (hotDays.length > 3) {
                return "High temperatures expected. Increase irrigation frequency and consider shade protection for sensitive crops. Early morning or evening field work recommended.";
              } else if (weeklyForecast.some(day => day.precipitation < 10 && day.high > 30)) {
                return "Dry and warm conditions ahead. Good for harvesting and field preparation. Ensure adequate irrigation for growing crops.";
              } else {
                return "Moderate weather conditions expected. Good time for regular farming activities including planting, weeding, and crop monitoring.";
              }
            })()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherSection;