import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Need CommonModule for date pipes etc
import { Router } from '@angular/router';
import { TripService } from '../../core/services/trip';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse, Task } from '../../core/models/core.model';
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
  activeTask = signal<Task[]>([]);
  activeTasksCount = 1; // Keeping simple or derive from activeTask() ? 1 if activeTask() else 0

  history = this.tripService.history;

  viewTask(id: number) {
    this.router.navigate(['/task-detail', id]);
  }

  ngOnInit() {
    this.commonService.showLoader();
    this.tripService.getMyWorklist().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ApiResponse<Task[]>) => {
        this.activeTask.set(data.data);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      },
      complete: () => {
        this.commonService.hideLoader();
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
