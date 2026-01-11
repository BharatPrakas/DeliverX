import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Need CommonModule for date pipes etc
import { Router } from '@angular/router';
import { TripService } from '../../core/services/trip';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private router = inject(Router);
  private tripService = inject(TripService);

  activeTask = this.tripService.activeTask;
  activeTasksCount = 1; // Keeping simple or derive from activeTask() ? 1 if activeTask() else 0

  history = this.tripService.history;

  viewTask(id: number) {
    this.router.navigate(['/task-detail', id]);
  }
}
