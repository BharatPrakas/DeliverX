import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../../core/services/expense';

interface Expense {
  id: number;
  category: string;
  icon: string; // SVG path or name
  title: string;
  description?: string;
  time: Date;
  amount: number;
}

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
  private expenseService = inject(ExpenseService);

  advanceReceived = this.expenseService.advanceReceivedSignal;

  categories: ExpenseCategory[] = [
    { id: 'diesel', name: 'Diesel', icon: '', color: '#ea580c', bgColor: '#fff7ed' },
    { id: 'food', name: 'Food', icon: '', color: '#ea580c', bgColor: '#fff7ed' },
    { id: 'toll', name: 'Toll', icon: '', color: '#2563eb', bgColor: '#eff6ff' },
    { id: 'labour', name: 'Labour', icon: '', color: '#16a34a', bgColor: '#f0fdf4' },
    { id: 'other', name: 'Other', icon: '', color: '#4b5563', bgColor: '#f3f4f6' },
  ];

  // List of expenses
  expensesList = this.expenseService.list;

  totalSpent = this.expenseService.totalSpent;

  remaining = this.expenseService.remaining;

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
      const newExpense = {
        id: Date.now(),
        category: this.selectedCategory()!.id,
        title: this.form.value.description || this.selectedCategory()!.name,
        time: new Date(),
        amount: Number(this.form.value.amount)
      };

      this.expenseService.addExpense(newExpense);
      this.closeModal();
    }
  }

  completeTrip() {
    // Navigate to Trip Summary or similar
    console.log('Trip Completed');
    this.router.navigate(['/trip-summary']);
  }

  goBack() {
    window.history.back();
  }
}
