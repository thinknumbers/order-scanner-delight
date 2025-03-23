
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scan, ScanLine } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface QRScannerProps {
  onSuccess?: (result: string) => void;
}

const QRScanner = ({ onSuccess }: QRScannerProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const scannerRef = useRef<any>(null);
  
  const startScanner = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      toast({
        title: "Camera not supported",
        description: "Your browser doesn't support camera access or you're in a secure context. Please try a different browser.",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        
        // In a real implementation we would start QR code detection here
        // For demo purposes, we'll simulate a successful scan after 3 seconds
        setTimeout(() => {
          // Simulate finding a QR code that directs to the menu
          handleScanSuccess('/menu');
        }, 3000);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setHasPermission(false);
      toast({
        title: "Camera access denied",
        description: "Please allow camera access to scan QR codes.",
        variant: "destructive",
      });
    }
  };
  
  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  };
  
  const handleScanSuccess = (result: string) => {
    setScanResult(result);
    stopScanner();
    
    if (onSuccess) {
      onSuccess(result);
    }
    
    toast({
      title: "QR Code Detected",
      description: "Taking you to the menu...",
    });
    
    // In a real app, result would be the URL from the QR code.
    // For demo, we'll navigate to the menu page.
    setTimeout(() => {
      navigate('/menu');
    }, 1500);
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-sm mx-auto">
      <div 
        className={cn(
          "w-full aspect-square relative rounded-xl overflow-hidden border-2",
          isScanning ? "border-primary animate-pulse" : "border-muted",
          "transition-all duration-300"
        )}
      >
        {isScanning ? (
          <>
            <video 
              ref={videoRef}
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-3/4 h-3/4 border-2 border-primary rounded-lg relative">
                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-primary rounded-tl-md"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-primary rounded-tr-md"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-primary rounded-bl-md"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-primary rounded-br-md"></div>
              </div>
              <ScanLine 
                className="absolute text-primary animate-bounce opacity-70" 
                size={240} 
              />
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-muted/30 flex items-center justify-center">
            <Scan className="h-20 w-20 text-muted-foreground" />
          </div>
        )}
      </div>
      
      <div className="mt-6 w-full">
        {!isScanning ? (
          <Button 
            onClick={startScanner} 
            className="w-full"
            size="lg"
          >
            Scan QR Code
          </Button>
        ) : (
          <Button 
            onClick={stopScanner} 
            variant="outline"
            className="w-full"
            size="lg"
          >
            Cancel
          </Button>
        )}
        
        <p className="text-center text-muted-foreground mt-4 text-sm">
          {isScanning
            ? "Position the QR code in the frame to scan."
            : "Scan the QR code at your table to view the menu and place an order."}
        </p>
        
        {/* Skip button for demo purposes */}
        {!isScanning && (
          <Button
            variant="ghost"
            onClick={() => navigate('/menu')}
            className="w-full mt-4"
          >
            Skip Scanning (Demo)
          </Button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;
