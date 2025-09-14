import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  MapPin, 
  Droplets, 
  Leaf,
  ArrowLeft,
  CloudSun,
  Beaker,
  Target,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const NPKCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCalculating, setIsCalculating] = useState(false);
  const [results, setResults] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    location: "",
    soilType: "",
    cropType: "",
    fieldSize: "",
    season: ""
  });

  const soilTypes = [
    "Clay Soil",
    "Sandy Soil", 
    "Loamy Soil",
    "Silt Soil",
    "Peaty Soil",
    "Chalky Soil"
  ];

  const cropTypes = [
    "Wheat",
    "Rice", 
    "Cotton",
    "Maize",
    "Sugarcane",
    "Soybean",
    "Tomato",
    "Potato",
    "Onion"
  ];

  const seasons = [
    "Kharif (Monsoon)",
    "Rabi (Winter)",
    "Zaid (Summer)"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCalculate = async () => {
    if (!formData.location || !formData.soilType || !formData.cropType || !formData.fieldSize) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsCalculating(true);
    
    // Simulate API call with realistic NPK calculation
    setTimeout(() => {
      const mockResults = {
        nitrogen: Math.floor(Math.random() * 50) + 100, // 100-150 kg/ha
        phosphorus: Math.floor(Math.random() * 30) + 40, // 40-70 kg/ha  
        potassium: Math.floor(Math.random() * 40) + 60, // 60-100 kg/ha
        waterRequirement: Math.floor(Math.random() * 200) + 400, // 400-600 mm
        fertilizerRecommendation: {
          urea: Math.floor(Math.random() * 100) + 200, // kg/ha
          dap: Math.floor(Math.random() * 50) + 100, // kg/ha
          mop: Math.floor(Math.random() * 80) + 120 // kg/ha
        },
        soilHealth: {
          ph: (Math.random() * 2 + 6).toFixed(1), // 6.0-8.0
          organicMatter: (Math.random() * 2 + 2).toFixed(1), // 2.0-4.0%
          status: "Good"
        },
        weatherFactor: "Favorable conditions for " + formData.cropType.toLowerCase() + " cultivation"
      };
      
      setResults(mockResults);
      setIsCalculating(false);
      
      toast({
        title: "Calculation Complete!",
        description: "NPK requirements calculated based on your inputs"
      });
    }, 3000);
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
              <div className="bg-gradient-primary p-2 rounded-xl shadow-green">
                <Calculator className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold text-foreground">NPK Calculator</h1>
                <p className="text-sm text-muted-foreground">Smart Fertilizer Dosage Calculator</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Crop & Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter your city/district"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  className="bg-background/50 border-border focus:border-primary transition-smooth"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Soil Type</Label>
                <Select onValueChange={(value) => handleInputChange("soilType", value)}>
                  <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map((soil) => (
                      <SelectItem key={soil} value={soil.toLowerCase().replace(" ", "-")}>
                        {soil}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Crop Type</Label>
                <Select onValueChange={(value) => handleInputChange("cropType", value)}>
                  <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop.toLowerCase()}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fieldSize" className="text-foreground font-medium">
                  Field Size (hectares)
                </Label>
                <Input
                  id="fieldSize"
                  type="number"
                  placeholder="Enter field size"
                  value={formData.fieldSize}
                  onChange={(e) => handleInputChange("fieldSize", e.target.value)}
                  className="bg-background/50 border-border focus:border-primary transition-smooth"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Season</Label>
                <Select onValueChange={(value) => handleInputChange("season", value)}>
                  <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                    <SelectValue placeholder="Select season" />
                  </SelectTrigger>
                  <SelectContent>
                    {seasons.map((season) => (
                      <SelectItem key={season} value={season.toLowerCase().replace(" ", "-")}>
                        {season}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full bg-gradient-primary shadow-green hover:shadow-elevated transition-smooth py-6 text-lg"
              >
                {isCalculating ? (
                  <>
                    <Calculator className="h-5 w-5 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="h-5 w-5 mr-2" />
                    Calculate NPK Requirements
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* NPK Values */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Beaker className="h-5 w-5 mr-2 text-primary" />
                      NPK Requirements (per hectare)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                        <div className="text-2xl font-bold text-primary">{results.nitrogen}</div>
                        <div className="text-sm text-muted-foreground">Nitrogen (N)</div>
                        <div className="text-xs text-muted-foreground">kg/ha</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                        <div className="text-2xl font-bold text-primary">{results.phosphorus}</div>
                        <div className="text-sm text-muted-foreground">Phosphorus (P)</div>
                        <div className="text-xs text-muted-foreground">kg/ha</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                        <div className="text-2xl font-bold text-primary">{results.potassium}</div>
                        <div className="text-sm text-muted-foreground">Potassium (K)</div>
                        <div className="text-xs text-muted-foreground">kg/ha</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Fertilizer Recommendations */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <TrendingUp className="h-5 w-5 mr-2 text-success" />
                      Fertilizer Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div>
                        <span className="font-semibold text-foreground">Urea (46% N)</span>
                        <p className="text-sm text-muted-foreground">Primary nitrogen source</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {results.fertilizerRecommendation.urea} kg/ha
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div>
                        <span className="font-semibold text-foreground">DAP (18-46-0)</span>
                        <p className="text-sm text-muted-foreground">Phosphorus supplement</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {results.fertilizerRecommendation.dap} kg/ha
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div>
                        <span className="font-semibold text-foreground">MOP (60% K2O)</span>
                        <p className="text-sm text-muted-foreground">Potassium source</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                        {results.fertilizerRecommendation.mop} kg/ha
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Water & Soil Info */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Droplets className="h-5 w-5 mr-2 text-primary" />
                      Water & Soil Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Water Requirement</span>
                      <span className="font-semibold text-primary">{results.waterRequirement} mm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Soil pH</span>
                      <span className="font-semibold text-foreground">{results.soilHealth.ph}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Organic Matter</span>
                      <span className="font-semibold text-foreground">{results.soilHealth.organicMatter}%</span>
                    </div>
                    <div className="p-3 bg-gradient-primary/5 rounded-lg border border-primary/20">
                      <div className="flex items-center mb-2">
                        <CloudSun className="h-4 w-4 mr-2 text-warning" />
                        <span className="font-semibold text-foreground">Weather Consideration</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{results.weatherFactor}</p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gradient-card shadow-card border-border/50">
                <CardContent className="p-12 text-center">
                  <div className="bg-gradient-primary/10 p-6 rounded-full w-24 h-24 mx-auto mb-6">
                    <Calculator className="h-12 w-12 text-primary mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Calculate
                  </h3>
                  <p className="text-muted-foreground">
                    Fill in your crop and location details to get personalized NPK recommendations
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NPKCalculator;