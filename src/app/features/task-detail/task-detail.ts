import { Component, inject, computed, WritableSignal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TripService } from '../../core/services/trip';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../common/services/auth';
import { CommonService } from '../../common/services/common-service';
import { ApiResponse, TaskDetails } from '../../core/models/core.model';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail {
  private router = inject(Router);
  private tripService = inject(TripService);
  private commonService = inject(CommonService);
  private activateRoute = inject(ActivatedRoute);

  viewState: 'DETAILS' | 'START_KM' = 'DETAILS';
  odometerControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]);

  // Use the active task from service. In a real app we'd findById from the history or active list.
  // For now, we assume we are viewing the active task.
  task: WritableSignal<TaskDetails | null> = signal(null);
  /** 
   * Subject for managing unsubscriptions and avoiding memory leaks.
   */
  private destroy$ = new Subject<void>();
  goBack() {
    if (this.viewState === 'START_KM') {
      this.viewState = 'DETAILS';
      return;
    }
    window.history.back();
  }

  onAcceptTask() {
    this.commonService.showLoader();
    this.tripService.acceptTask({ tripId: this.task()?.id! }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ApiResponse<null>) => {
        this.viewState = 'START_KM';
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.commonService.hideLoader();
      }
    });
  }

  confirmStartKm() {
    if (this.odometerControl.valid) {
      console.log('Confirmed KM:', this.odometerControl.value);
      this.tripService.startTrip(Number(this.odometerControl.value));
      this.router.navigate(['/purchase']);
    }
  }

  ngOnInit() {
    this.activateRoute.params.subscribe((params) => {
      const { tripId } = params;
      this.getTaskDetails(tripId);
    });
  }

  getTaskDetails(tripId: string) {
    this.commonService.showLoader();
    this.tripService.getTaskDetails(Number(tripId)).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ApiResponse<TaskDetails>) => {
        this.task.set(res.data);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.commonService.hideLoader();
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
