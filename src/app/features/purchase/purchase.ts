import { Component, inject, OnInit, OnDestroy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from '../../core/services/trip';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse, TripSupplier } from '../../core/models/core.model';
import { CommonService } from '../../common/services/common-service';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule],
  templateUrl: './purchase.html',
  styleUrl: './purchase.scss',
})
export class Purchase implements OnInit, OnDestroy {
  private tripId = inject(ActivatedRoute).snapshot.params['tripId'];
  private router = inject(Router);
  private tripService = inject(TripService);
  private commonService = inject(CommonService);
  /** 
   * Subject for managing unsubscriptions and avoiding memory leaks.
   */
  private destroy$ = new Subject<void>();
  
  suppliers = signal<TripSupplier[]>([]);
  totalBoxes = 0;
  totalSuppliers = 0;
  completedSuppliers = 0;

  /** True when at least one supplier has been purchased — enough to start delivering. */
  anySuppliersCompleted = computed(() => this.suppliers().some(s => s.isDelivered));

  ngOnInit() {
    this.commonService.showLoader();
    this.tripService.getTripSuppliers(Number(this.tripId)).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ApiResponse<TripSupplier[]>) => {
        if (res.success && res.data) {
          this.suppliers.set(res.data);
          this.totalSuppliers = this.suppliers().length;
          this.totalBoxes = this.suppliers().reduce((sum, supplier) => sum + (supplier.boxes || 0), 0);
          this.completedSuppliers = this.suppliers().filter(s => s.isDelivered).length;
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.commonService.hideLoader();
      }
    });
  }

  goBack() {
    window.history.back();
  }

  goToReceipt(supplier: TripSupplier) {
    this.router.navigate(['/purchase-receipt', this.tripId], {state: { supplier }});
  }

  navigateToDeliveryList() {
    if (!this.anySuppliersCompleted()) {
      return;
    }
    this.router.navigate(['/delivery-list', this.tripId]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
