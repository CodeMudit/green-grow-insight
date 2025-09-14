import { useState } from "react";
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
  Wind
} from "lucide-react";

const WeatherSection = () => {
  const [weeklyForecast] = useState([
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
        
        <div className="mt-6 p-4 bg-gradient-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2 flex items-center">
            <Sun className="h-4 w-4 mr-2 text-warning" />
            Farming Recommendation
          </h4>
          <p className="text-sm text-muted-foreground">
            Heavy rainfall expected on Monday-Tuesday. Consider harvesting mature crops and 
            ensuring proper drainage. Good planting conditions expected from Wednesday onwards.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherSection;