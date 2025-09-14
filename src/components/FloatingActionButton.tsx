import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Bot, 
  Camera, 
  Calculator,
  X,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const tools = [
    {
      icon: Camera,
      label: "Image Analysis",
      description: "Detect crop diseases from photos",
      color: "text-success",
      bgColor: "bg-success/10",
      onClick: () => navigate("/image-analysis")
    },
    {
      icon: Calculator,
      label: "NPK Calculator", 
      description: "Calculate fertilizer requirements",
      color: "text-warning",
      bgColor: "bg-warning/10",
      onClick: () => navigate("/npk-calculator")
    },
    {
      icon: Bot,
      label: "AI Chatbot",
      description: "Get farming advice instantly",
      color: "text-primary",
      bgColor: "bg-primary/10",
      onClick: () => navigate("/chatbot")
    }
  ];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tool Cards */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 space-y-3 w-64 animate-fade-in">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={index}
                className={`
                  cursor-pointer transform transition-all duration-300 hover:scale-105
                  bg-gradient-card shadow-elevated border-border/50 backdrop-blur-sm
                  animate-slide-in-right
                `}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={tool.onClick}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${tool.bgColor}`}>
                      <Icon className={`h-5 w-5 ${tool.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground text-sm">
                        {tool.label}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={handleToggle}
        className={`
          h-16 w-16 rounded-full shadow-elevated hover:shadow-glow
          bg-gradient-primary transition-all duration-300 hover:scale-110
          ${isOpen ? 'rotate-45' : 'rotate-0'}
        `}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <Sparkles className="h-6 w-6 text-primary-foreground animate-pulse" />
        )}
      </Button>
    </div>
  );
};

export default FloatingActionButton;