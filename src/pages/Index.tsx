
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScanLine, ArrowRight } from 'lucide-react';
import QRScanner from '@/components/QRScanner';
import { motion } from '@/lib/motion-mock';
import { cn } from '@/lib/utils';

// Mock for motion animation to avoid adding the dependency for this demo
const Index = () => {
  const navigate = useNavigate();
  const { store } = useStore();
  const [showScanner, setShowScanner] = useState(false);
  const [visibleSection, setVisibleSection] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisibleSection(prev => prev + 1);
    }, 600);
    
    return () => clearTimeout(timer);
  }, [visibleSection]);
  
  const goToMenu = () => {
    navigate('/menu');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="h-screen relative overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
          style={{
            backgroundImage: `url(${store.logo})`,
            filter: 'blur(8px) brightness(0.6)'
          }}
        ></div>
        
        <div className="container relative z-10 flex flex-col items-center justify-center text-center p-6">
          <div className="glass p-10 rounded-3xl max-w-md mx-auto animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 text-white">{store.name}</h1>
            <p className="text-xl mb-8 text-white/90">
              Scan the QR code at your table to browse our menu and place your order
            </p>
            
            {!showScanner ? (
              <Button size="lg" onClick={() => setShowScanner(true)} className="animate-scale-in">
                <ScanLine className="mr-2 h-4 w-4" />
                Scan QR Code
              </Button>
            ) : (
              <QRScanner />
            )}
          </div>
          
          {!showScanner && (
            <Button 
              variant="link" 
              className="mt-6 text-white"
              onClick={goToMenu}
            >
              Skip to Menu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 flex justify-center animate-bounce">
          <ArrowRight className="h-6 w-6 text-white transform rotate-90" />
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className={cn(
              "p-6 text-center transition-all duration-300 transform",
              visibleSection >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ScanLine className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Scan QR Code</h3>
              <p className="text-muted-foreground">
                Use your phone to scan the QR code at your table.
              </p>
            </Card>
            
            <Card className={cn(
              "p-6 text-center transition-all duration-300 transform",
              visibleSection >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Menu</h3>
              <p className="text-muted-foreground">
                Check out our menu and customize your order.
              </p>
            </Card>
            
            <Card className={cn(
              "p-6 text-center transition-all duration-300 transform",
              visibleSection >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}>
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pay & Enjoy</h3>
              <p className="text-muted-foreground">
                Complete your order, pay securely, and we'll bring it to you.
              </p>
            </Card>
          </div>
          
          <div className={cn(
            "flex justify-center mt-12 transition-all duration-300 transform",
            visibleSection >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <Button size="lg" onClick={goToMenu}>
              Browse Our Menu
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary py-6 mt-auto">
        <div className="container text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} {store.name}. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Button variant="ghost" size="sm">About</Button>
            <Button variant="ghost" size="sm">Contact</Button>
            <Button variant="ghost" size="sm">Privacy</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Mock for motion to avoid adding the dependency
export const lib = {
  'motion-mock': {
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
  },
};

export default Index;
