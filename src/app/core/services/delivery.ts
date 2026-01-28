import { Injectable, signal, computed } from '@angular/core';
import { DeliveryItem } from '../models/core.model';

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

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {

  deliveries = signal<DeliveryItem[]>([]);

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
