import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  RefreshCw,
  IndianRupee,
  Calendar,
  Search,
  Filter,
  BarChart3,
  LineChart,
  MapPin,
  AlertCircle,
  CheckCircle,
  Star,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import MainLayout from "@/components/MainLayout";

const MarketPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCrop, setSelectedCrop] = useState("All Crops");
  const [sortBy, setSortBy] = useState("price-high");

  const states = ["All States", "Maharashtra", "Punjab", "Gujarat", "Uttar Pradesh", "Karnataka", "Rajasthan"];
  const crops = ["All Crops", "Wheat", "Rice", "Cotton", "Sugarcane", "Maize", "Soybean", "Onion", "Potato"];

  const marketData = [
    {
      crop: "Wheat",
      variety: "HD-2967",
      price: 2150,
      unit: "quintal",
      change: 75,
      changePercent: 3.6,
      trend: "up",
      market: "Mumbai APMC",
      state: "Maharashtra",
      volume: "2,500 tonnes",
      quality: "FAQ",
      lastUpdated: "10 mins ago",
      prediction: "bullish",
      support: 1950,
      resistance: 2300
    },
    {
      crop: "Rice",
      variety: "Basmati-1121",
      price: 4200,
      unit: "quintal",
      change: -85,
      changePercent: -2.0,
      trend: "down",
      market: "Delhi Mandi",
      state: "Punjab",
      volume: "1,800 tonnes",
      quality: "Grade-A",
      lastUpdated: "15 mins ago",
      prediction: "bearish",
      support: 3950,
      resistance: 4400
    },
    {
      crop: "Cotton",
      variety: "Shankar-6",
      price: 6800,
      unit: "quintal",
      change: 150,
      changePercent: 2.3,
      trend: "up",
      market: "Nagpur APMC",
      state: "Maharashtra",
      volume: "3,200 tonnes",
      quality: "Medium Staple",
      lastUpdated: "5 mins ago",
      prediction: "bullish",
      support: 6500,
      resistance: 7200
    },
    {
      crop: "Sugarcane",
      variety: "Co-86032",
      price: 350,
      unit: "quintal",
      change: 0,
      changePercent: 0,
      trend: "stable",
      market: "Pune Mandi",
      state: "Maharashtra",
      volume: "5,000 tonnes",
      quality: "Standard",
      lastUpdated: "20 mins ago",
      prediction: "neutral",
      support: 330,
      resistance: 380
    },
    {
      crop: "Maize",
      variety: "NK-6240",
      price: 1850,
      unit: "quintal",
      change: 25,
      changePercent: 1.4,
      trend: "up",
      market: "Hyderabad APMC",
      state: "Karnataka",
      volume: "1,200 tonnes",
      quality: "Premium",
      lastUpdated: "8 mins ago",
      prediction: "bullish",
      support: 1750,
      resistance: 1950
    },
    {
      crop: "Soybean",
      variety: "JS-335",
      price: 4500,
      unit: "quintal",
      change: -100,
      changePercent: -2.2,
      trend: "down",
      market: "Indore Mandi",
      state: "Gujarat",
      volume: "2,800 tonnes",
      quality: "FAQ",
      lastUpdated: "12 mins ago",
      prediction: "bearish",
      support: 4200,
      resistance: 4750
    },
    {
      crop: "Onion",
      variety: "Nasik Red",
      price: 2200,
      unit: "quintal",
      change: 180,
      changePercent: 8.9,
      trend: "up",
      market: "Lasalgaon APMC",
      state: "Maharashtra",
      volume: "800 tonnes",
      quality: "Grade-1",
      lastUpdated: "3 mins ago",
      prediction: "bullish",
      support: 1950,
      resistance: 2500
    },
    {
      crop: "Potato",
      variety: "Kufri Jyoti",
      price: 1200,
      unit: "quintal",
      change: -50,
      changePercent: -4.0,
      trend: "down",
      market: "Agra Mandi",
      state: "Uttar Pradesh",
      volume: "1,500 tonnes",
      quality: "Medium",
      lastUpdated: "18 mins ago",
      prediction: "bearish",
      support: 1100,
      resistance: 1350
    }
  ];

  const filteredData = marketData
    .filter(item => {
      const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.variety.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesState = selectedState === "All States" || item.state === selectedState;
      const matchesCrop = selectedCrop === "All Crops" || item.crop === selectedCrop;
      return matchesSearch && matchesState && matchesCrop;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-high": return b.price - a.price;
        case "price-low": return a.price - b.price;
        case "change-high": return b.changePercent - a.changePercent;
        case "change-low": return a.changePercent - b.changePercent;
        default: return 0;
      }
    });

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

  const getPredictionIcon = (prediction: string) => {
    switch (prediction) {
      case 'bullish': return <ArrowUpRight className="h-4 w-4 text-success" />;
      case 'bearish': return <ArrowDownRight className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground mb-2">
                Market Prices
              </h1>
              <p className="text-muted-foreground">
                Live market data and price trends for agricultural commodities
              </p>
            </div>
            
            <Button
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search crops..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border focus:border-primary"
              />
            </div>
            
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                <SelectValue placeholder="Select Crop" />
              </SelectTrigger>
              <SelectContent>
                {crops.map((crop) => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price-high">Price (High to Low)</SelectItem>
                <SelectItem value="price-low">Price (Low to High)</SelectItem>
                <SelectItem value="change-high">Change (High to Low)</SelectItem>
                <SelectItem value="change-low">Change (Low to High)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        {/* Market Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Markets Active</p>
                  <p className="text-2xl font-bold text-foreground">247</p>
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20 mt-2">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Gainer</p>
                  <p className="text-xl font-bold text-success">Onion</p>
                  <p className="text-sm text-success">+8.9%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Top Loser</p>
                  <p className="text-xl font-bold text-destructive">Potato</p>
                  <p className="text-sm text-destructive">-4.0%</p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Volume</p>
                  <p className="text-2xl font-bold text-foreground">2.2K</p>
                  <p className="text-sm text-muted-foreground">tonnes/market</p>
                </div>
                <LineChart className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredData.map((item, index) => (
            <Card 
              key={index}
              className="group bg-gradient-card shadow-card hover:shadow-elevated transition-all duration-300 cursor-pointer animate-fade-in border-border/50"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary/10 rounded-full flex items-center justify-center">
                      <IndianRupee className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.crop}
                      </h3>
                      <p className="text-sm text-muted-foreground">{item.variety}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getTrendIcon(item.trend)}
                    <Badge variant={getBadgeVariant(item.trend)}>
                      {item.trend === 'stable' ? '0.0%' : 
                        `${item.changePercent > 0 ? '+' : ''}${item.changePercent}%`
                      }
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="mb-4">
                  <div className="flex items-baseline space-x-2 mb-1">
                    <span className="text-3xl font-bold text-foreground">
                      ₹{item.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-muted-foreground">/{item.unit}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm">
                    <span className={`font-medium ${getTrendColor(item.trend)}`}>
                      {item.trend === 'stable' ? '±0' : 
                        `${item.change > 0 ? '+' : ''}₹${Math.abs(item.change)}`
                      }
                    </span>
                    <span className="text-muted-foreground">from yesterday</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Market:</span>
                    <span className="font-medium text-foreground">{item.market}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">State:</span>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="font-medium text-foreground">{item.state}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Volume:</span>
                    <span className="font-medium text-foreground">{item.volume}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Quality:</span>
                    <Badge variant="outline" className="bg-secondary/50">
                      {item.quality}
                    </Badge>
                  </div>
                  
                  <div className="pt-3 border-t border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Prediction:</span>
                      <div className="flex items-center space-x-1">
                        {getPredictionIcon(item.prediction)}
                        <span className={`text-sm font-medium ${
                          item.prediction === 'bullish' ? 'text-success' :
                          item.prediction === 'bearish' ? 'text-destructive' : 'text-muted-foreground'
                        }`}>
                          {item.prediction}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Support:</span>
                        <span className="text-foreground">₹{item.support}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Resistance:</span>
                        <span className="text-foreground">₹{item.resistance}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Updated {item.lastUpdated}
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 px-2 text-primary hover:text-primary-dark">
                      View Chart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredData.length === 0 && (
          <Card className="text-center py-12 bg-gradient-card shadow-card">
            <CardContent>
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No market data found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </CardContent>
          </Card>
        )}

        {/* Market Insights */}
        <Card className="mt-8 bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <AlertCircle className="h-5 w-5 mr-2 text-primary" />
              Market Insights & Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-gradient-primary/5 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-success" />
                  Bullish Trend
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Wheat and Cotton showing strong upward momentum due to export demand and favorable weather conditions.
                </p>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  Recommendation: Hold/Buy
                </Badge>
              </div>
              
              <div className="p-4 bg-warning/5 rounded-lg border border-warning/20">
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2 text-warning" />
                  Watch Alert
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Rice prices under pressure due to government stock releases. Monitor for potential reversal signals.
                </p>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  Recommendation: Monitor
                </Badge>
              </div>
              
              <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <h4 className="font-semibold text-foreground mb-2 flex items-center">
                  <TrendingDown className="h-4 w-4 mr-2 text-destructive" />
                  Bearish Signal
                </h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Potato prices declining due to oversupply. Consider liquidating positions if prices break support levels.
                </p>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                  Recommendation: Sell
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default MarketPage;