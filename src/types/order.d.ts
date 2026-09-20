// Read-only model shape. No admin API exists yet — kept for placeholder typing only.
export interface OrderItem {
  productId: string;
  variantSku: string;
  productName: string;
  priceAtPurchase: number;
  quantity: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  addressSnapshot: { label?: string; city?: string; street?: string };
  totalAmount: number;
  paymentMethod: "card" | "cash";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
  paidAt?: string;
  createdAt: string;
}
