
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Menu, X } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const Header = () => {
  const { store } = useStore();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isHomePage = location.pathname === '/';
  const showBackButton = !isHomePage && location.pathname !== '/menu';
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4 px-6",
          isScrolled ? "bg-white/80 backdrop-blur-lg shadow-sm" : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            {showBackButton ? (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate(-1)}
                className="mr-2 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMobileMenu}
                className="mr-2 md:hidden rounded-full"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <img 
                  src={store.logo} 
                  alt={store.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <h1 className="text-lg font-semibold hidden md:block">{store.name}</h1>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/menu')}
              className={cn(
                "font-medium",
                location.pathname === '/menu' && "text-primary"
              )}
            >
              Menu
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/admin')}
              className={cn(
                "font-medium",
                location.pathname === '/admin' && "text-primary"
              )}
            >
              Admin
            </Button>
          </nav>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate('/cart')}
            className="relative rounded-full"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground h-5 w-5 flex items-center justify-center rounded-full text-xs font-medium animate-scale-in">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </header>
      
      {/* Mobile menu */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
          "md:hidden"
        )}
      >
        <div className="pt-24 px-6 flex flex-col h-full">
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/menu')}
            className="justify-start text-xl mb-4 py-6"
          >
            Menu
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/admin')}
            className="justify-start text-xl mb-4 py-6"
          >
            Admin
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => handleNavigation('/cart')}
            className="justify-start text-xl mb-4 py-6"
          >
            Cart {itemCount > 0 && `(${itemCount})`}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;
