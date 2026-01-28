import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../core/services/trip';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse } from '../../core/models/core.model';
import { CommonService } from '../../common/services/common-service';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule],
  templateUrl: './purchase.html',
  styleUrl: './purchase.scss',
})
export class Purchase {
  private tripId = inject(ActivatedRoute).snapshot.params['tripId'];
  private router = inject(Router);
  private tripService = inject(TripService);
  private commonService = inject(CommonService);
  /** 
   * Subject for managing unsubscriptions and avoiding memory leaks.
   */
  private destroy$ = new Subject<void>();
  purchaseData = {
    supplier: {
      name: 'Sree Broilers',
      address: 'Jallikattuvalavu, Salem',
      location: 'Jallikattuvalavu, Salem',
      phone: '99940 41431'
    },
    summary: {
      totalBoxes: 21,
      totalCustomers: 6
    },
    customers: [
      { id: 1, name: 'Sri Amman Traders', boxes: 4 },
      { id: 2, name: 'MR Chicken Shop', boxes: 2 },
      { id: 3, name: 'Govind Broilers', boxes: 7 },
      { id: 4, name: 'Jagan Meat House', boxes: 4 },
      { id: 5, name: 'Bala Chicken', boxes: 3 },
      { id: 6, name: 'Ismail Store', boxes: 1 }
    ]
  };

  ngOnInit() {
    console.log(this.tripId);
  }

  goBack() {
    window.history.back();
  }

  markAsPurchased() {
    this.commonService.showLoader();
    this.tripService.markAsPurchased({ tripId: Number(this.tripId) }).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ApiResponse<null>) => {
        this.router.navigate(['/delivery-list', this.tripId]);
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
