import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  User, 
  Send, 
  ArrowLeft,
  Sparkles,
  MessageCircle,
  Leaf,
  Lightbulb,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: number;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'bot',
      content: "Hello! I'm your AI farming assistant. I can help you with crop advice, pest management, weather insights, and farming best practices. What would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    "What's the best time to plant tomatoes?",
    "How to prevent crop diseases?",
    "When should I harvest wheat?",
    "What fertilizer is best for rice?"
  ];

  const botResponses = [
    "Based on your location and crop type, I recommend applying organic fertilizer during the early growing season. This will provide essential nutrients while improving soil health.",
    "For optimal growth, ensure your crops receive adequate water (about 1-2 inches per week) and maintain proper spacing to prevent overcrowding and disease spread.",
    "The symptoms you describe suggest a common fungal infection. Apply copper-based fungicide and improve air circulation around your plants to prevent further spread.",
    "Current weather conditions are favorable for planting. However, I recommend waiting 2-3 days as rainfall is expected which will provide natural irrigation for your seeds.",
    "Your soil pH seems slightly acidic. Adding lime can help balance it, which will improve nutrient uptake and overall plant health for most crops.",
    "That's an excellent question! Based on seasonal patterns, I suggest starting with disease-resistant varieties and implementing crop rotation to maintain soil fertility."
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newUserMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      const botMessage: Message = {
        id: Date.now() + 1,
        type: 'bot',
        content: randomResponse,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-glass backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-primary p-2 rounded-xl shadow-green animate-pulse-glow">
                <Bot className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold text-foreground">AI Farming Assistant</h1>
                <p className="text-sm text-muted-foreground">Get instant farming advice and support</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Quick Actions Sidebar */}
          <div className="space-y-4">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center text-foreground">
                  <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left justify-start h-auto p-3 text-xs hover:bg-secondary/50 text-muted-foreground hover:text-primary"
                  >
                    {question}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardContent className="p-4 text-center">
                <div className="bg-gradient-primary/10 p-3 rounded-full w-12 h-12 mx-auto mb-3">
                  <Sparkles className="h-6 w-6 text-primary mx-auto" />
                </div>
                <h4 className="font-semibold text-foreground text-sm mb-1">AI Powered</h4>
                <p className="text-xs text-muted-foreground">
                  Advanced farming intelligence at your fingertips
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth h-full flex flex-col">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center text-foreground">
                  <MessageCircle className="h-5 w-5 mr-2 text-primary" />
                  Chat with AI Assistant
                  <Badge variant="outline" className="ml-auto bg-success/10 text-success border-success/20">
                    Online
                  </Badge>
                </CardTitle>
              </CardHeader>

              {/* Messages */}
              <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 animate-fade-in ${
                        message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div className={`
                        p-2 rounded-lg shadow-card
                        ${message.type === 'user' 
                          ? 'bg-gradient-primary text-primary-foreground' 
                          : 'bg-secondary/50 border border-border/50'
                        }
                      `}>
                        {message.type === 'user' ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      
                      <div className={`flex-1 max-w-[80%] ${
                        message.type === 'user' ? 'text-right' : ''
                      }`}>
                        <div className={`
                          p-4 rounded-lg shadow-card
                          ${message.type === 'user'
                            ? 'bg-gradient-primary text-primary-foreground ml-auto'
                            : 'bg-background/50 border border-border/50'
                          }
                        `}>
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        </div>
                        <div className="flex items-center mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start space-x-3 animate-fade-in">
                      <div className="p-2 rounded-lg bg-secondary/50 border border-border/50 shadow-card">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-background/50 border border-border/50 p-4 rounded-lg shadow-card">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="border-t border-border/50 p-4">
                <div className="flex space-x-3">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about farming..."
                    className="flex-1 bg-background/50 border-border focus:border-primary transition-smooth"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-primary shadow-green hover:shadow-elevated transition-smooth"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Ask about crops, weather, pests, fertilizers, or any farming topic
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;