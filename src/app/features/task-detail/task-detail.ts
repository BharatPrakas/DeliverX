import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TripService } from '../../core/services/trip';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail {
  private router = inject(Router);
  private tripService = inject(TripService);

  viewState: 'DETAILS' | 'START_KM' = 'DETAILS';
  odometerControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]);

  // Use the active task from service. In a real app we'd findById from the history or active list.
  // For now, we assume we are viewing the active task.
  task = this.tripService.activeTask;

  goBack() {
    if (this.viewState === 'START_KM') {
      this.viewState = 'DETAILS';
      return;
    }
    window.history.back();
  }

  onAcceptTask() {
    this.viewState = 'START_KM';
  }

  confirmStartKm() {
    if (this.odometerControl.valid) {
      console.log('Confirmed KM:', this.odometerControl.value);
      this.tripService.startTrip(Number(this.odometerControl.value));
      this.router.navigate(['/purchase']);
    }
  }
}
