
import { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Product, Category } from '@/lib/mockData';
import { PlusCircle, Edit, Trash2, Coffee } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from './ProductCard';

const ProductManager = () => {
  const { store, updateProducts, updateCategories } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>(store.products);
  const [categories, setCategories] = useState<Category[]>(store.categories);
  
  const handleSaveChanges = () => {
    updateProducts(products);
    updateCategories(categories);
    
    toast({
      title: "Changes Saved",
      description: "Your product catalog has been updated.",
    });
  };
  
  const simulateEdit = (product: Product) => {
    toast({
      title: "Edit Product",
      description: `Editing ${product.name} - This would open a product editor in a real application.`,
    });
  };
  
  const simulateDelete = (productId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    
    toast({
      title: "Product Deleted",
      description: "The product has been removed from your catalog.",
    });
  };
  
  const simulateAddProduct = () => {
    toast({
      title: "Add Product",
      description: "This would open a product creation form in a real application.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee size={18} />
          Product Catalog
        </CardTitle>
        <CardDescription>
          Manage your store's products and categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Products ({products.length})</h3>
              <Button onClick={simulateAddProduct} size="sm">
                <PlusCircle size={16} className="mr-2" />
                Add New
              </Button>
            </div>
            
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4 border-b pb-4">
                  <div className="w-16 h-16 rounded-md overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      ${product.price.toFixed(2)} - {product.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => simulateEdit(product)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => simulateDelete(product.id)}
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Categories ({categories.length})</h3>
              <Button size="sm">
                <PlusCircle size={16} className="mr-2" />
                Add Category
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                    </div>
                  </div>
                  <CardFooter className="p-2 flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit size={14} />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 size={14} />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductManager;
