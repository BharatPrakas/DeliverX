import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Need CommonModule for date pipes etc
import { Router } from '@angular/router';
import { TripService } from '../../core/services/trip';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse, CompletedTask, Task, TaskDetails } from '../../core/models/core.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../common/services/auth';
import { CommonService } from '../../common/services/common-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);
  private tripService = inject(TripService);
  private authService = inject(AuthService);
  private commonService = inject(CommonService);
  /** 
   * Subject for managing unsubscriptions and avoiding memory leaks.
   */
  private destroy$ = new Subject<void>();

  user = this.authService.currentUser;
  // activeTask = this.tripService.activeTask;
  activeTask = signal<TaskDetails[]>([]);
  activeTasksCount = 1; // Keeping simple or derive from activeTask() ? 1 if activeTask() else 0

  history = signal<CompletedTask[]>([]);

  loader = [true, true];

  viewTask(tripId: number) {
    const CurrentPageMap = [
      { status: 'CREATED', page: 'task-detail' },
      { status: 'ACCEPTED', page: 'task-detail' },
      { status: 'STARTED', page: 'purchase' },
      { status: 'PURCHASED', page: 'delivery-list' },
      { status: 'DELIVERING', page: 'delivery-list' },
      { status: 'COMPLETED', page: 'dashboard' }
    ];
    const taskStatus = this.activeTask().find(task => task.tripId == tripId)?.tripStatus;
    const currentPage = CurrentPageMap.find(page => page.status === taskStatus)?.page;
    this.router.navigate([currentPage, tripId]);
  }

  ngOnInit() {
    this.commonService.showLoader();
    this.tripService.getMyWorklist().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ApiResponse<TaskDetails[]>) => {
        this.activeTask.set(data.data);
        this.loader[0] = false;
        this.stopLoader();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.loader[0] = false;
        this.stopLoader();
      }
    });
    this.getCompletedTask();
  }

  getCompletedTask() {
    this.tripService.getMyCompletedTask().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ApiResponse<CompletedTask[]>) => {
        this.history.set(data.data);
        this.loader[1] = false;
        this.stopLoader();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.loader[1] = false;
        this.stopLoader();
      }
    })
  }

  stopLoader() {
    console.log(this.loader);
    console.log(this.loader.every(loader => !loader));

    if (this.loader.every(loader => !loader)) {
      this.commonService.hideLoader();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
