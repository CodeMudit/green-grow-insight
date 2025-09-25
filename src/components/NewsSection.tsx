import { useState, useEffect } from "react";
import { getCropNews } from "@/lib/api";
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
  const [newsData, setNewsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        // Default crop: wheat
        const data = await getCropNews("wheat");
        if (data.articles) {
          setNewsData(data.articles);
        } else {
          setNewsData([]);
          setError("No news articles found.");
        }
      } catch (e) {
        setError("Failed to fetch news.");
        setNewsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  // Auto-scroll news
  useEffect(() => {
    if (!newsData.length) return;
    const interval = setInterval(() => {
      setCurrentNewsIndex((prev) => (prev + 1) % newsData.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [newsData.length]);

  // NewsAPI does not provide category, so fallback to 'General'
  const getCategoryColor = (category: string) => {
    switch ((category || '').toLowerCase()) {
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
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading news...</div>
        ) : error ? (
          <div className="text-center py-8 text-destructive">{error}</div>
        ) : newsData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No news articles found.</div>
        ) : (
          <>
            {/* Featured News - Sliding */}
            <div className="mb-6 relative overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentNewsIndex * 100}%)` }}
              >
                {newsData.map((news, index) => (
                  <div 
                    key={news.url || news.title || index}
                    className="w-full flex-shrink-0 p-6 bg-gradient-primary/5 rounded-lg border border-primary/20"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge 
                          className={getCategoryColor(news.category || "General")}
                          variant="outline"
                        >
                          {news.category || "General"}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {news.publishedAt ? new Date(news.publishedAt).toLocaleString() : ""}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                      {news.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{news.source?.name || "Unknown"}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary-dark"
                        asChild
                      >
                        <a href={news.url} target="_blank" rel="noopener noreferrer">
                          Read More
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
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
                  key={news.url || news.title || index}
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
                        className={`${getCategoryColor(news.category || "General")} text-xs px-2 py-1`}
                        variant="outline"
                      >
                        {news.category || "General"}
                      </Badge>
                    </div>
                    <h5 className="font-medium text-foreground text-sm line-clamp-1 mb-1">
                      {news.title}
                    </h5>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{news.source?.name || "Unknown"}</span>
                      <span>{news.publishedAt ? new Date(news.publishedAt).toLocaleString() : ""}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
              asChild
            >
              <a href="https://newsapi.org/" target="_blank" rel="noopener noreferrer">
                View All News
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default NewsSection;