
import { useState, useRef, useEffect } from 'react';
import { Category } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategorySelector = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  useEffect(() => {
    const checkScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 10);
    };
    
    checkScroll();
    
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      
      return () => {
        scrollContainer.removeEventListener('scroll', checkScroll);
      };
    }
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const scrollAmount = 200;
    const currentScroll = scrollContainerRef.current.scrollLeft;
    const newScroll = direction === 'left'
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount;
    
    scrollContainerRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative">
      {showLeftArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-sm"
          onClick={() => scroll('left')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto space-x-3 py-3 px-1 scroll-container no-scrollbar"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          className={cn(
            "whitespace-nowrap rounded-full transition-all min-w-max",
            selectedCategory === null ? "bg-primary" : "hover:bg-secondary/80"
          )}
          onClick={() => onSelectCategory(null)}
        >
          All Items
        </Button>
        
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={cn(
              "whitespace-nowrap rounded-full transition-all min-w-max",
              selectedCategory === category.id ? "bg-primary" : "hover:bg-secondary/80"
            )}
            onClick={() => onSelectCategory(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
      
      {showRightArrow && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-sm"
          onClick={() => scroll('right')}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CategorySelector;
