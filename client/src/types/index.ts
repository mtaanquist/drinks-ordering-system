export interface Drink {
  id: number;
  name: string;
  description: string;
  recipe: string;
  imageUrl: string | null;
  inStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id?: number;
  drinkId: number;
  quantity: number;
  name?: string; // Joined from drinks table
  description?: string; // Joined from drinks table
}

export interface Order {
  id: number;
  customerName: string;
  status: "pending" | "completed";
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}
