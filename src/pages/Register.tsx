import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Eye, EyeOff, ArrowLeft, User, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { postRegister } from "@/lib/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    land_size: "",
    lat: "",
    lon: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        password: formData.password,
        land_size: Number(formData.land_size),
        lat: Number(formData.lat),
        lon: Number(formData.lon)
      };
      const resp = await postRegister(payload);
      const token = resp?.token || resp?.access_token;
      if (token) {
        localStorage.setItem("auth_token", token);
      } else {
        localStorage.setItem("auth_token", "session");
      }
      try {
        localStorage.setItem("user_profile", JSON.stringify(payload));
      } catch {}
      toast({ title: "Welcome to CropDrop!", description: "Your account has been created successfully" });
      navigate("/dashboard");
    } catch (err) {
      toast({ title: "Registration failed", description: "Please try again later", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation not available", description: "Enter location manually", variant: "destructive" });
      return;
    }
    navigator.geolocation.getCurrentPosition((pos) => {
      setFormData(prev => ({ ...prev, lat: String(pos.coords.latitude.toFixed(6)), lon: String(pos.coords.longitude.toFixed(6)) }));
      toast({ title: "Location detected", description: "Coordinates filled automatically" });
    }, () => {
      toast({ title: "Location denied", description: "Enter coordinates manually", variant: "destructive" });
    }, { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg relative">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="absolute -top-16 left-0 text-muted-foreground hover:text-primary transition-smooth"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-gradient-card shadow-elevated border-border/50 backdrop-blur-sm animate-fade-in">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-primary p-3 rounded-xl shadow-green animate-pulse-glow">
                <Leaf className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-display font-bold text-foreground">
              Join CropDrop
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Create your account and start smart farming today
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground font-medium flex items-center">
                  <User className="h-4 w-4 mr-2 text-primary" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  className="bg-background/50 border-border focus:border-primary transition-smooth"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  className="bg-background/50 border-border focus:border-primary transition-smooth"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  
                  className="bg-background/50 border-border focus:border-primary transition-smooth"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-primary" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="bg-background/50 border-border focus:border-primary transition-smooth pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-foreground font-medium flex items-center">
                  <Lock className="h-4 w-4 mr-2 text-primary" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className="bg-background/50 border-border focus:border-primary transition-smooth pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="land_size" className="text-foreground font-medium">Land Size (hectares)</Label>
                  <Input
                    id="land_size"
                    type="number"
                    placeholder="e.g., 2.5"
                    value={formData.land_size}
                    onChange={(e) => handleInputChange("land_size", e.target.value)}
                    required
                    className="bg-background/50 border-border focus:border-primary transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lat" className="text-foreground font-medium">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    placeholder="auto or enter"
                    value={formData.lat}
                    onChange={(e) => handleInputChange("lat", e.target.value)}
                    required
                    className="bg-background/50 border-border focus:border-primary transition-smooth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lon" className="text-foreground font-medium">Longitude</Label>
                  <Input
                    id="lon"
                    type="number"
                    placeholder="auto or enter"
                    value={formData.lon}
                    onChange={(e) => handleInputChange("lon", e.target.value)}
                    required
                    className="bg-background/50 border-border focus:border-primary transition-smooth"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="button" variant="outline" onClick={detectLocation} className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground">
                  Detect Location
                </Button>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-primary shadow-green hover:shadow-elevated transition-smooth py-6 text-lg"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Button
                  variant="link"
                  onClick={() => navigate("/login")}
                  className="text-primary hover:text-primary-dark p-0 h-auto font-semibold"
                >
                  Sign in here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;