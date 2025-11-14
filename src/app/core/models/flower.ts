

export interface Flower {
    _id: string;
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    stock: number;
}

export interface CreateFlower {
    name: string;
    price: number;
    description: string;
    category: string;
    images: string[];
    stock: number;
}

export interface UpdateFlower {
    name?: string;
    price?: number;
    description?: string;
    category?: string;
    images?: string[];
    stock?: number;
}