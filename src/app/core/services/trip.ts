import { inject, Injectable, signal } from '@angular/core';
import { HttpRoutingService } from '../../common/services/http-routing';
import { Observable } from 'rxjs';
import { ApiResponse, TaskDetails, DeliveryItem, DeliveryReceiptPayload, tripExpense, Expense, TripSummary, CompletedTask } from '../models/core.model';

export interface Task {
  id: number;
  tripId: number;
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
  private http = inject(HttpRoutingService);
  private _startingKm = signal<number>(0);
  readonly startingKm = this._startingKm.asReadonly();

  // Mock Active Task
  private _activeTask = signal<Task | null>({
    id: 1,
    tripId: 1,
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

  startTrips(km: number) {
    this._startingKm.set(km);
    this._activeTask.update(task => task ? { ...task, status: 'In Progress', startingKm: km } : null);
  }

  completeTrips(endingKm: number) {
    const current = this._activeTask();
    if (current) {
      const completedTask: Task = { ...current, status: 'Completed', endingKm };
      this._history.update(history => [completedTask, ...history]);
      this._activeTask.set(null); // Clear active task
      this._startingKm.set(0);
    }
  }

  getMyWorklist(): Observable<ApiResponse<TaskDetails[]>> {
    return this.http.get('v1/getMyWorklist') as Observable<ApiResponse<TaskDetails[]>>;
  }

  getTaskDetails(tripId: number): Observable<ApiResponse<TaskDetails>> {
    return this.http.get(`v1/getTaskDetails`, { tripId }) as Observable<ApiResponse<TaskDetails>>;
  }

  acceptTask(data: { tripId: number }): Observable<ApiResponse<null>> {
    return this.http.post(`v1/acceptTask`, data) as Observable<ApiResponse<null>>;
  }

  updateStartingKms(data: { tripId: number, startingKm: number }): Observable<ApiResponse<null>> {
    return this.http.post(`v1/updateStartingKms`, data) as Observable<ApiResponse<null>>;
  }

  getDeliveryList(tripId: number): Observable<ApiResponse<DeliveryItem[]>> {
    return this.http.post(`v1/getDeliveryList`, { tripId }) as Observable<ApiResponse<DeliveryItem[]>>;
  }

  markAsPurchased(data: { tripId: number }): Observable<ApiResponse<null>> {
    return this.http.post(`v1/markAsPurchased`, data) as Observable<ApiResponse<null>>;
  }

  deliveredCustomer(data: DeliveryReceiptPayload): Observable<ApiResponse<null>> {
    return this.http.post(`v1/deliveredCustomer`, data) as Observable<ApiResponse<null>>;
  }

  getTripExpenses(tripId: number): Observable<ApiResponse<tripExpense>> {
    return this.http.post(`v1/getTripExpenses`, { tripId }) as Observable<ApiResponse<tripExpense>>;
  }

  createTripExpense(data: { tripId: number, expense: Expense }): Observable<ApiResponse<Expense>> {
    return this.http.post(`v1/createTripExpense`, { tripId: data.tripId, ...data.expense }) as Observable<ApiResponse<Expense>>;
  }

  getTripSummary(tripId: number): Observable<ApiResponse<TripSummary>> {
    return this.http.post(`v1/getTripSummary`, { tripId }) as Observable<ApiResponse<TripSummary>>;
  }

  completeTrip(data: { tripId: number, endingKm: number }): Observable<ApiResponse<null>> {
    return this.http.post(`v1/completeTrip`, data) as Observable<ApiResponse<null>>;
  }

  getMyCompletedTask(): Observable<ApiResponse<CompletedTask[]>> {
    return this.http.get(`v1/getMyCompletedTask`) as Observable<ApiResponse<CompletedTask[]>>;
  }
}
