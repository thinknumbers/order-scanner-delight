
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  customizations?: Customization[];
  popular?: boolean;
}

export interface Customization {
  name: string;
  options: CustomizationOption[];
  required?: boolean;
  multiple?: boolean;
}

export interface CustomizationOption {
  name: string;
  price: number;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizations: Record<string, CustomizationOption[]>;
  notes?: string;
}

export interface Store {
  id: string;
  name: string;
  logo: string;
  theme: StoreTheme;
  categories: Category[];
  products: Product[];
}

export interface StoreTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  borderRadius: string;
}

// Default store data
export const defaultStore: Store = {
  id: "default-store",
  name: "Café Lumière",
  logo: "https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
  theme: {
    primaryColor: "220 80% 50%",
    secondaryColor: "220 20% 96%",
    accentColor: "30 80% 50%",
    fontFamily: "Inter",
    borderRadius: "1rem",
  },
  categories: [
    {
      id: "coffee",
      name: "Coffee",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      id: "tea",
      name: "Tea",
      image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      id: "pastries",
      name: "Pastries",
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=2065&auto=format&fit=crop&ixlib=rb-4.0.3",
    },
    {
      id: "sandwiches",
      name: "Sandwiches",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=1853&auto=format&fit=crop&ixlib=rb-4.0.3",
    }
  ],
  products: [
    {
      id: "espresso",
      name: "Espresso",
      description: "Rich and intense espresso shot, the perfect pick-me-up",
      price: 3.50,
      image: "https://images.unsplash.com/photo-1522992319-0365e5f081d3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "coffee",
      popular: true,
      customizations: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Single", price: 0 },
            { name: "Double", price: 1.5 }
          ]
        },
        {
          name: "Add-ins",
          multiple: true,
          options: [
            { name: "Extra Shot", price: 1.2 },
            { name: "Cocoa Dust", price: 0.5 }
          ]
        }
      ]
    },
    {
      id: "cappuccino",
      name: "Cappuccino",
      description: "Equal parts espresso, steamed milk, and foam for a perfect balance",
      price: 4.50,
      image: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "coffee",
      popular: true,
      customizations: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Small", price: 0 },
            { name: "Medium", price: 1 },
            { name: "Large", price: 1.5 }
          ]
        },
        {
          name: "Milk",
          options: [
            { name: "Regular", price: 0 },
            { name: "Oat Milk", price: 0.8 },
            { name: "Almond Milk", price: 0.8 }
          ]
        },
        {
          name: "Add-ins",
          multiple: true,
          options: [
            { name: "Extra Shot", price: 1.2 },
            { name: "Vanilla Syrup", price: 0.8 },
            { name: "Caramel Syrup", price: 0.8 }
          ]
        }
      ]
    },
    {
      id: "latte",
      name: "Caffè Latte",
      description: "Smooth espresso with steamed milk and a light layer of foam",
      price: 4.75,
      image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "coffee",
      customizations: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Small", price: 0 },
            { name: "Medium", price: 1 },
            { name: "Large", price: 1.5 }
          ]
        },
        {
          name: "Milk",
          options: [
            { name: "Regular", price: 0 },
            { name: "Oat Milk", price: 0.8 },
            { name: "Almond Milk", price: 0.8 }
          ]
        },
        {
          name: "Add-ins",
          multiple: true,
          options: [
            { name: "Extra Shot", price: 1.2 },
            { name: "Vanilla Syrup", price: 0.8 },
            { name: "Caramel Syrup", price: 0.8 },
            { name: "Hazelnut Syrup", price: 0.8 }
          ]
        }
      ]
    },
    {
      id: "green-tea",
      name: "Green Tea",
      description: "Light and refreshing green tea with antioxidant properties",
      price: 3.75,
      image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "tea",
      customizations: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Small", price: 0 },
            { name: "Medium", price: 0.75 },
            { name: "Large", price: 1.25 }
          ]
        },
        {
          name: "Add-ins",
          multiple: true,
          options: [
            { name: "Honey", price: 0.5 },
            { name: "Lemon", price: 0.3 }
          ]
        }
      ]
    },
    {
      id: "chai-latte",
      name: "Chai Latte",
      description: "Spiced black tea concentrate with steamed milk",
      price: 4.25,
      image: "https://images.unsplash.com/photo-1571934811356-5cc135e207ce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "tea",
      popular: true,
      customizations: [
        {
          name: "Size",
          required: true,
          options: [
            { name: "Small", price: 0 },
            { name: "Medium", price: 0.75 },
            { name: "Large", price: 1.25 }
          ]
        },
        {
          name: "Milk",
          options: [
            { name: "Regular", price: 0 },
            { name: "Oat Milk", price: 0.8 },
            { name: "Almond Milk", price: 0.8 }
          ]
        },
        {
          name: "Add-ins",
          multiple: true,
          options: [
            { name: "Honey", price: 0.5 },
            { name: "Vanilla Syrup", price: 0.8 }
          ]
        }
      ]
    },
    {
      id: "croissant",
      name: "Butter Croissant",
      description: "Flaky, buttery French pastry, baked fresh daily",
      price: 3.25,
      image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=2026&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "pastries",
      popular: true,
      customizations: [
        {
          name: "Add-ons",
          multiple: true,
          options: [
            { name: "Butter", price: 0 },
            { name: "Jam", price: 0.75 },
            { name: "Nutella", price: 1 }
          ]
        },
        {
          name: "Warm up",
          options: [
            { name: "Room Temperature", price: 0 },
            { name: "Warmed", price: 0 }
          ]
        }
      ]
    },
    {
      id: "pain-au-chocolat",
      name: "Pain au Chocolat",
      description: "Buttery pastry filled with rich dark chocolate",
      price: 3.75,
      image: "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "pastries",
      customizations: [
        {
          name: "Warm up",
          options: [
            { name: "Room Temperature", price: 0 },
            { name: "Warmed", price: 0 }
          ]
        }
      ]
    },
    {
      id: "avocado-toast",
      name: "Avocado Toast",
      description: "Sourdough toast topped with smashed avocado, olive oil, and salt",
      price: 7.50,
      image: "https://images.unsplash.com/photo-1588137378633-dea1336ce1e3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "sandwiches",
      popular: true,
      customizations: [
        {
          name: "Add-ons",
          multiple: true,
          options: [
            { name: "Red Pepper Flakes", price: 0 },
            { name: "Fried Egg", price: 1.5 },
            { name: "Feta Cheese", price: 1 },
            { name: "Tomatoes", price: 0.75 }
          ]
        },
        {
          name: "Bread",
          options: [
            { name: "Sourdough", price: 0 },
            { name: "Whole Grain", price: 0 },
            { name: "Gluten-Free", price: 1.5 }
          ]
        }
      ]
    },
    {
      id: "blt-sandwich",
      name: "BLT Sandwich",
      description: "Classic bacon, lettuce, and tomato sandwich with mayo on toasted bread",
      price: 8.25,
      image: "https://images.unsplash.com/photo-1619096252214-ef06c45683e3?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3",
      category: "sandwiches",
      customizations: [
        {
          name: "Bread",
          required: true,
          options: [
            { name: "White", price: 0 },
            { name: "Whole Grain", price: 0 },
            { name: "Sourdough", price: 0 },
            { name: "Gluten-Free", price: 1.5 }
          ]
        },
        {
          name: "Add-ons",
          multiple: true,
          options: [
            { name: "Avocado", price: 1.5 },
            { name: "Fried Egg", price: 1.5 },
            { name: "Extra Bacon", price: 2 },
            { name: "Cheese", price: 1 }
          ]
        }
      ]
    }
  ]
};
