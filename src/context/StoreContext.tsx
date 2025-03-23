
import React, { createContext, useState, useContext } from 'react';
import { Store, defaultStore } from '@/lib/mockData';

interface StoreContextType {
  store: Store;
  updateStore: (updatedStore: Partial<Store>) => void;
  updateStoreLogo: (logoUrl: string) => void;
  updateStoreTheme: (themeUpdate: Partial<Store['theme']>) => void;
  updateProducts: (products: Store['products']) => void;
  updateCategories: (categories: Store['categories']) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(defaultStore);

  const updateStore = (updatedStore: Partial<Store>) => {
    setStore(prevStore => ({ ...prevStore, ...updatedStore }));
  };

  const updateStoreLogo = (logoUrl: string) => {
    setStore(prevStore => ({ ...prevStore, logo: logoUrl }));
  };

  const updateStoreTheme = (themeUpdate: Partial<Store['theme']>) => {
    setStore(prevStore => ({
      ...prevStore,
      theme: { ...prevStore.theme, ...themeUpdate }
    }));
  };

  const updateProducts = (products: Store['products']) => {
    setStore(prevStore => ({ ...prevStore, products }));
  };

  const updateCategories = (categories: Store['categories']) => {
    setStore(prevStore => ({ ...prevStore, categories }));
  };

  return (
    <StoreContext.Provider value={{
      store,
      updateStore,
      updateStoreLogo,
      updateStoreTheme,
      updateProducts,
      updateCategories
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
