
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Palette, Image, Check } from 'lucide-react';

const ThemeCustomizer = () => {
  const { store, updateStore, updateStoreLogo, updateStoreTheme } = useStore();
  const { toast } = useToast();
  const [previewLogo, setPreviewLogo] = useState<string | null>(null);
  const [storeName, setStoreName] = useState(store.name);
  
  // Theme settings
  const [primaryColor, setPrimaryColor] = useState(store.theme.primaryColor);
  const [accentColor, setAccentColor] = useState(store.theme.accentColor);
  const [borderRadius, setBorderRadius] = useState(store.theme.borderRadius);
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Preview the image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewLogo(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // In a real app, we would upload the file to a server here
    // For demo, we'll simulate it with the FileReader result
  };
  
  const handleSaveLogo = () => {
    if (previewLogo) {
      updateStoreLogo(previewLogo);
      toast({
        title: "Logo Updated",
        description: "Your store logo has been updated successfully.",
      });
      setPreviewLogo(null);
    }
  };
  
  const handleSaveTheme = () => {
    updateStoreTheme({
      primaryColor,
      accentColor,
      borderRadius,
    });
    
    updateStore({
      name: storeName,
    });
    
    toast({
      title: "Theme Updated",
      description: "Your store appearance has been updated successfully.",
    });
    
    // Refresh CSS variables (in a real app this would be more robust)
    document.documentElement.style.setProperty('--primary', primaryColor);
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--radius', borderRadius);
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit size={18} />
            Store Information
          </CardTitle>
          <CardDescription>
            Update your store name and logo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input 
              id="storeName" 
              value={storeName} 
              onChange={(e) => setStoreName(e.target.value)} 
            />
          </div>
          
          <div className="space-y-4">
            <Label>Store Logo</Label>
            <div className="flex items-center gap-4">
              <div className="border w-16 h-16 rounded-md overflow-hidden">
                <img 
                  src={previewLogo || store.logo} 
                  alt="Store Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <Label
                  htmlFor="logo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md"
                >
                  <Image size={16} />
                  Change Logo
                </Label>
              </div>
            </div>
            
            {previewLogo && (
              <Button 
                size="sm" 
                onClick={handleSaveLogo}
                className="mt-2"
              >
                <Check size={16} className="mr-2" />
                Save Logo
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={18} />
            Visual Theme
          </CardTitle>
          <CardDescription>
            Customize colors and visual elements
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="primaryColor"
                value={`hsl(${primaryColor.split(' ')[0]}, ${primaryColor.split(' ')[1]}, ${primaryColor.split(' ')[2]})`}
                onChange={(e) => {
                  // Convert hex to HSL
                  const hex = e.target.value;
                  // For demo purposes, we'll just use a preset HSL value
                  setPrimaryColor("220 80% 50%");
                }}
                className="w-12 h-12 p-1 rounded-md"
              />
              <Input 
                value={primaryColor} 
                onChange={(e) => setPrimaryColor(e.target.value)}
                placeholder="220 80% 50%" 
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Format: Hue Saturation% Lightness% (e.g., 220 80% 50%)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                id="accentColor"
                value={`hsl(${accentColor.split(' ')[0]}, ${accentColor.split(' ')[1]}, ${accentColor.split(' ')[2]})`}
                onChange={(e) => {
                  // For demo purposes, we'll just use a preset HSL value
                  setAccentColor("30 80% 50%");
                }}
                className="w-12 h-12 p-1 rounded-md"
              />
              <Input 
                value={accentColor} 
                onChange={(e) => setAccentColor(e.target.value)}
                placeholder="30 80% 50%" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="borderRadius">Border Radius</Label>
            <Input 
              id="borderRadius" 
              value={borderRadius} 
              onChange={(e) => setBorderRadius(e.target.value)}
              placeholder="1rem" 
            />
            <p className="text-xs text-muted-foreground">
              Format: CSS value (e.g., 1rem, 8px, 0.5em)
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveTheme}>
            Save Changes
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThemeCustomizer;
