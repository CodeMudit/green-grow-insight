import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Newspaper, 
  Clock, 
  ExternalLink,
  ChevronRight,
  RefreshCw
} from "lucide-react";

const NewsSection = () => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const [newsData] = useState([
    {
      id: 1,
      title: "Government Announces New Crop Insurance Scheme for 2024",
      summary: "The government has launched a comprehensive crop insurance program that covers weather-related damages and provides better compensation rates for farmers.",
      category: "Policy",
      time: "2 hours ago",
      source: "Agriculture Today",
      urgent: false
    },
    {
      id: 2,
      title: "Monsoon Forecast: Above Normal Rainfall Expected This Season",
      summary: "IMD predicts 106% of normal rainfall this monsoon season, which could boost kharif crop production significantly across major agricultural states.",
      category: "Weather",
      time: "4 hours ago", 
      source: "Weather Central",
      urgent: true
    },
    {
      id: 3,
      title: "New Organic Farming Certification Process Simplified",
      summary: "The certification process for organic farming has been streamlined with digital documentation and faster approval times to encourage more farmers.",
      category: "Technology",
      time: "6 hours ago",
      source: "Farming Tech",
      urgent: false
    },
    {
      id: 4,
      title: "Record High Wheat Prices in International Markets",
      summary: "Global wheat prices reach 5-year high due to supply constraints, creating export opportunities for Indian farmers with quality produce.",
      category: "Market",
      time: "8 hours ago",
      source: "Market Watch",
      urgent: true
    },
    {
      id: 5,
      title: "AI-Powered Pest Detection Technology Launched",
      summary: "New mobile app uses artificial intelligence to identify crop pests and diseases from photos, providing instant treatment recommendations.",
      category: "Technology", 
      time: "12 hours ago",
      source: "AgriTech News",
      urgent: false
    },
    {
      id: 6,
      title: "Minimum Support Price Increased for Kharif Crops",
      summary: "MSP for paddy, cotton, and sugarcane increased by 4-6% to ensure better returns for farmers in the upcoming kharif season.",
      category: "Policy",
      time: "1 day ago",
      source: "Policy Update",
      urgent: false
    }
  ]);

  // Auto-scroll news
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [newsData.length]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'policy': return 'bg-primary/10 text-primary border-primary/20';
      case 'weather': return 'bg-warning/10 text-warning border-warning/20';
      case 'technology': return 'bg-accent/10 text-accent border-accent/20';
      case 'market': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-secondary text-secondary-foreground border-border';
    }
  };

  const handleNewsClick = (index: number) => {
    setCurrentNewsIndex(index);
  };

  return (
    <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-foreground">
            <Newspaper className="h-5 w-5 mr-2 text-primary" />
            Latest Agricultural News
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Featured News - Sliding */}
        <div className="mb-6 relative overflow-hidden">
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentNewsIndex * 100}%)` }}
          >
            {newsData.map((news, index) => (
              <div 
                key={news.id}
                className="w-full flex-shrink-0 p-6 bg-gradient-primary/5 rounded-lg border border-primary/20"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge 
                      className={getCategoryColor(news.category)}
                      variant="outline"
                    >
                      {news.category}
                    </Badge>
                    {news.urgent && (
                      <Badge variant="destructive" className="text-xs animate-pulse">
                        URGENT
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {news.time}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {news.summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{news.source}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary hover:text-primary-dark"
                  >
                    Read More
                    <ExternalLink className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {/* News Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-4">
            {newsData.map((_, index) => (
              <button
                key={index}
                onClick={() => handleNewsClick(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${currentNewsIndex === index 
                    ? 'bg-primary w-8' 
                    : 'bg-border hover:bg-primary/50'
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* News List */}
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground mb-4">All News</h4>
          {newsData.slice(0, 4).map((news, index) => (
            <div 
              key={news.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border border-border/50
                hover:bg-secondary/30 transition-smooth cursor-pointer animate-fade-in
                ${index === currentNewsIndex ? 'bg-primary/5 border-primary/20' : 'bg-background/30'}
              `}
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleNewsClick(index)}
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge 
                    className={`${getCategoryColor(news.category)} text-xs px-2 py-1`}
                    variant="outline"
                  >
                    {news.category}
                  </Badge>
                  {news.urgent && (
                    <Badge variant="destructive" className="text-xs">
                      URGENT
                    </Badge>
                  )}
                </div>
                <h5 className="font-medium text-foreground text-sm line-clamp-1 mb-1">
                  {news.title}
                </h5>
                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>{news.time}</span>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
        
        <Button 
          variant="outline" 
          className="w-full mt-4 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
        >
          View All News
          <ExternalLink className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsSection;