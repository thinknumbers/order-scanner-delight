
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CustomizationOption } from '@/lib/mockData';
import CustomizationOptions from '@/components/CustomizationOptions';
import QuantitySelector from '@/components/QuantitySelector';
import { ChevronLeft, ShoppingCart } from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { store } = useStore();
  const { addToCart } = useCart();
  
  const product = store.products.find(p => p.id === id);
  
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, CustomizationOption[]>>({});
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    // Initialize selected options with defaults
    if (product?.customizations) {
      const initialOptions: Record<string, CustomizationOption[]> = {};
      
      product.customizations.forEach(customization => {
        // For required customizations with single selection, preselect the first option
        if (customization.required && !customization.multiple) {
          initialOptions[customization.name] = [customization.options[0]];
        } else {
          initialOptions[customization.name] = [];
        }
      });
      
      setSelectedOptions(initialOptions);
    }
  }, [product]);
  
  // Handle customization changes
  const handleCustomizationChange = (
    customizationName: string,
    options: CustomizationOption[]
  ) => {
    setSelectedOptions(prev => ({
      ...prev,
      [customizationName]: options
    }));
  };
  
  // Validate required customizations are selected
  useEffect(() => {
    if (!product?.customizations) {
      setIsValid(true);
      return;
    }
    
    const requiredCustomizations = product.customizations.filter(c => c.required);
    const hasAllRequired = requiredCustomizations.every(customization => {
      const selectedOpts = selectedOptions[customization.name] || [];
      return selectedOpts.length > 0;
    });
    
    setIsValid(hasAllRequired);
    
    if (!hasAllRequired) {
      const missing = requiredCustomizations
        .filter(c => !selectedOptions[c.name]?.length)
        .map(c => c.name)
        .join(', ');
      
      setValidationMessage(`Please select options for: ${missing}`);
    } else {
      setValidationMessage('');
    }
  }, [selectedOptions, product]);
  
  // Calculate total price including customizations
  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    let total = product.price * quantity;
    
    Object.values(selectedOptions).forEach(options => {
      options.forEach(option => {
        total += option.price * quantity;
      });
    });
    
    return total;
  };
  
  const handleAddToCart = () => {
    if (!product || !isValid) return;
    
    addToCart(product, quantity, selectedOptions, notes);
    navigate('/cart');
  };
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p>Product not found</p>
        </div>
      </div>
    );
  }
  
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(calculateTotalPrice());

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="pt-20 max-w-3xl mx-auto px-4 sm:px-6">
        {/* Product Image */}
        <div className="w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden mb-6">
          <div className={`w-full h-full ${!imageLoaded ? 'image-loading' : ''}`}>
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-500"
              style={{ opacity: imageLoaded ? 1 : 0 }}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
        
        {/* Product Info */}
        <div className="mb-6 animate-fade-in">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <span className="text-xl font-semibold">${product.price.toFixed(2)}</span>
          </div>
          <p className="mt-2 text-muted-foreground">{product.description}</p>
        </div>
        
        {/* Customizations */}
        {product.customizations && product.customizations.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <h2 className="text-lg font-semibold mb-3">Customize Your Order</h2>
            <CustomizationOptions
              customizations={product.customizations}
              selectedOptions={selectedOptions}
              onChange={handleCustomizationChange}
            />
          </div>
        )}
        
        {/* Special Instructions */}
        <div className="mb-6 animate-fade-in">
          <h2 className="text-lg font-semibold mb-3">Special Instructions</h2>
          <Textarea
            placeholder="Any special requests?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
          />
        </div>
        
        {/* Add to Cart Section */}
        <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md pt-4 pb-6 border-t animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
            />
            <span className="text-xl font-semibold">{formattedPrice}</span>
          </div>
          
          {!isValid && (
            <p className="text-destructive text-sm mb-2">{validationMessage}</p>
          )}
          
          <Button
            onClick={handleAddToCart}
            disabled={!isValid}
            className="w-full"
            size="lg"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
