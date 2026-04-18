export interface SizeStock {
  size: string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: "boys" | "girls" | "infants" | "unisex";
  collectionName?: string;
  season: "summer" | "winter" | "all";
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  sizes: SizeStock[];
  featured: boolean;
  newArrival: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Collection {
  _id: string;
  name: string;
  slug: string;
  category: "boys" | "girls" | "infants" | "unisex" | "all";
  backgroundImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

export interface Order {
  _id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
  createdAt: string;
  updatedAt: string;
}
