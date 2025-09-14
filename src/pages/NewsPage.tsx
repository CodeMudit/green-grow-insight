import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Newspaper, 
  Clock, 
  ExternalLink,
  Search,
  Filter,
  Bookmark,
  Share,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle,
  Calendar,
  Tag,
  Globe
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

const NewsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookmarked, setBookmarked] = useState<number[]>([]);

  const categories = ["All", "Policy", "Weather", "Technology", "Market", "Research"];

  const newsData = [
    {
      id: 1,
      title: "Government Announces Historic ₹10,000 Crore Agriculture Package",
      summary: "The government has unveiled a comprehensive agriculture support package focusing on crop insurance, subsidized fertilizers, and infrastructure development to boost farmer income.",
      content: "In a landmark decision, the government today announced a ₹10,000 crore agriculture package that aims to revolutionize farming practices across India. The package includes enhanced crop insurance coverage, subsidized organic fertilizers, and massive infrastructure investments in rural areas.",
      category: "Policy",
      source: "Agriculture Ministry",
      author: "Dr. Rajesh Kumar",
      time: "2 hours ago",
      readTime: "3 min read",
      urgent: true,
      image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "AI-Powered Crop Disease Detection Achieves 98% Accuracy",
      summary: "Revolutionary artificial intelligence system developed by IIT researchers can identify crop diseases with unprecedented accuracy using smartphone cameras.",
      content: "Researchers at IIT Delhi have developed an groundbreaking AI system that can detect crop diseases with 98% accuracy using simple smartphone cameras. The technology has been successfully tested across 50,000 farms.",
      category: "Technology",
      source: "Agricultural Research Institute",
      author: "Prof. Meera Sharma",
      time: "4 hours ago", 
      readTime: "5 min read",
      urgent: false,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Monsoon Forecast: 110% Normal Rainfall Predicted",
      summary: "Indian Meteorological Department predicts above-normal monsoon with excellent prospects for kharif crop production across major agricultural states.",
      content: "The India Meteorological Department has forecasted 110% of normal rainfall for this monsoon season, creating optimal conditions for kharif crops including rice, cotton, and sugarcane.",
      category: "Weather",
      source: "IMD Weather Service",
      author: "Dr. Anil Verma",
      time: "6 hours ago",
      readTime: "4 min read",
      urgent: true,
      image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=400&h=200&fit=crop"
    },
    {
      id: 4,
      title: "Wheat Export Ban Lifted as Domestic Prices Stabilize",
      summary: "Government removes wheat export restrictions as domestic production exceeds expectations and market prices show stability across major trading hubs.",
      content: "The government has officially lifted the wheat export ban imposed earlier this year, citing improved domestic production and stable market prices. This move is expected to boost farmer incomes significantly.",
      category: "Market",
      source: "Commerce Ministry",
      author: "Sanjay Patel",
      time: "8 hours ago",
      readTime: "3 min read",
      urgent: false,
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop"
    },
    {
      id: 5,
      title: "Organic Farming Adoption Increases 35% in Rural Maharashtra",
      summary: "Maharashtra reports significant surge in organic farming practices with over 2 lakh farmers transitioning to chemical-free agriculture methods.",
      content: "Maharashtra's organic farming initiative has seen remarkable success with 35% increase in adoption rates. The state government's subsidies and training programs have encouraged over 200,000 farmers to switch to organic methods.",
      category: "Research",
      source: "Maharashtra Agriculture Dept",
      author: "Dr. Priya Desai",
      time: "12 hours ago",
      readTime: "4 min read",
      urgent: false,
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=200&fit=crop"
    },
    {
      id: 6,
      title: "New Drought-Resistant Cotton Varieties Released",
      summary: "Agricultural scientists release five new cotton varieties that can withstand severe drought conditions while maintaining high yield potential.",
      content: "The Central Institute for Cotton Research has released five new drought-resistant cotton varieties that can survive with 30% less water while maintaining yields of up to 25 quintals per hectare.",
      category: "Research",
      source: "CICR Research Center",
      author: "Dr. Ramesh Gupta",
      time: "1 day ago",
      readTime: "6 min read",
      urgent: false,
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=200&fit=crop"
    }
  ];

  const filteredNews = newsData.filter(news => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || news.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'policy': return 'bg-primary/10 text-primary border-primary/20';
      case 'weather': return 'bg-warning/10 text-warning border-warning/20';
      case 'technology': return 'bg-accent/10 text-accent border-accent/20';
      case 'market': return 'bg-success/10 text-success border-success/20';
      case 'research': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-secondary text-secondary-foreground border-border';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'policy': return Info;
      case 'weather': return AlertTriangle;
      case 'technology': return TrendingUp;
      case 'market': return TrendingUp;
      case 'research': return CheckCircle;
      default: return Newspaper;
    }
  };

  const toggleBookmark = (newsId: number) => {
    setBookmarked(prev => 
      prev.includes(newsId) 
        ? prev.filter(id => id !== newsId)
        : [...prev, newsId]
    );
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Agricultural News
          </h1>
          <p className="text-muted-foreground mb-6">
            Stay updated with the latest developments in agriculture and farming
          </p>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border focus:border-primary"
              />
            </div>
            
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'bg-gradient-primary shadow-green' 
                      : 'hover:bg-secondary/50'
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Featured News */}
        {filteredNews.length > 0 && (
          <Card className="mb-8 overflow-hidden bg-gradient-card shadow-elevated border-border/50">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative">
                <img 
                  src={filteredNews[0].image} 
                  alt={filteredNews[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {filteredNews[0].urgent && (
                  <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground animate-pulse">
                    BREAKING
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge 
                    variant="outline"
                    className={getCategoryColor(filteredNews[0].category)}
                  >
                    {filteredNews[0].category}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {filteredNews[0].time}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">
                  {filteredNews[0].title}
                </h2>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {filteredNews[0].summary}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    By {filteredNews[0].author} • {filteredNews[0].readTime}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleBookmark(filteredNews[0].id)}
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Bookmark className={`h-4 w-4 ${bookmarked.includes(filteredNews[0].id) ? 'fill-current' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-primary shadow-green hover:shadow-elevated"
                    >
                      Read More
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.slice(1).map((news, index) => {
            const CategoryIcon = getCategoryIcon(news.category);
            return (
              <Card 
                key={news.id}
                className="group overflow-hidden bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer animate-fade-in border-border/50"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <img 
                    src={news.image} 
                    alt={news.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  
                  <div className="absolute top-4 left-4">
                    <Badge 
                      variant="outline"
                      className={`${getCategoryColor(news.category)} backdrop-blur-sm`}
                    >
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {news.category}
                    </Badge>
                  </div>
                  
                  {news.urgent && (
                    <Badge className="absolute top-4 right-4 bg-destructive text-destructive-foreground animate-pulse">
                      URGENT
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {news.time}
                    </div>
                    <span>{news.readTime}</span>
                  </div>
                  
                  <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {news.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {news.summary}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{news.source}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(news.id);
                        }}
                        className="text-muted-foreground hover:text-primary p-1"
                      >
                        <Bookmark className={`h-4 w-4 ${bookmarked.includes(news.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-primary p-1"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <Card className="text-center py-12 bg-gradient-card shadow-card">
            <CardContent>
              <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No news found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}

        {/* Load More */}
        {filteredNews.length > 0 && (
          <div className="text-center mt-8">
            <Button 
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Load More Articles
              <TrendingUp className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default NewsPage;