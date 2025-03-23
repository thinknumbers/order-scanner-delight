
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import Header from '@/components/Header';
import CartItem from '@/components/CartItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, ArrowRight, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Cart = () => {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, cartTotal } = useCart();
  const { store } = useStore();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const handleClearCart = () => {
    clearCart();
    setClearDialogOpen(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            <ShoppingCart className="mr-2 h-5 w-5" />
            Your Order
          </h1>
          
          {items.length > 0 && (
            <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear your cart?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all items from your order. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearCart} className="bg-destructive text-destructive-foreground">
                    Clear Cart
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="mb-4">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your order yet.
            </p>
            <Button onClick={() => navigate('/menu')}>
              Browse Menu
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              {items.map((item, index) => (
                <CartItem
                  key={index}
                  item={item}
                  index={index}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-sm animate-scale-in">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(cartTotal * 0.08)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(cartTotal * 1.08)}</span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout} 
                className="w-full mt-6"
                size="lg"
              >
                Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => navigate('/menu')}
              >
                Add More Items
              </Button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
