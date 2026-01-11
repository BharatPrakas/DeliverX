import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeliveryService } from '../../core/services/delivery';
import { ExpenseService } from '../../core/services/expense';
import { TripService } from '../../core/services/trip';

@Component({
  selector: 'app-trip-summary',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trip-summary.html',
  styleUrl: './trip-summary.scss',
})
export class TripSummary {
  private router = inject(Router);
  private deliveryService = inject(DeliveryService);
  private expenseService = inject(ExpenseService);
  private tripService = inject(TripService);

  startingKm = this.tripService.startingKm;

  // Use a computed validator or setup control after viewing startingKm? 
  // Simple approach: Validator checks against current signal value or re-creates validator.
  // We'll update validators when control changes or just use a custom validator.

  endingKmControl = new FormControl('', [Validators.required, (control) => {
    const start = this.startingKm();
    if (control.value && Number(control.value) <= start) {
      return { min: { min: start + 1, actual: control.value } };
    }
    return null;
  }]);

  // Track ending km value for calculation
  endingKm = signal<number | null>(null);

  constructor() {
    this.endingKmControl.valueChanges.subscribe(val => {
      this.endingKm.set(val ? Number(val) : null);
    });
  }

  totalDistance = computed(() => {
    const end = this.endingKm();
    const start = this.startingKm();
    if (end && end > start) {
      return end - start;
    }
    return null;
  });

  // Delivery Stats
  deliveryStats = this.deliveryService.stats;

  // Computations for Financials
  totalBilled = computed(() => {
    return this.deliveryService.items().reduce((sum, item) => sum + (item.receiptData?.billingAmount || 0), 0);
  });

  cashFromCustomers = computed(() => {
    return this.deliveryService.items().reduce((sum, item) => sum + (item.receiptData?.cashReceived || 0), 0);
  });

  outstandingBalance = computed(() => {
    return this.totalBilled() - this.cashFromCustomers();
  });

  // Expense Stats
  advanceReceived = this.expenseService.advanceReceivedSignal;
  totalExpenses = this.expenseService.totalSpent;
  expenseBreakdown = this.expenseService.breakdown;

  // Final Cash in Hand
  cashInHand = computed(() => {
    return this.advanceReceived() + this.cashFromCustomers() - this.totalExpenses();
  });

  // Modal State
  showConfirmation = signal(false);

  goBack() {
    window.history.back();
  }

  completeTrip() {
    if (this.endingKmControl.valid) {
      this.showConfirmation.set(true);
    } else {
      this.endingKmControl.markAsTouched();
    }
  }

  cancelCompletion() {
    this.showConfirmation.set(false);
  }

  confirmCompletion() {
    // Here we would typically save the trip data to the backend
    console.log('Trip Completed!');
    if (this.endingKm()) {
      this.tripService.completeTrip(this.endingKm()!);
      this.expenseService.reset();
      this.deliveryService.reset(); // Assuming we add this method
    }
    this.router.navigate(['/dashboard']);
  }
}
