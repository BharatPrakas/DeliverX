import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../core/services/expense';
import { Subject, takeUntil } from 'rxjs';
import { TripService } from '../../core/services/trip';
import { ApiResponse, Expense, tripExpense } from '../../core/models/core.model';
import { CommonService } from '../../common/services/common-service';


interface ExpenseCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
}

@Component({
  selector: 'app-expenses',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.scss',
})
export class Expenses {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private TripService = inject(TripService);
  private commonService = inject(CommonService);
  private tripId = inject(ActivatedRoute).snapshot.params['tripId'];
  /** 
   * Subject for managing unsubscriptions and avoiding memory leaks.
   */
  private destroy$ = new Subject<void>();

  advanceReceived = signal(0);

  categories: ExpenseCategory[] = [
    { id: 'diesel', name: 'Diesel', icon: '', color: '#ea580c', bgColor: '#fff7ed' },
    { id: 'food', name: 'Food', icon: '', color: '#ea580c', bgColor: '#fff7ed' },
    { id: 'toll', name: 'Toll', icon: '', color: '#2563eb', bgColor: '#eff6ff' },
    { id: 'labour', name: 'Labour', icon: '', color: '#16a34a', bgColor: '#f0fdf4' },
    { id: 'other', name: 'Other', icon: '', color: '#4b5563', bgColor: '#f3f4f6' },
  ];

  // List of expenses
  expensesList = signal<Expense[]>([]);

  totalSpent = computed(() => {
    return this.expensesList().reduce((acc, curr) => acc + curr.amount, 0);
  });

  remaining = computed(() => {
    return this.advanceReceived() - this.totalSpent();
  });

  // Modal State
  isModalOpen = signal(false);
  selectedCategory = signal<ExpenseCategory | null>(null);

  form = this.fb.group({
    amount: ['', [Validators.required, Validators.min(1)]],
    description: ['']
  });

  openAddExpense(category: ExpenseCategory) {
    this.selectedCategory.set(category);
    this.form.reset();
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.selectedCategory.set(null);
  }

  saveExpense() {
    if (this.form.valid && this.selectedCategory()) {
      this.commonService.showLoader();
      const newExpense: Expense = {
        category: this.selectedCategory()!.id,
        description: this.form.value.description || this.selectedCategory()!.name,
        time: new Date(),
        amount: Number(this.form.value.amount)
      };
      this.TripService.createTripExpense({ tripId: this.tripId, expense: newExpense }).pipe(takeUntil(this.destroy$)).subscribe({
        next: (res: ApiResponse<Expense>) => {
          if (res.success) {
            this.expensesList.update(list => [res.data!, ...list]);
            this.closeModal();
            this.commonService.hideLoader();
          }
        },
        error: (error) => {
          console.log(error);
          this.commonService.hideLoader();
        }
      });
    }
  }

  completeTrip() {
    this.router.navigate(['/trip-summary', this.tripId]);
  }

  goBack() {
    window.history.back();
  }

  ngOnInit() {
    this.getTripExpenses();
  }

  getTripExpenses() {
    this.commonService.showLoader();
    this.TripService.getTripExpenses(this.tripId).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ApiResponse<tripExpense>) => {
        if (res.data) {
          this.advanceReceived.set(res.data.advanceAmount);
          this.expensesList.set(res.data.expenses);
          this.commonService.hideLoader();
          // this.expenseService.expenses.set(res.data.expenses);
          // this.expenseService.advanceAmount.set(res.data.advanceAmount);
        }
      },
      error: (error) => {
        console.log(error);
        this.commonService.hideLoader();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
