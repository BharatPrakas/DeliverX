import { Injectable, computed, inject, signal } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse, Expense, tripExpense } from '../models/core.model';

export interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  // Reactive advance amount
  private advanceAmount = signal(3000);
  readonly advanceReceivedSignal = this.advanceAmount.asReadonly();

  // Getter for compatibility if needed, or update consumers
  get advanceReceived() { return this.advanceAmount(); }

  // Initialize with some mock data matching the screenshot context if possible, or empty
  private expenses = signal<Expense[]>([]);

  readonly list = this.expenses.asReadonly();

  readonly totalSpent = computed(() => {
    return this.expenses().reduce((acc, curr) => acc + curr.amount, 0);
  });

  readonly remaining = computed(() => {
    return this.advanceAmount() - this.totalSpent();
  });

  readonly breakdown = computed(() => {
    const map = new Map<string, number>();
    this.expenses().forEach(e => {
      const current = map.get(e.category) || 0;
      map.set(e.category, current + e.amount);
    });
    return map;
  });

  addExpense(expense: Expense) {
    this.expenses.update(list => [expense, ...list]);
  }

  reset() {
    this.expenses.set([]);
    this.advanceAmount.set(3000);
  }

}
