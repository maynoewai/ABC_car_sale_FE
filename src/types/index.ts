export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Car {
  id: number;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  description: string;
  images: string[];
  mileage: number;
  fuelType: string;
  transmission: string;
  location: string;
  seller: User;
  createdAt: string;
  status: 'available' | 'sold' | 'pending';
}

export interface Bid {
  id: number;
  userId: number;
  carId: number;
  amount: number;
  createdAt: string;
  user: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  total: number;
  lastPage: number;
}