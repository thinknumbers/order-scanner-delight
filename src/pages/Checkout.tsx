
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import PaymentForm from '@/components/PaymentForm';

const Checkout = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  
  // Redirect to cart if there are no items
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        
        <PaymentForm />
      </main>
    </div>
  );
};

export default Checkout;
