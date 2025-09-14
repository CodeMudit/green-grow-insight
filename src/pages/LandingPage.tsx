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

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <Badge 
            variant="secondary" 
            className="mb-6 animate-fade-in bg-secondary/80 backdrop-blur-sm shadow-card"
          >
            <Zap className="w-4 h-4 mr-2 text-primary" />
            Smart Farming Revolution
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 animate-fade-in">
            Grow <span className="bg-gradient-primary bg-clip-text text-transparent">Smarter</span>
            <br />
            Farm <span className="bg-gradient-primary bg-clip-text text-transparent">Better</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Revolutionize your farming with AI-powered insights, real-time weather data, 
            and smart tools designed for modern agriculture.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button 
              size="lg"
              onClick={() => navigate("/register")}
              className="bg-gradient-primary shadow-green hover:shadow-elevated transition-smooth text-lg px-8 py-6"
            >
              Start Farming Smart
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-smooth text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
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