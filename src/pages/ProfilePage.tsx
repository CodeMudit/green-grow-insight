import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit,
  Camera,
  Save,
  Bell,
  Shield,
  Leaf
} from "lucide-react";
import MainLayout from "@/components/MainLayout";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile } from "@/lib/api";

const ProfilePage = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    farmSize: "",
    experience: "",
    crops: [] as string[],
    joinDate: ""
  });

  useEffect(() => {
    (async () => {
      try {
        // Prefer backend profile if we have phone
        const local = localStorage.getItem("user_profile");
        const phone = local ? JSON.parse(local)?.phone : null;
        if (phone) {
          try {
            const data = await getUserProfile(phone);
            const loc = data?.location;
            setProfile({
              name: data?.name || "",
              email: data?.email || "",
              phone: data?.phone || "",
              location: loc?.district && loc?.state ? `${loc.district}, ${loc.state}` : "",
              farmSize: data?.land_size ? `${data.land_size} hectares` : "",
              experience: "",
              crops: [],
              joinDate: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
            });
            return;
          } catch {}
        }
        // Fallback to local if backend unavailable
        if (local) {
          const u = JSON.parse(local);
          setProfile({
            name: u.name || "",
            email: u.email || "",
            phone: u.phone || "",
            location: u.state && u.district ? `${u.district}, ${u.state}` : "",
            farmSize: u.land_size ? `${u.land_size} hectares` : "",
            experience: "",
            crops: [],
            joinDate: new Date().toLocaleString('default', { month: 'long', year: 'numeric' })
          });
        }
      } catch {}
    })();
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated"
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-display font-bold text-foreground mb-8">
            Farmer Profile
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <Card className="lg:col-span-1 bg-gradient-card shadow-card">
              <CardContent className="p-6 text-center">
                <div className="relative mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src="/placeholder-avatar.jpg" />
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                      JK
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute bottom-0 right-1/3 rounded-full border-primary/20"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-2">{profile.name}</h3>
                <p className="text-muted-foreground mb-4">Smart Farmer</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{profile.location}</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Leaf className="h-4 w-4 text-success" />
                    <span className="text-muted-foreground">{profile.experience} farming</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">Member since {profile.joinDate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center text-foreground">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      Personal Information
                    </CardTitle>
                    <Button
                      variant="outline"
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="border-primary/20 text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditing ? 'Save' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-foreground font-medium">Full Name</Label>
                      {isEditing ? (
                        <Input value={profile.name} className="mt-1" readOnly />
                      ) : (
                        <p className="mt-1 text-muted-foreground">{profile.name}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-foreground font-medium">Email Address</Label>
                      {isEditing ? (
                        <Input value={profile.email} className="mt-1" readOnly />
                      ) : (
                        <p className="mt-1 text-muted-foreground">{profile.email}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-foreground font-medium">Phone Number</Label>
                      {isEditing ? (
                        <Input value={profile.phone} className="mt-1" readOnly />
                      ) : (
                        <p className="mt-1 text-muted-foreground">{profile.phone}</p>
                      )}
                    </div>
                    <div>
                      <Label className="text-foreground font-medium">Farm Size</Label>
                      {isEditing ? (
                        <Input value={profile.farmSize} className="mt-1" readOnly />
                      ) : (
                        <p className="mt-1 text-muted-foreground">{profile.farmSize}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center text-foreground">
                    <Leaf className="h-5 w-5 mr-2 text-success" />
                    Farming Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground font-medium">Primary Crops</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile.crops.map((crop, index) => (
                          <Badge key={index} variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {crop}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;