import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Loader2, Droplet, Sprout, MapPin, Locate, Beaker, TrendingUp, Leaf, Calculator, ArrowLeft } from "lucide-react";
import { postMicroAdvice, getLocationFromIP, getStateFromCoordinates, getUserProfile } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useToast } from "@/hooks/use-toast";

// ✅ API function inside this file
async function postNPKCalculation(data: {
  crop_type: string;
  growth_stage: string;
  state: string;
  lang?: string;
}) {
  try {
    const res = await fetch("http://127.0.0.1:8000/get_advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error("❌ API call failed:", err);
    return { success: false, error: err.message };
  }
}

const NPKCalculator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    state: "",
    crop: "",
    growthStage: "initial",
    fieldSize: ""
  });

  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<any | null>(null);
  const [error, setError] = useState<string>("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

  const indianStates = [
    "Punjab", "Haryana", "Uttar Pradesh", "Bihar", "West Bengal",
    "Madhya Pradesh", "Maharashtra", "Gujarat", "Rajasthan",
    "Tamil Nadu", "Karnataka", "Kerala", "Andhra Pradesh",
    "Telangana", "Assam", "Odisha"
  ];

  const cropTypes = [
    "Wheat", "Rice", "Cotton", "Maize", "Sugarcane", "Soybean",
    "Tomato", "Potato", "Onion", "Groundnut", "Mustard", "Barley"
  ];

  const growthStages = [
    { value: "initial", label: "Initial Growth" },
    { value: "mid", label: "Mid Season" },
    { value: "late", label: "Late Season" }
  ];


  // Auto-detect location and load profile on mount
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const phone = localStorage.getItem('userPhone');
        if (phone) {
          const profile = await getUserProfile(phone);
          setUserProfile(profile);
          
          if (profile.land_size) {
            setForm(prev => ({ ...prev, fieldSize: profile.land_size.toString() }));
          }
          
          if (profile.lat && profile.lon) {
            try {
              const stateData = await getStateFromCoordinates(profile.lat, profile.lon);
              setForm(prev => ({ 
                ...prev, 
                state: stateData.state || ""
              }));
            } catch (error) {
              console.warn('Failed to get state from profile coordinates:', error);
            }
          }
        } else {
          handleAutoDetectLocation();
        }
      } catch (error) {
        console.warn('Failed to load user profile:', error);
        handleAutoDetectLocation();
      }
    };

    loadUserProfile();
  }, []);

  const handleAutoDetectLocation = async () => {
    if (isDetectingLocation) return;
    
    setIsDetectingLocation(true);
    try {
      let locationData;
      try {
        locationData = await getLocationFromIP();
      } catch (ipError) {
        locationData = await new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              reject(new Error(`Geolocation error: ${error.message}`));
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
          );
        });
      }
      
      if (locationData.latitude && locationData.longitude) {
        const stateData = await getStateFromCoordinates(locationData.latitude, locationData.longitude);
        
        const stateMapping = {
          'uttar pradesh': 'Uttar Pradesh',
          'west bengal': 'West Bengal',
          'madhya pradesh': 'Madhya Pradesh',
          'tamil nadu': 'Tamil Nadu',
          'andhra pradesh': 'Andhra Pradesh'
        };
        
        let mappedState = stateData.state;
        if (mappedState) {
          const lowerState = mappedState.toLowerCase();
          mappedState = stateMapping[lowerState] || mappedState;
        }
        
        setForm(prev => ({ 
          ...prev, 
          state: mappedState || ""
        }));
        
        if (mappedState) {
          toast({
            title: "Location Detected!",
            description: `Found your location: ${mappedState}`
          });
        }
      }
    } catch (error) {
      console.error('Location detection error:', error);
      toast({
        title: "Location Detection Failed",
        description: "Please select your state manually",
        variant: "destructive"
      });
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.state || !form.crop || !form.growthStage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError("");
    setAdvice(null);

    try {
      const formData = {
        crop_type: form.crop.toLowerCase(),
        growth_stage: form.growthStage,
        state: form.state.toLowerCase(),
        lang: "en",
      };

      const resp = await postMicroAdvice(formData);

      if (resp.success) {
        setAdvice(resp.advice);
        toast({
          title: "NPK Calculation Complete!",
          description: "Recommendations based on real-time data"
        });
      } else {
        setError(resp.error || "Failed to fetch advice.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
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
                <Beaker className="h-5 w-5 mr-2 text-primary" />
                Crop & Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Status */}
              {userProfile && (
                <div className="flex items-center p-3 bg-success/5 rounded-lg border border-success/20">
                  <Sprout className="h-4 w-4 mr-2 text-success" />
                  <span className="text-sm text-foreground">Profile loaded: {userProfile.name}</span>
                </div>
              )}

              {/* Location with Auto-detect */}
              <div className="space-y-2">
                <Label className="text-foreground font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  State
                </Label>
                <div className="flex gap-2">
                  <Select value={form.state} onValueChange={(value) => setForm(prev => ({...prev, state: value}))}>
                    <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleAutoDetectLocation}
                    disabled={isDetectingLocation}
                    className="shrink-0"
                  >
                    {isDetectingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Locate className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Crop Type</Label>
                <Select value={form.crop} onValueChange={(value) => setForm(prev => ({...prev, crop: value}))}>
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
                  value={form.fieldSize}
                  onChange={(e) => setForm(prev => ({...prev, fieldSize: e.target.value}))}
                  className="bg-background/50 border-border focus:border-primary transition-smooth"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground font-medium">Growth Stage</Label>
                <Select value={form.growthStage} onValueChange={(value) => setForm(prev => ({...prev, growthStage: value}))}>
                  <SelectTrigger className="bg-background/50 border-border focus:border-primary">
                    <SelectValue placeholder="Select growth stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {growthStages.map((stage) => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-primary shadow-green hover:shadow-elevated transition-smooth py-6 text-lg"
              >
                {loading ? (
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
            {advice ? (
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
                        <div className="text-2xl font-bold text-primary">{advice.fertilizer?.gaps?.n || 0}</div>
                        <div className="text-sm text-muted-foreground">Nitrogen (N)</div>
                        <div className="text-xs text-muted-foreground">kg/ha</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                        <div className="text-2xl font-bold text-primary">{advice.fertilizer?.gaps?.p || 0}</div>
                        <div className="text-sm text-muted-foreground">Phosphorus (P)</div>
                        <div className="text-xs text-muted-foreground">kg/ha</div>
                      </div>
                      <div className="text-center p-4 bg-gradient-primary/10 rounded-lg border border-primary/20">
                        <div className="text-2xl font-bold text-primary">{advice.fertilizer?.gaps?.k || 0}</div>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-foreground">Per Hectare</h4>
                        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                          <div>
                            <span className="font-semibold text-foreground">Urea (46% N)</span>
                            <p className="text-sm text-muted-foreground">Primary nitrogen source</p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {advice.fertilizer?.total_fertilizer?.urea || 0} kg/ha
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                          <div>
                            <span className="font-semibold text-foreground">DAP (18-46-0)</span>
                            <p className="text-sm text-muted-foreground">Phosphorus supplement</p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {advice.fertilizer?.total_fertilizer?.dap || 0} kg/ha
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                          <div>
                            <span className="font-semibold text-foreground">MOP (60% K2O)</span>
                            <p className="text-sm text-muted-foreground">Potassium source</p>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {advice.fertilizer?.total_fertilizer?.mop || 0} kg/ha
                          </Badge>
                        </div>
                      </div>
                      
                      {form.fieldSize && (
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Total for Your Field ({form.fieldSize} ha)</h4>
                          <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                            <div>
                              <span className="font-semibold text-foreground">Urea</span>
                              <p className="text-sm text-muted-foreground">Total quantity needed</p>
                            </div>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              {Math.round((advice.fertilizer?.total_fertilizer?.urea || 0) * parseFloat(form.fieldSize))} kg
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                            <div>
                              <span className="font-semibold text-foreground">DAP</span>
                              <p className="text-sm text-muted-foreground">Total quantity needed</p>
                            </div>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              {Math.round((advice.fertilizer?.total_fertilizer?.dap || 0) * parseFloat(form.fieldSize))} kg
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg border border-success/20">
                            <div>
                              <span className="font-semibold text-foreground">MOP</span>
                              <p className="text-sm text-muted-foreground">Total quantity needed</p>
                            </div>
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              {Math.round((advice.fertilizer?.total_fertilizer?.mop || 0) * parseFloat(form.fieldSize))} kg
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Irrigation Info */}
                {advice.irrigation && (
                  <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth animate-fade-in">
                    <CardHeader>
                      <CardTitle className="flex items-center text-foreground">
                        <Droplet className="h-5 w-5 mr-2 text-primary" />
                        Irrigation Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">ET₀ (Reference)</span>
                          <span className="font-semibold text-primary">{advice.irrigation.et0} mm/day</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">ETc (Crop)</span>
                          <span className="font-semibold text-primary">{advice.irrigation.etc} mm/day</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Current Rainfall</span>
                          <span className="font-semibold text-blue-600">{advice.irrigation.rainfall} mm</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Irrigation Needed</span>
                          <span className="font-semibold text-warning">{advice.irrigation.irrigation_need} mm</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-gradient-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-center mb-2">
                          <Leaf className="h-4 w-4 mr-2 text-warning" />
                          <span className="font-semibold text-foreground">Live Weather Data</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Data from NASA POWER API</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
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

            {/* Error */}
            {error && (
              <Card className="bg-destructive/5 border-destructive/20">
                <CardContent className="p-4">
                  <p className="text-destructive font-medium">{error}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default NPKCalculator;
