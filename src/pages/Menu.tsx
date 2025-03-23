
import { useState, useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import CategorySelector from '@/components/CategorySelector';
import { Input } from '@/components/ui/input';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, Coffee } from 'lucide-react';

const Menu = () => {
  const { store } = useStore();
  const { products, categories } = store;
  const isMobile = useIsMobile();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedProducts, setDisplayedProducts] = useState(products);
  
  // Filter products based on selected category and search query
  useEffect(() => {
    let filtered = products;
    
    // Filter by category if selected
    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
      );
    }
    
    setDisplayedProducts(filtered);
  }, [selectedCategory, searchQuery, products]);
  
  // Get popular products
  const popularProducts = products.filter(product => product.popular);

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="pt-24 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6 max-w-xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search menu..."
            className="pl-10 bg-secondary/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Category Selector */}
        <div className="mb-8">
          <CategorySelector
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>
        
        {/* Popular Items Section (when no filter is applied) */}
        {!selectedCategory && !searchQuery && popularProducts.length > 0 && (
          <section className="mb-10 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Coffee className="mr-2 h-5 w-5" />
              Popular Items
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {popularProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout="grid"
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Main Product Grid */}
        <section className="animate-fade-in">
          {searchQuery && (
            <h2 className="text-xl font-semibold mb-4">
              Search Results for "{searchQuery}"
            </h2>
          )}
          
          {selectedCategory && (
            <h2 className="text-xl font-semibold mb-4">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
          )}
          
          {displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No products found. Try a different search.</p>
            </div>
          ) : (
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'}`}>
              {displayedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  layout={isMobile ? "list" : "grid"}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Menu;
