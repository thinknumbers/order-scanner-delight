
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import ThemeCustomizer from './ThemeCustomizer';
import ProductManager from './ProductManager';
import TableManager from './TableManager';

const AdminPanel = () => {
  const { store } = useStore();
  const [activeTab, setActiveTab] = useState('theme');
  
  return (
    <div className="w-full animate-fade-in max-w-4xl mx-auto">
      <Tabs defaultValue="theme" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="theme">Store Appearance</TabsTrigger>
          <TabsTrigger value="products">Products Manager</TabsTrigger>
          <TabsTrigger value="tables">Tables Manager</TabsTrigger>
        </TabsList>
        
        <TabsContent value="theme" className="pt-2">
          <ThemeCustomizer />
        </TabsContent>
        
        <TabsContent value="products" className="pt-2">
          <ProductManager />
        </TabsContent>
        
        <TabsContent value="tables" className="pt-2">
          <TableManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
