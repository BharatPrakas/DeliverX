import { Injectable, signal, computed } from '@angular/core';

export interface WeightEntry {
  cages: number;
  loadWt: number;
  emptyWt: number;
}

export interface DeliveryReceiptData {
  entries: WeightEntry[];
  totalBirdsWeight: number;
  numberOfBirds: number;
  ratePerKg: number;
  billingAmount: number;
  cashReceived: number;
  balance: number;
}

export interface DeliveryItem {
  id: number;
  name: string;
  tagline: string;
  boxes: number;
  status: 'Pending' | 'Delivered';
  amount?: number; // Estimated or final amount
  receiptData?: DeliveryReceiptData;
}

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {

  // Mock data
  private deliveries = signal<DeliveryItem[]>([
    { id: 1, name: 'Sri Amman Traders', tagline: 'Deliver before noon', boxes: 4, status: 'Delivered', amount: 3000 },
    { id: 2, name: 'MR Chicken Shop', tagline: '', boxes: 2, status: 'Pending' },
    { id: 3, name: 'Govind Broilers', tagline: '', boxes: 7, status: 'Pending' },
    { id: 4, name: 'Jagan Meat House', tagline: '', boxes: 4, status: 'Pending' },
    { id: 5, name: 'Bala Chicken', tagline: '', boxes: 3, status: 'Pending' },
    { id: 6, name: 'Ismail Store', tagline: '', boxes: 1, status: 'Pending' }
  ]);

  readonly items = this.deliveries.asReadonly();

  readonly stats = computed(() => {
    const items = this.deliveries();
    const total = items.length;
    const completed = items.filter(i => i.status === 'Delivered').length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, progress };
  });

  getDelivery(id: number) {
    return this.deliveries().find(d => d.id === id);
  }

  updateDelivery(id: number, receiptData: DeliveryReceiptData) {
    this.deliveries.update(items => items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: 'Delivered',
          amount: receiptData.billingAmount,
          receiptData
        };
      }
      return item;
    }));
  }
  reset() {
    // Reset logic: maintain mock structure but reset status/amounts
    this.deliveries.update(items => items.map(item => ({
      ...item,
      status: 'Pending',
      amount: undefined,
      receiptData: undefined
    })));
  }
}
