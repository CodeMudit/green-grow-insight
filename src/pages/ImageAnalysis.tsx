import { useState, useRef, useEffect } from "react";
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
  Bug,
  Brain,
  Zap,
  Search,
  Microscope,
  Eye,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { postAnalyzeImage, getAssetUrl } from "@/lib/api";

const ImageAnalysis = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

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
    try {
      // Convert data URL back to File for upload
      const res = await fetch(uploadedImage);
      const blob = await res.blob();
      const file = new File([blob], "upload.png", { type: blob.type || "image/png" });
      const data = await postAnalyzeImage(file, true, "hinglish");
      const result = {
        disease: {
          name: data?.analysis_result?.predicted_class || "Unknown",
          confidence: Math.round((data?.analysis_result?.confidence || 0) * 100),
          severity: "Medium",
          description: data?.detailed_info || "",
          treatment: data?.analysis_result?.cure || "",
          prevention: data?.analysis_result?.cause || ""
        },
        additionalInfo: {
          cropType: data?.analysis_result?.crop || "",
          analysisDate: new Date(data?.timestamp || Date.now()).toLocaleDateString(),
          weatherConditions: ""
        },
        image_url: data?.image_url ? getAssetUrl(data.image_url) : undefined,
        voice_url: data?.voice_url ? getAssetUrl(data.voice_url) : undefined
      };
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete!",
        description: `Detected: ${result.disease.name}`
      });
    } catch (e) {
      setAnalysisResult({ error: "Unable to analyze the image right now." });
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze the image right now",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Cleanup audio on component unmount or page navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        URL.revokeObjectURL(currentAudio.src);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && currentAudio) {
        currentAudio.pause();
        setIsSpeaking(false);
        setCurrentAudio(null);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
        URL.revokeObjectURL(currentAudio.src);
      }
    };
  }, [currentAudio]);

  const speakResult = async () => {
    if (!analysisResult || !analysisResult.voice_url) {
      toast({
        title: "Voice Not Available",
        description: "No voice result available for this analysis.",
        variant: "destructive"
      });
      return;
    }

    // If currently playing, stop the audio
    if (isSpeaking && currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      URL.revokeObjectURL(currentAudio.src);
      setCurrentAudio(null);
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    try {
      const response = await fetch(analysisResult.voice_url);
      if (!response.ok) throw new Error("Failed to fetch audio");
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new window.Audio(audioUrl);
      
      audio.onended = () => {
        setIsSpeaking(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        setCurrentAudio(null);
        URL.revokeObjectURL(audioUrl);
        toast({
          title: "Speech Error",
          description: "Unable to play audio",
          variant: "destructive"
        });
      };
      
      setCurrentAudio(audio);
      await audio.play();
    } catch (e) {
      setIsSpeaking(false);
      setCurrentAudio(null);
      toast({
        title: "Speech Error",
        description: "Unable to play audio",
        variant: "destructive"
      });
    }
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
    <MainLayout>
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
            {isAnalyzing ? (
              <Card className="bg-gradient-card shadow-card hover:shadow-elevated transition-smooth animate-fade-in">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Main Loading Animation */}
                    <div className="relative mx-auto w-32 h-32">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-success/20 rounded-full animate-ping"></div>
                      <div className="absolute inset-4 bg-gradient-to-r from-primary/40 to-success/40 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute inset-8 bg-gradient-to-r from-primary/60 to-success/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                      <div className="relative flex items-center justify-center w-full h-full bg-gradient-primary rounded-full shadow-lg">
                        <Brain className="h-12 w-12 text-primary-foreground animate-pulse" />
                      </div>
                    </div>
                    
                    {/* Title */}
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        AI Analysis in Progress
                      </h3>
                      <p className="text-muted-foreground">
                        Our advanced AI is examining your crop image...
                      </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                          <div className="relative">
                            <Search className="h-8 w-8 text-primary animate-bounce" style={{animationDelay: '0s'}} />
                            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-warning animate-pulse" />
                          </div>
                          <span className="text-sm font-medium text-foreground">Scanning</span>
                          <span className="text-xs text-muted-foreground text-center">Detecting crop features</span>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
                          <div className="relative">
                            <Microscope className="h-8 w-8 text-success animate-bounce" style={{animationDelay: '0.3s'}} />
                            <Zap className="absolute -top-1 -right-1 h-4 w-4 text-warning animate-pulse" style={{animationDelay: '0.2s'}} />
                          </div>
                          <span className="text-sm font-medium text-foreground">Analyzing</span>
                          <span className="text-xs text-muted-foreground text-center">Identifying diseases</span>
                        </div>
                        
                        <div className="flex flex-col items-center space-y-2 p-4 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg border border-warning/20">
                          <div className="relative">
                            <Eye className="h-8 w-8 text-warning animate-bounce" style={{animationDelay: '0.6s'}} />
                            <Brain className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-pulse" style={{animationDelay: '0.4s'}} />
                          </div>
                          <span className="text-sm font-medium text-foreground">Processing</span>
                          <span className="text-xs text-muted-foreground text-center">Generating insights</span>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Analysis Progress</span>
                          <span>Processing...</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-primary via-success to-warning rounded-full animate-pulse transition-all duration-2000" 
                               style={{width: '75%', animation: 'loading-progress 3s ease-in-out infinite'}}></div>
                        </div>
                      </div>
                    </div>

                    {/* Status Messages */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-primary/5 to-success/5 rounded-lg border border-primary/10">
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        <span className="text-sm text-foreground font-medium">Applying deep learning algorithms...</span>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">
                          This usually takes 10-30 seconds depending on image complexity
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : analysisResult ? (
              <>
                {analysisResult.error && (
                  <div className="mb-4 text-destructive text-sm text-center">{analysisResult.error}</div>
                )}
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
                        className={`inline-flex items-center justify-center h-9 rounded-md border px-3 text-sm font-medium transition-all ${
                          isSpeaking 
                            ? 'border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground animate-pulse' 
                            : 'border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground'
                        }`}
                        aria-label={isSpeaking ? "Stop audio" : "Play analysis audio"}
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
    </MainLayout>
  );
};

export default ImageAnalysis;