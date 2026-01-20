export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface Task {
  id: number;
  tripId: number;
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
export interface TaskDetails {
  id: number;
  tripId: number;
  tripCode: string;
  date: string;
  vehicleNumber: string;
  tripStatus: string;
  advanceAmount: string;
  status: string;
  totalCustomers: number;
  supervisor: string;
  totalBoxes: number;
  remarks: string;
  helpers: {
    name: string,
    role: string
  }[]
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}
