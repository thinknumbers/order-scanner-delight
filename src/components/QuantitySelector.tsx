
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

const QuantitySelector = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  size = 'md',
}: QuantitySelectorProps) => {
  const increment = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };
  
  const buttonSize = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  }[size];
  
  const iconSize = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }[size];
  
  const quantitySize = {
    sm: 'w-6 text-sm',
    md: 'w-8 text-base',
    lg: 'w-10 text-lg',
  }[size];

  return (
    <div className="flex items-center">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(buttonSize, "rounded-full transition-all")}
        onClick={decrement}
        disabled={quantity <= min}
      >
        <Minus className={iconSize} />
      </Button>
      <div className={cn(quantitySize, "flex justify-center font-medium")}>
        {quantity}
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className={cn(buttonSize, "rounded-full transition-all")}
        onClick={increment}
        disabled={quantity >= max}
      >
        <Plus className={iconSize} />
      </Button>
    </div>
  );
};

export default QuantitySelector;
