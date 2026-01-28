import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ApiResponse, DeliveryItem } from '../../core/models/core.model';
import { TripService } from '../../core/services/trip';
import { CommonService } from '../../common/services/common-service';
import { DeliveryService } from '../../core/services/delivery';

@Component({
  selector: 'app-delivery-list',
  imports: [CommonModule],
  templateUrl: './delivery-list.html',
  styleUrl: './delivery-list.scss',
})
export class DeliveryList {
  private tripService = inject(TripService);
  private deliveryService = inject(DeliveryService);
  private commonService = inject(CommonService);
  private router = inject(Router);
  private tripId = inject(ActivatedRoute).snapshot.params['tripId'];
  private destroy$ = new Subject<void>();
  items = this.deliveryService.items;
  stats = computed(() => {
    const total = this.items().length;
    const completed = this.items().filter(item => item.isDelivered).length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, progress };
  });

  ngOnInit() {
    this.commonService.showLoader();
    this.tripService.getDeliveryList(this.tripId).subscribe({
      next: (res: ApiResponse<DeliveryItem[]>) => {
        this.deliveryService.deliveries.set(res.data);
        this.commonService.hideLoader();
      },
      error: (err) => {
        this.commonService.hideLoader();
      }
    });
  }

  goBack() {
    window.history.back();
  }

  onDeliver(id: number) {
    this.router.navigate(['/delivery-receipt', this.tripId], { queryParams: { id } });
  }

  proceedNext() {
    this.router.navigate(['/expenses', this.tripId]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
