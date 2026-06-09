export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  created_at: string;
}

export interface Order {
  id: number;
  description: string;
  type: "IN" | "OUT";
  amount: number;
  status: "PENDING" | "PAID";
  production_status: "PENDING" | "DONE";
  created_at: string;
}

export interface AdminSetting {
  key: string;
  value: string;
  updated_at: string;
}

export interface OrderItem {
  product: Product;
  qty: number;
}

export interface OrderPayload {
  description: string;
  type: "IN" | "OUT";
  amount: number;
  status?: "PENDING" | "PAID";
  production_status?: "PENDING" | "DONE";
}

export interface FinanceStats {
  omset: number;
  expense: number;
  net: number;
}

export interface MenuAnalysis {
  name: string;
  qty: number;
}
