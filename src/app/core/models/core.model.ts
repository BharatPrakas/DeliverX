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

export interface CompletedTask {
  id: number;
  vehicleNumber: string;
  date: Date | string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  token: string;
}

export interface DeliveryItem {
  id: number;
  customerId: number;
  customerName: string;
  requestedBoxes: number;
  isDelivered: boolean;
  remarks: string;
  collectedAmount: number;
  isCashCollected: boolean;
  status: string
}

export interface DeliveryReceiptPayload {
  deliveryId: number;
  customerId: number;
  tripId: number;
  entries: entries[];
  totalWeight: number;
  boxWeight: number;
  birdsWeight: number;
  numberOfBirds: number;
  ratePerKg: number;
  billingAmount: number;
  cashReceived: number;
  balance: number;
}

interface entries {
  cages: number;
  loadWt: number;
  emptyWt: number;
}

export interface tripExpense {
  expenses: Expense[];
  advanceAmount: number;
}

export interface Expense {
  id?: number;
  category: string;
  amount: number;
  description: string;
  time: string | Date;
}

export interface TripSummary {
  advanceAmount: number;
  startingKm: number;
  endingKm: number;
  totalCustomers: number;
  totalDelivered: number;
  totalCashCollected: number;
  totalExpenses: number;
  totalBillingAmount: number;
  totalCashReceived: number;
  totalBalanceAmount: number;
  outstandingBalance: number;
  expenses: Expense[];
  deliveries: TripDeliveries[];
}

export interface TripDeliveries {
  billingAmount: number;
  cashReceived: number;
  balanceAmount: number;
}
