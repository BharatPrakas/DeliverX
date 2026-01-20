export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface Task {
  id: number;
  vehicleNumber: string;
  date: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  totalCustomers: number;
  advanceAmount: number;
  type?: string;
  supervisor?: string;
  remarks?: string;
  helper?: { name: string, role: string };
  startingKm?: number;
  endingKm?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}
