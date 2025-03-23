
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

const PaymentForm = () => {
  const navigate = useNavigate();
  const { cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Card number formatting
    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(\d{4})(?=\d)/g, '$1 ');
      
      setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // Expiry date formatting
    if (name === 'expiryDate') {
      const formatted = value
        .replace(/\s/g, '')
        .replace(/\D/g, '')
        .slice(0, 4)
        .replace(/(\d{2})(?=\d)/g, '$1/');
      
      setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    // CVV
    if (name === 'cvv') {
      const formatted = value
        .replace(/\D/g, '')
        .slice(0, 3);
      
      setPaymentInfo(prev => ({ ...prev, [name]: formatted }));
      return;
    }
    
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed. Thank you for your purchase!",
      });
      
      clearCart();
      navigate('/');
    }, 2000);
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  };
  
  const isFormValid = () => {
    return (
      paymentInfo.cardNumber.replace(/\s/g, '').length === 16 &&
      paymentInfo.cardName.length > 0 &&
      paymentInfo.expiryDate.length === 5 &&
      paymentInfo.cvv.length === 3
    );
  };

  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Enter your credit card information to complete your order.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentInfo.cardNumber}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cardName">Cardholder Name</Label>
            <Input
              id="cardName"
              name="cardName"
              placeholder="John Doe"
              value={paymentInfo.cardName}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                name="cvv"
                placeholder="123"
                value={paymentInfo.cvv}
                onChange={handleInputChange}
                type="password"
                required
              />
            </div>
          </div>
          
          <div className="pt-2">
            <div className="flex justify-between py-2 border-t">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Tax</span>
              <span>{formatPrice(cartTotal * 0.08)}</span>
            </div>
            <div className="flex justify-between py-2 font-medium">
              <span>Total</span>
              <span>{formatPrice(cartTotal * 1.08)}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/cart')}
            disabled={isProcessing}
          >
            Back to Cart
          </Button>
          <Button 
            type="submit" 
            disabled={!isFormValid() || isProcessing}
            className="min-w-[120px]"
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PaymentForm;
