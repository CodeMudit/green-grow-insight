import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { 
  Newspaper, 
  TrendingUp, 
  AlertTriangle,
  Clock
} from "lucide-react";

const Newsticker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const news = [
    {
      id: 1,
      title: "🌾 Government announces ₹5000 crore agriculture package for farmers",
      category: "Policy",
      urgent: true,
      time: "2 mins ago"
    },
    {
      id: 2, 
      title: "🌧️ Monsoon expected to arrive 3 days early this year across Maharashtra",
      category: "Weather",
      urgent: false,
      time: "15 mins ago"
    },
    {
      id: 3,
      title: "📈 Wheat prices surge 12% in major markets, highest in 3 years",
      category: "Market",
      urgent: true,
      time: "1 hour ago"
    },
    {
      id: 4,
      title: "🚜 New AI-powered tractors reduce farming costs by 30%, study shows",
      category: "Technology",
      urgent: false,
      time: "2 hours ago"
    },
    {
      id: 5,
      title: "🌱 Organic farming certification process simplified by government",
      category: "Policy", 
      urgent: false,
      time: "3 hours ago"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [news.length]);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'policy': return 'bg-primary/10 text-primary border-primary/20';
      case 'weather': return 'bg-warning/10 text-warning border-warning/20';
      case 'technology': return 'bg-accent/10 text-accent border-accent/20';
      case 'market': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-secondary text-secondary-foreground border-border';
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-3 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="grid grid-cols-20 gap-2 h-full animate-slide-right">
          {Array.from({length: 100}).map((_, i) => (
            <div key={i} className="bg-primary-foreground/20 rounded-sm h-2 my-auto animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex items-center">
          {/* Breaking News Label */}
          <div className="flex items-center space-x-2 mr-6 flex-shrink-0">
            <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-md font-bold text-sm animate-pulse-scale">
              <Newspaper className="h-4 w-4 inline mr-2" />
              LIVE
            </div>
            <div className="hidden sm:flex items-center space-x-1 text-sm opacity-90">
              <Clock className="h-3 w-3" />
              <span>Breaking News</span>
            </div>
          </div>

          {/* News Content */}
          <div className="flex-1 overflow-hidden">
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {news.map((item, index) => (
                <div 
                  key={item.id}
                  className="w-full flex-shrink-0 flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-3 animate-fade-in">
                    {item.urgent && (
                      <AlertTriangle className="h-4 w-4 text-destructive-foreground animate-bounce-gentle" />
                    )}
                    
                    <Badge 
                      variant="outline"
                      className={`${getCategoryColor(item.category)} text-xs px-2 py-1 border`}
                    >
                      {item.category}
                    </Badge>
                    
                    <p className="text-sm font-medium text-primary-foreground/95 truncate">
                      {item.title}
                    </p>
                    
                    <span className="text-xs text-primary-foreground/70 whitespace-nowrap">
                      {item.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex items-center space-x-1 ml-6 flex-shrink-0">
            {news.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  w-2 h-2 rounded-full transition-all duration-300
                  ${currentIndex === index 
                    ? 'bg-primary-foreground w-6' 
                    : 'bg-primary-foreground/40 hover:bg-primary-foreground/70'
                  }
                `}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-foreground/50 to-transparent animate-shimmer"></div>
    </div>
  );
};

export default Newsticker;