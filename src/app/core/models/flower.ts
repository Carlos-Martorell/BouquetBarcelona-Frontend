export interface Flower {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  stock: number;
  size: string;
  colors: string[];
  occasion: string;
  careInstructions?: string;
}

export interface CreateFlower {
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  stock: number;
  size: string;
  colors: string[];
  occasion: string;
  careInstructions?: string;
}

export interface UpdateFlower {
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  images?: string[];
  stock?: number;
  size?: string;
  colors?: string[];
  occasion?: string;
  careInstructions?: string;
}
