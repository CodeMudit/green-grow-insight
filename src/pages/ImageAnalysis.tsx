import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Upload, 
  ArrowLeft,
  Image as ImageIcon,
  Volume2,
  VolumeX,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Bug
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const ImageAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedImage) {
      toast({
        title: "No Image Selected",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockDiseases = [
        {
          name: "Late Blight",
          confidence: 92,
          severity: "High",
          description: "Late blight is a serious disease that affects potato and tomato plants. Dark, water-soaked spots appear on leaves and stems.",
          treatment: "Apply copper-based fungicides immediately. Remove affected leaves and ensure good air circulation.",
          prevention: "Plant resistant varieties, avoid overhead watering, and maintain proper spacing between plants."
        },
        {
          name: "Leaf Spot",
          confidence: 87,
          severity: "Medium", 
          description: "Fungal leaf spot causes circular brown spots with yellow halos on leaves, leading to premature leaf drop.",
          treatment: "Use fungicidal sprays containing chlorothalonil or copper. Remove infected leaves and debris.",
          prevention: "Avoid watering foliage, improve air circulation, and practice crop rotation."
        },
        {
          name: "Healthy Plant",
          confidence: 95,
          severity: "None",
          description: "Your plant appears healthy with no visible signs of disease or pest damage.",
          treatment: "Continue current care routine. Monitor regularly for any changes.",
          prevention: "Maintain good agricultural practices including proper watering, fertilization, and pest monitoring."
        }
      ];

      const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
      
      setAnalysisResult({
        disease: randomDisease,
        additionalInfo: {
          cropType: "Tomato Plant",
          analysisDate: new Date().toLocaleDateString(),
          weatherConditions: "Humid conditions favor disease development"
        }
      });
      
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete!",
        description: `Detected: ${randomDisease.name} (${randomDisease.confidence}% confidence)`
      });
    }, 4000);
  };

  const speakResult = () => {
    if (!analysisResult || !('speechSynthesis' in window)) {
      toast({
        title: "Speech Not Available",
        description: "Text-to-speech is not supported in your browser",
        variant: "destructive"
      });
      return;
    }

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = `Analysis results: ${analysisResult.disease.name} detected with ${analysisResult.disease.confidence}% confidence. ${analysisResult.disease.description} Treatment recommendation: ${analysisResult.disease.treatment}`;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Speech Error",
        description: "Unable to play audio",
        variant: "destructive"
      });
    };

    speechSynthesis.speak(utterance);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'none': return 'default';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return AlertTriangle;
      case 'medium': return Bug;
      case 'none': return CheckCircle;
      default: return Leaf;
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
              <div className="bg-gradient-primary p-2 rounded-xl shadow-green">
                <Camera className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-display font-semibold text-foreground">Image Analysis</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Crop Disease Detection</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Upload className="h-5 w-5 mr-2 text-primary" />
                Upload Crop Image
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Upload Area */}
              <div 
                className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-smooth"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploadedImage ? (
                  <div className="space-y-4">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded crop" 
                      className="max-h-64 mx-auto rounded-lg shadow-card"
                    />
                    <p className="text-sm text-muted-foreground">
                      Image uploaded successfully. Click to change.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gradient-primary/10 p-6 rounded-full w-20 h-20 mx-auto">
                      <ImageIcon className="h-8 w-8 text-primary mx-auto" />
                    </div>
                    <div>
                      <p className="text-foreground font-medium mb-2">
                        Upload your crop image
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click here or drag and drop your image
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Supports JPG, PNG (Max 10MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex space-x-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1 border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                <Button
                  onClick={handleAnalyze}
                  disabled={!uploadedImage || isAnalyzing}
                  className="flex-1 bg-gradient-primary shadow-green hover:shadow-elevated transition-smooth"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>

              {isAnalyzing && (
                <div className="text-center space-y-2 animate-fade-in">
                  <div className="bg-gradient-primary/10 p-4 rounded-lg">
                    <p className="text-sm text-primary font-medium">
                      AI is analyzing your image...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This may take a few moments
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {analysisResult ? (
              <>
                {/* Main Result */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth animate-fade-in">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center text-foreground">
                        <Bug className="h-5 w-5 mr-2 text-primary" />
                        Detection Results
                      </CardTitle>
                      <Button
                        onClick={speakResult}
                        variant="outline"
                        size="sm"
                        className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {isSpeaking ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {(() => {
                          const Icon = getSeverityIcon(analysisResult.disease.severity);
                          return <Icon className="h-6 w-6 text-primary" />;
                        })()}
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {analysisResult.disease.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {analysisResult.disease.confidence}% confidence
                          </p>
                        </div>
                      </div>
                      <Badge variant={getSeverityColor(analysisResult.disease.severity)}>
                        {analysisResult.disease.severity} Risk
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">
                          {analysisResult.disease.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Treatment */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center text-foreground">
                      <Leaf className="h-5 w-5 mr-2 text-success" />
                      Treatment Recommendation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {analysisResult.disease.treatment}
                    </p>
                    
                    <div className="p-4 bg-gradient-primary/5 rounded-lg border border-primary/20">
                      <h5 className="font-semibold text-foreground mb-2">Prevention Tips</h5>
                      <p className="text-sm text-muted-foreground">
                        {analysisResult.disease.prevention}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Info */}
                <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth animate-fade-in">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Crop Type:</span>
                        <p className="font-semibold text-foreground">
                          {analysisResult.additionalInfo.cropType}
                        </p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Analysis Date:</span>
                        <p className="font-semibold text-foreground">
                          {analysisResult.additionalInfo.analysisDate}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                      <span className="text-muted-foreground text-sm">Note:</span>
                      <p className="text-xs text-muted-foreground">
                        {analysisResult.additionalInfo.weatherConditions}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-gradient-card shadow-card border-border/50">
                <CardContent className="p-12 text-center">
                  <div className="bg-gradient-primary/10 p-6 rounded-full w-24 h-24 mx-auto mb-6">
                    <Camera className="h-12 w-12 text-primary mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready for Analysis
                  </h3>
                  <p className="text-muted-foreground">
                    Upload a clear image of your crop to detect diseases and get treatment recommendations
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

export default ImageAnalysis;