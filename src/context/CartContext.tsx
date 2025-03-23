
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Product, CustomizationOption } from '@/lib/mockData';
import { useToast } from '@/components/ui/use-toast';

interface CartContextType {
  items: CartItem[];
  addToCart: (
    product: Product,
    quantity: number,
    customizations: Record<string, CustomizationOption[]>,
    notes?: string
  ) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  itemCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Calculate totals when items change
    let count = 0;
    let total = 0;

    items.forEach(item => {
      count += item.quantity;
      
      // Base product price
      let itemPrice = item.product.price * item.quantity;
      
      // Add customization prices
      Object.values(item.customizations).forEach(options => {
        options.forEach(option => {
          itemPrice += option.price * item.quantity;
        });
      });
      
      total += itemPrice;
    });

    setItemCount(count);
    setCartTotal(total);
  }, [items]);

  const addToCart = (
    product: Product,
    quantity: number,
    customizations: Record<string, CustomizationOption[]>,
    notes?: string
  ) => {
    // Check if item with same product and customizations already exists
    const existingItemIndex = items.findIndex(item => {
      if (item.product.id !== product.id) return false;
      if (item.notes !== notes) return false;
      
      // Check if customizations match
      const customizationKeys = Object.keys(customizations);
      const itemCustomizationKeys = Object.keys(item.customizations);
      
      if (customizationKeys.length !== itemCustomizationKeys.length) return false;
      
      for (const key of customizationKeys) {
        const newOptions = customizations[key];
        const existingOptions = item.customizations[key];
        
        if (!existingOptions || newOptions.length !== existingOptions.length) return false;
        
        // Check if all options match
        const allMatch = newOptions.every(newOpt => 
          existingOptions.some(existOpt => existOpt.name === newOpt.name)
        );
        
        if (!allMatch) return false;
      }
      
      return true;
    });

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += quantity;
      setItems(updatedItems);
    } else {
      // Add new item
      setItems([...items, { product, quantity, customizations, notes }]);
    }

    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your order`,
      duration: 3000,
    });
  };

  const updateQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(index);
      return;
    }

    const updatedItems = [...items];
    updatedItems[index].quantity = quantity;
    setItems(updatedItems);
  };

  const removeItem = (index: number) => {
    const removedItem = items[index];
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);

    toast({
      title: "Item removed",
      description: `${removedItem.product.name} removed from your order`,
      duration: 3000,
    });
  };

  const clearCart = () => {
    setItems([]);
    toast({
      title: "Cart cleared",
      description: "All items have been removed from your order",
      duration: 3000,
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
