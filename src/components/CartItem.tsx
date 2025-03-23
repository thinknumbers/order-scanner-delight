
import { useState } from 'react';
import { CartItem as CartItemType } from '@/lib/mockData';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuantitySelector from './QuantitySelector';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  index: number;
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemove: (index: number) => void;
}

const CartItem = ({
  item,
  index,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  // Calculate total for this item including customizations
  const calculateItemTotal = () => {
    let total = item.product.price * item.quantity;
    
    Object.values(item.customizations).forEach(options => {
      options.forEach(option => {
        total += option.price * item.quantity;
      });
    });
    
    return total;
  };
  
  // Get list of customizations for display
  const getCustomizationSummary = () => {
    return Object.entries(item.customizations).map(([name, options]) => ({
      name,
      options: options.map(opt => opt.name).join(', ')
    }));
  };
  
  const customizations = getCustomizationSummary();
  const hasCustomizations = customizations.length > 0;
  const hasNotes = !!item.notes;

  return (
    <div className="border-b py-4 animate-fade-in">
      <div className="flex gap-3">
        <div className={`w-20 h-20 rounded-md overflow-hidden shrink-0 relative ${!imageLoaded ? 'image-loading' : ''}`}>
          <img 
            src={item.product.image} 
            alt={item.product.name}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{item.product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {item.product.description}
              </p>
            </div>
            <div className="text-right font-medium shrink-0 ml-2">
              {formatPrice(calculateItemTotal())}
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <QuantitySelector
              quantity={item.quantity}
              onQuantityChange={(qty) => onUpdateQuantity(index, qty)}
              size="sm"
            />
            
            <div className="flex gap-2">
              {(hasCustomizations || hasNotes) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-1 h-7"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              )}
              
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive h-7 p-1"
                onClick={() => onRemove(index)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {expanded && (hasCustomizations || hasNotes) && (
        <div className="mt-3 pl-24 animate-slide-down text-sm">
          {hasCustomizations && (
            <div className="space-y-1 mb-2">
              {customizations.map((customization, i) => (
                <div key={i} className="flex">
                  <span className="text-muted-foreground mr-2">{customization.name}:</span>
                  <span>{customization.options}</span>
                </div>
              ))}
            </div>
          )}
          
          {hasNotes && (
            <div className="flex mt-2">
              <span className="text-muted-foreground mr-2">Notes:</span>
              <span>{item.notes}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CartItem;
