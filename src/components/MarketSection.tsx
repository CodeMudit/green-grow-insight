import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  IndianRupee,
  Calendar
} from "lucide-react";

const MarketSection = () => {
  const [lastUpdated] = useState("2 hours ago");
  const [marketData] = useState([
    {
      crop: "Wheat",
      price: 2150,
      unit: "quintal",
      change: 75,
      changePercent: 3.6,
      trend: "up",
      market: "Mumbai APMC"
    },
    {
      crop: "Rice",
      price: 3200,
      unit: "quintal", 
      change: -45,
      changePercent: -1.4,
      trend: "down",
      market: "Delhi Mandi"
    },
    {
      crop: "Cotton",
      price: 6800,
      unit: "quintal",
      change: 150,
      changePercent: 2.3,
      trend: "up",
      market: "Nagpur APMC"
    },
    {
      crop: "Sugarcane",
      price: 350,
      unit: "quintal",
      change: 0,
      changePercent: 0,
      trend: "stable",
      market: "Pune Mandi"
    },
    {
      crop: "Maize",
      price: 1850,
      unit: "quintal",
      change: 25,
      changePercent: 1.4,
      trend: "up",
      market: "Hyderabad APMC"
    },
    {
      crop: "Soybean",
      price: 4500,
      unit: "quintal",
      change: -100,
      changePercent: -2.2,
      trend: "down",
      market: "Indore Mandi"
    }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-success';
      case 'down': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getBadgeVariant = (trend: string) => {
    switch (trend) {
      case 'up': return 'default';
      case 'down': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-foreground">
            <IndianRupee className="h-5 w-5 mr-2 text-primary" />
            Market Prices
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          Updated {lastUpdated}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {marketData.map((item, index) => (
            <div 
              key={index}
              className={`
                flex items-center justify-between p-4 rounded-lg border border-border/50
                hover:bg-secondary/30 transition-smooth animate-fade-in bg-background/30
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{item.crop}</h4>
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(item.trend)}
                    <span className={`font-semibold ${getTrendColor(item.trend)}`}>
                      {item.trend === 'stable' ? '0' : 
                        `${item.change > 0 ? '+' : ''}${item.change}`
                      }
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      ₹{item.price.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">per {item.unit}</p>
                  </div>
                  
                  <div className="text-right">
                    <Badge 
                      variant={getBadgeVariant(item.trend)}
                      className="mb-1"
                    >
                      {item.trend === 'stable' ? '0.0%' : 
                        `${item.changePercent > 0 ? '+' : ''}${item.changePercent}%`
                      }
                    </Badge>
                    <p className="text-xs text-muted-foreground">{item.market}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-primary/5 rounded-lg border border-primary/20">
          <h4 className="font-semibold text-foreground mb-2 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2 text-success" />
            Market Insight
          </h4>
          <p className="text-sm text-muted-foreground">
            Wheat and Cotton prices are rising due to increased demand. Consider selling 
            stored wheat at current high prices. Rice prices may stabilize next week.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketSection;