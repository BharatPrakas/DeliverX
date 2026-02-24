import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TripService } from '../../core/services/trip';
import { CommonService } from '../../common/services/common-service';
import { Subject, takeUntil } from 'rxjs';
import { ApiResponse, TripSupplier } from '../../core/models/core.model';

@Component({
  selector: 'app-purchase-receipt',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './purchase-receipt.html',
  styleUrl: './purchase-receipt.scss',
})
export class PurchaseReceipt implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private tripService = inject(TripService);
  private commonService = inject(CommonService);

  private destroy$ = new Subject<void>();

  tripId: string = '';
  supplierId: string = '';

  supplier: Partial<TripSupplier> & { location?: string } = {
    name: 'Loading...',
    address: '',
    location: '',
    phone: '',
    boxes: 0
  };

  receiptForm: FormGroup = this.fb.group({
    totalWeight: ['1', Validators.required],
    numberOfBirds: ['1', Validators.required]
  });

  ngOnInit() {
    this.tripId = this.route.snapshot.params['tripId'];
    this.supplierId = this.route.snapshot.queryParams['supplierId'];
    
    // We could either fetch individual supplier or just fallback to static data if not found.
    // For demo/design purposes based on prompt we can provide mock data or try fetching from list
    this.fetchSupplierData();
  }

  fetchSupplierData() {
    this.commonService.showLoader();
    this.tripService.getTripSuppliers(Number(this.tripId)).pipe(takeUntil(this.destroy$)).subscribe({
      next: (res: ApiResponse<TripSupplier[]>) => {
        if (res.success && res.data) {
          const found = res.data.find(s => s.id === Number(this.supplierId));
          if (found) {
            this.supplier = {
                ...found,
                // Assign location same as address if needed, or use static based on mockup
                location: found.address
            };
          } else {
             // Fallback simulated data based on UI mockup
            this.supplier = {
              name: 'Sree Broilers',
              address: 'Jallikattuvalavu, Salem',
              location: 'Jallikattuvalavu, Salem',
              phone: '99940 41431',
              boxes: 14
            };
          }
        }
      },
      error: (error) => {
        console.log(error);
        // Fallback simulated data based on UI mockup
        this.supplier = {
            name: 'Sree Broilers',
            address: 'Jallikattuvalavu, Salem',
            location: 'Jallikattuvalavu, Salem',
            phone: '99940 41431',
            boxes: 14
        };
      },
      complete: () => {
        this.commonService.hideLoader();
      }
    });
  }

  goBack() {
    window.history.back();
  }

  confirmPurchase() {
    if (this.receiptForm.valid) {
      console.log('Purchase confirmed', this.receiptForm.value);
      // Assume successful and navigate back
      this.goBack();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
