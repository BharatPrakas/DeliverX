import { Injectable, signal } from '@angular/core';

export interface Task {
  id: number;
  vehicleNumber: string;
  date: Date;
  status: 'Pending' | 'In Progress' | 'Completed';
  totalCustomers: number;
  advanceAmount: number;
  // Extras
  type?: string;
  supervisor?: string;
  remarks?: string;
  helper?: { name: string, role: string };
  startingKm?: number;
  endingKm?: number;
}

@Injectable({
  providedIn: 'root',
})
export class TripService {
  private _startingKm = signal<number>(0);
  readonly startingKm = this._startingKm.asReadonly();

  // Mock Active Task
  private _activeTask = signal<Task | null>({
    id: 1,
    vehicleNumber: 'TN 30 BT 1616',
    date: new Date('2025-01-07'),
    status: 'Pending',
    totalCustomers: 6,
    advanceAmount: 3000,
    type: 'Pickup & Delivery',
    supervisor: 'Murugan',
    remarks: 'Handle with care',
    helper: { name: 'Arun Kumar', role: 'Helper' }
  });

  readonly activeTask = this._activeTask.asReadonly();

  private _history = signal<Task[]>([]);
  readonly history = this._history.asReadonly();

  startTrip(km: number) {
    this._startingKm.set(km);
    this._activeTask.update(task => task ? { ...task, status: 'In Progress', startingKm: km } : null);
  }

  completeTrip(endingKm: number) {
    const current = this._activeTask();
    if (current) {
      const completedTask: Task = { ...current, status: 'Completed', endingKm };
      this._history.update(history => [completedTask, ...history]);
      this._activeTask.set(null); // Clear active task
      this._startingKm.set(0);
    }
  }
}
