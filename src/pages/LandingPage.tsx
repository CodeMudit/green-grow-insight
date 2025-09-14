import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sprout, 
  CloudSun, 
  TrendingUp, 
  Wrench, 
  ArrowRight,
  Leaf,
  BarChart3,
  Shield,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const features = [
    {
      icon: Sprout,
      title: "General Crop Advice",
      description: "Expert guidance for optimal crop management and farming techniques",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Market Insights", 
      description: "Real-time crop prices and market trends to maximize your profits",
      color: "text-accent"
    },
    {
      icon: Wrench,
      title: "Smart Tools",
      description: "AI-powered tools for crop analysis, NPK calculation, and disease detection",
      color: "text-success"
    },
    {
      icon: CloudSun,
      title: "Weather Forecast",
      description: "Accurate weather predictions tailored for agricultural planning",
      color: "text-warning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-gradient-glass backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-xl shadow-green">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-display font-semibold text-foreground">
                CropDrop
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="text-foreground hover:text-primary transition-smooth"
              >
                Sign In
              </Button>
              <Button 
                onClick={() => navigate("/register")}
                className="bg-gradient-primary shadow-green hover:shadow-elevated transition-smooth"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Stunning Animations */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-primary rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent rounded-full opacity-30 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-success rounded-full opacity-25 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-warning rounded-full opacity-15 animate-float" style={{animationDelay: '0.5s'}}></div>
        
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 gap-4 h-full animate-pulse">
            {Array.from({length: 144}).map((_, i) => (
              <div key={i} className="bg-primary rounded-sm" style={{animationDelay: `${i * 0.1}s`}}></div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          {/* Animated Badge */}
          <div className="relative mb-8">
            <Badge 
              variant="secondary" 
              className="mb-6 animate-bounce bg-gradient-glass backdrop-blur-md shadow-elevated border border-primary/20 text-lg px-6 py-3"
            >
              <Zap className="w-5 h-5 mr-2 text-primary animate-pulse" />
              Smart Farming Revolution
            </Badge>
            <div className="absolute -inset-4 bg-gradient-primary/20 rounded-full blur-xl animate-pulse-glow"></div>
          </div>
          
          {/* Animated Main Heading */}
          <div className="relative mb-8">
            <h1 className="text-6xl md:text-8xl font-display font-bold text-foreground mb-6">
              <span className="inline-block animate-fade-in hover:scale-110 transition-transform duration-500">
                Grow
              </span>{" "}
              <span 
                className="inline-block bg-gradient-primary bg-clip-text text-transparent animate-slide-in-right hover:animate-pulse-glow transition-all duration-500"
                style={{animationDelay: '0.3s'}}
              >
                Smarter
              </span>
              <br />
              <span 
                className="inline-block animate-fade-in hover:scale-110 transition-transform duration-500"
                style={{animationDelay: '0.6s'}}
              >
                Farm
              </span>{" "}
              <span 
                className="inline-block bg-gradient-primary bg-clip-text text-transparent animate-slide-in-right hover:animate-pulse-glow transition-all duration-500"
                style={{animationDelay: '0.9s'}}
              >
                Better
              </span>
            </h1>
            
            {/* Glowing underline effect */}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-primary rounded-full animate-pulse-glow"></div>
          </div>
          
          {/* Animated Description */}
          <p 
            className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in leading-relaxed"
            style={{animationDelay: '1.2s'}}
          >
            Revolutionize your farming with{" "}
            <span className="text-primary font-semibold animate-pulse">AI-powered insights</span>,{" "}
            <span className="text-accent font-semibold animate-pulse">real-time weather data</span>, 
            and <span className="text-success font-semibold animate-pulse">smart tools</span> designed for modern agriculture.
          </p>
          
          {/* Animated Buttons with Hover Effects */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in"
            style={{animationDelay: '1.5s'}}
          >
            <Button 
              size="lg"
              onClick={() => navigate("/register")}
              className="relative overflow-hidden bg-gradient-primary shadow-elevated hover:shadow-glow transition-all duration-500 text-xl px-12 py-8 group"
            >
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center">
                Start Farming Smart
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
              </span>
              
              {/* Ripple effect */}
              <div className="absolute inset-0 rounded-lg">
                <div className="absolute inset-0 bg-white/20 scale-0 group-hover:scale-100 rounded-lg transition-transform duration-500 origin-center"></div>
              </div>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="relative overflow-hidden border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-500 text-xl px-12 py-8 group backdrop-blur-sm"
            >
              <span className="relative z-10">Watch Demo</span>
              
              {/* Sliding background */}
              <div className="absolute inset-0 bg-gradient-primary translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
            </Button>
          </div>

          {/* Floating Action Indicators */}
          <div className="mt-16 flex justify-center space-x-8">
            <div className="flex flex-col items-center animate-float">
              <div className="bg-gradient-primary/10 p-4 rounded-full border border-primary/20 backdrop-blur-sm">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground mt-2">Secure</span>
            </div>
            <div className="flex flex-col items-center animate-float" style={{animationDelay: '0.5s'}}>
              <div className="bg-gradient-primary/10 p-4 rounded-full border border-primary/20 backdrop-blur-sm">
                <Zap className="h-8 w-8 text-accent" />
              </div>
              <span className="text-sm text-muted-foreground mt-2">Fast</span>
            </div>
            <div className="flex flex-col items-center animate-float" style={{animationDelay: '1s'}}>
              <div className="bg-gradient-primary/10 p-4 rounded-full border border-primary/20 backdrop-blur-sm">
                <BarChart3 className="h-8 w-8 text-success" />
              </div>
              <span className="text-sm text-muted-foreground mt-2">Smart</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center">
            <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
              <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
            </div>
            <span className="text-xs text-muted-foreground mt-2">Scroll</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive farming solutions powered by cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className={`
                    group cursor-pointer transition-all duration-500 hover:shadow-elevated
                    ${hoveredCard === index ? 'scale-105 shadow-elevated' : 'shadow-card'}
                    bg-gradient-card border-border/50 backdrop-blur-sm
                  `}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardContent className="p-6 text-center">
                    <div className={`
                      inline-flex p-4 rounded-xl mb-4 transition-all duration-500
                      ${hoveredCard === index ? 'animate-pulse-glow bg-gradient-primary' : 'bg-secondary'}
                    `}>
                      <Icon className={`h-8 w-8 transition-colors duration-500 ${
                        hoveredCard === index ? 'text-primary-foreground' : feature.color
                      }`} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-smooth">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-display font-bold text-primary animate-float">10K+</div>
              <div className="text-muted-foreground">Active Farmers</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-display font-bold text-primary animate-float" style={{animationDelay: '0.5s'}}>95%</div>
              <div className="text-muted-foreground">Accuracy Rate</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-display font-bold text-primary animate-float" style={{animationDelay: '1s'}}>24/7</div>
              <div className="text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-display font-bold text-foreground mb-6">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of farmers who are already using CropDrop to maximize their yields and profits.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-gradient-primary shadow-green hover:shadow-elevated transition-smooth text-lg px-12 py-6"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary to-primary-light text-primary-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-primary-foreground/20 p-2 rounded-xl">
              <Leaf className="h-6 w-6" />
            </div>
            <span className="text-xl font-display font-semibold">CropDrop</span>
          </div>
          <p className="text-center text-primary-foreground/80">
            © 2024 CropDrop. Empowering farmers with smart technology.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;