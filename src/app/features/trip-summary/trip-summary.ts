import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService } from '../../core/services/delivery';
import { ExpenseService } from '../../core/services/expense';
import { TripService } from '../../core/services/trip';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse, TripSummary } from '../../core/models/core.model';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../../common/services/common-service';

@Component({
  selector: 'app-trip-summary',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './trip-summary.html',
  styleUrl: './trip-summary.scss',
})
export class TripSummaryComponent {
  private router = inject(Router);
  private deliveryService = inject(DeliveryService);
  private expenseService = inject(ExpenseService);
  private tripService = inject(TripService);
  private commonService = inject(CommonService);
  startingKm = signal<number>(0);
  /** 
   * Subject for managing unsubscriptions and avoiding memory leaks.
   */
  private destroy$ = new Subject<void>();
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

  private tripId = inject(ActivatedRoute).snapshot.params['tripId'];
  tripSummary = signal<TripSummary | null>(null);
  totalDistance = computed(() => {
    const end = this.endingKm();
    const start = this.startingKm();
    if (end && end > start) {
      return end - start;
    }
    return null;
  });

  // // Computations for Financials
  totalBilled = computed(() => {
    return this.tripSummary()?.totalBillingAmount || 0;
  });

  cashFromCustomers = computed(() => {
    return this.tripSummary()?.totalCashCollected || 0;
  });

  outstandingBalance = computed(() => {
    return this.totalBilled() - this.cashFromCustomers();
  });

  // Expense Stats
  advanceReceived = computed(() => {
    return this.tripSummary()?.advanceAmount || 0;
  });
  totalExpenses = computed(() => {
    return this.tripSummary()?.expenses.reduce((acc, curr) => acc + curr.amount, 0) || 0;
  });
  expenseBreakdown = computed(() => {
    const map = new Map<string, number>();
    this.tripSummary()?.expenses.forEach(e => {
      const current = map.get(e.category.toLowerCase()) || 0;
      map.set(e.category.toLowerCase(), current + e.amount);
    });
    return map;
  });

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
    if (this.endingKm()) {
      this.commonService.showLoader();
      this.tripService.completeTrip({ tripId: this.tripId, endingKm: this.endingKm()! }).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.commonService.hideLoader();
          this.router.navigate(['/dashboard']);
        },
        error: (err: HttpErrorResponse) => {
          this.commonService.hideLoader();
          console.error(err);
        }
      });
    }
  }

  ngOnInit() {
    this.tripService.getTripSummary(this.tripId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ApiResponse<TripSummary>) => {
        this.tripSummary.set(res.data);
        this.startingKm.set(res.data.startingKm);
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
