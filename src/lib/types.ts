export interface Reservation {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  category: 'wines' | 'general';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: 'card' | 'transfer' | 'cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}
