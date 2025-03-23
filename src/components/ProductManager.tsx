
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Product, Category, CustomizationOption } from '@/lib/mockData';
import { PlusCircle, Edit, Trash2, Coffee, Loader2, Upload } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from './ProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProductManager = () => {
  const { store, updateProducts, updateCategories } = useStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  
  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    popular: false,
    image: null as File | null
  });
  
  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    image: null as File | null
  });
  
  // Load data from Supabase
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      
      try {
        // Fetch products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('name');
          
        if (productsError) throw productsError;
        
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (categoriesError) throw categoriesError;
        
        // Map the data to our app's format
        const mappedProducts = productsData.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description || '',
          price: parseFloat(p.price),
          image: p.image_url || 'https://placehold.co/600x400/png',
          category: p.category,
          popular: p.popular || false,
          customizations: [] // We'll need to fetch customizations separately in a real app
        }));
        
        const mappedCategories = categoriesData.map(c => ({
          id: c.id,
          name: c.name,
          image: c.image_url || 'https://placehold.co/600x400/png'
        }));
        
        setProducts(mappedProducts);
        setCategories(mappedCategories);
        
        // Update the store context
        updateProducts(mappedProducts);
        updateCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data from the database.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [updateProducts, updateCategories, toast]);
  
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // In a real implementation, you would save all changed products/categories to Supabase
      // For now, just update the store context and show a success message
      
      updateProducts(products);
      updateCategories(categories);
      
      toast({
        title: "Changes Saved",
        description: "Your product catalog has been updated.",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: "Failed to save changes to the database.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);
      
      if (error) throw error;
      
      const updatedProducts = products.filter(p => p.id !== productId);
      setProducts(updatedProducts);
      updateProducts(updatedProducts);
      
      toast({
        title: "Product Deleted",
        description: "The product has been removed from your catalog.",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete the product.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId);
      
      if (error) throw error;
      
      const updatedCategories = categories.filter(c => c.id !== categoryId);
      setCategories(updatedCategories);
      updateCategories(updatedCategories);
      
      toast({
        title: "Category Deleted",
        description: "The category has been removed.",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "Failed to delete the category.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddProduct = async () => {
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (productForm.image) {
        const file = productForm.image;
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError, data } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      // Insert product - Fix: Convert string price to number for Supabase
      const { data: newProduct, error } = await supabase
        .from('products')
        .insert({
          name: productForm.name,
          description: productForm.description,
          price: parseFloat(productForm.price), // Convert string to number
          category: productForm.category,
          popular: productForm.popular,
          image_url: imageUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add to local state
      const createdProduct: Product = {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description || '',
        price: parseFloat(newProduct.price),
        image: newProduct.image_url || 'https://placehold.co/600x400/png',
        category: newProduct.category,
        popular: newProduct.popular || false,
        customizations: []
      };
      
      const updatedProducts = [...products, createdProduct];
      setProducts(updatedProducts);
      updateProducts(updatedProducts);
      
      // Close dialog and reset form
      setIsAddProductOpen(false);
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        popular: false,
        image: null
      });
      
      toast({
        title: "Product Added",
        description: "The new product has been added to your catalog.",
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add the product.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddCategory = async () => {
    try {
      let imageUrl = null;
      
      // Upload image if provided
      if (categoryForm.image) {
        const file = categoryForm.image;
        const fileExt = file.name.split('.').pop();
        const fileName = `category-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        imageUrl = publicUrl;
      }
      
      // Insert category
      const { data: newCategory, error } = await supabase
        .from('categories')
        .insert({
          name: categoryForm.name,
          image_url: imageUrl
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Add to local state
      const createdCategory: Category = {
        id: newCategory.id,
        name: newCategory.name,
        image: newCategory.image_url || 'https://placehold.co/600x400/png'
      };
      
      const updatedCategories = [...categories, createdCategory];
      setCategories(updatedCategories);
      updateCategories(updatedCategories);
      
      // Close dialog and reset form
      setIsAddCategoryOpen(false);
      setCategoryForm({
        name: '',
        image: null
      });
      
      toast({
        title: "Category Added",
        description: "The new category has been added.",
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error",
        description: "Failed to add the category.",
        variant: "destructive"
      });
    }
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
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Tabs defaultValue="products" onValueChange={setActiveTab} value={activeTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            
            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Products ({products.length})</h3>
                
                {/* Add Product Dialog */}
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <PlusCircle size={16} className="mr-2" />
                      Add New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                      <DialogDescription>
                        Create a new product for your menu
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="product-name">Name</Label>
                        <Input
                          id="product-name"
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          placeholder="Product name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="product-description">Description</Label>
                        <Textarea
                          id="product-description"
                          value={productForm.description}
                          onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                          placeholder="Product description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="product-price">Price</Label>
                          <Input
                            id="product-price"
                            type="number"
                            step="0.01"
                            value={productForm.price}
                            onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="product-category">Category</Label>
                          <Select 
                            value={productForm.category} 
                            onValueChange={(value) => setProductForm({...productForm, category: value})}
                          >
                            <SelectTrigger id="product-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="product-popular"
                          checked={productForm.popular}
                          onCheckedChange={(checked) => setProductForm({...productForm, popular: checked})}
                        />
                        <Label htmlFor="product-popular">Mark as popular</Label>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="product-image">Product Image</Label>
                        <Input
                          id="product-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setProductForm({...productForm, image: file});
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddProductOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddProduct}
                        disabled={!productForm.name || !productForm.price || !productForm.category}
                      >
                        Add Product
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                        ${product.price.toFixed(2)} - {categories.find(c => c.id === product.category)?.name || product.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => toast({
                          title: "Edit Product",
                          description: `Editing ${product.name} - This would open a product editor in a real application.`,
                        })}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => handleDeleteProduct(product.id)}
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
                
                {/* Add Category Dialog */}
                <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <PlusCircle size={16} className="mr-2" />
                      Add Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                      <DialogDescription>
                        Create a new category for your products
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category-name">Name</Label>
                        <Input
                          id="category-name"
                          value={categoryForm.name}
                          onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                          placeholder="Category name"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="category-image">Category Image</Label>
                        <Input
                          id="category-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setCategoryForm({...categoryForm, image: file});
                          }}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsAddCategoryOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleAddCategory}
                        disabled={!categoryForm.name}
                      >
                        Add Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => toast({
                          title: "Edit Category",
                          description: `Editing ${category.name} - This would open a category editor in a real application.`,
                        })}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveChanges} disabled={isLoading || isSaving}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductManager;
