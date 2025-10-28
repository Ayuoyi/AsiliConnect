export type Product = {
  name: string;
  farmer: string;
  location: string;
  price: string;
  unit: string;
  rating?: number;
  reviews?: number;
  image?: string;
  inStock?: boolean;
  featured?: boolean;
  organic?: boolean;
  local?: boolean;
};

export const products: Product[] = [
  {
    name: "Fresh Organic Tomatoes",
    farmer: "Green Valley Farm",
    location: "Kisii, Kenya",
    price: "50",
    unit: "kg",
    rating: 4.8,
    reviews: 124,
    image: "https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400",
    inStock: true,
    featured: true,
    organic: true,
    local: true,
  },
  {
    name: "Basmati Rice",
    farmer: "Sunrise Agriculture",
    location: "Keroka, Kenya",
    price: "120",
    unit: "quintal",
    rating: 4.9,
    reviews: 89,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400",
    inStock: true,
    featured: true,
    organic: false,
    local: true,
  },
  {
    name: "Fresh Potatoes",
    farmer: "Highland Farms",
    location: "Suneka, Kenya",
    price: "120",
    unit: "kg",
    rating: 4.6,
    reviews: 156,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
    inStock: true,
  },
  {
    name: "Sweet Mangoes",
    farmer: "Tropical Gardens",
    location: "Nyantiko, Kenya",
    price: "80",
    unit: "kg",
    rating: 4.9,
    reviews: 203,
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
    inStock: true,
    organic: true,
    local: true,
  },
  {
    name: "Fresh Carrots",
    farmer: "Valley Fresh Farms",
    location: "Nyamataro, Kenya",
    price: "35",
    unit: "kg",
    rating: 4.7,
    reviews: 98,
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400",
    inStock: true,
    organic: false,
    local: true,
  },
  {
    name: "Organic Wheat",
    farmer: "Golden Fields Co-op",
    location: "Kisii, Kenya",
    price: "180",
    unit: "quintal",
    rating: 4.8,
    reviews: 67,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400",
    inStock: false,
    organic: true,
    local: true,
  },
];

export default products;
