
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '@/lib/mockData';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

const ProductCard = ({ product, layout = 'grid' }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (layout === 'list') {
    return (
      <Card 
        className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex"
        onClick={handleProductClick}
      >
        <div className={`w-20 h-20 relative ${!imageLoaded ? 'image-loading' : ''}`}>
          <img 
            src={product.image} 
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-300",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
        </div>
        <div className="p-3 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-sm">{product.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
            </div>
            <div className="flex items-center">
              <p className="font-medium text-sm">{formatPrice(product.price)}</p>
              <PlusCircle className="ml-2 w-5 h-5 text-primary" />
            </div>
          </div>
          {product.popular && (
            <Badge variant="outline" className="mt-2 text-xs bg-secondary">Popular</Badge>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={handleProductClick}
    >
      <div className={`aspect-square relative ${!imageLoaded ? 'image-loading' : ''}`}>
        <img 
          src={product.image} 
          alt={product.name}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        {product.popular && (
          <Badge className="absolute top-2 right-2 bg-primary text-xs font-medium">
            Popular
          </Badge>
        )}
      </div>
      <div className="p-3">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">{product.name}</h3>
          <p className="font-medium">{formatPrice(product.price)}</p>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{product.description}</p>
      </div>
    </Card>
  );
};

export default ProductCard;
