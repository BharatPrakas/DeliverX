import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliveryService, DeliveryItem } from '../../core/services/delivery';

@Component({
  selector: 'app-delivery-receipt',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './delivery-receipt.html',
  styleUrl: './delivery-receipt.scss',
})
export class DeliveryReceipt implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private deliveryService = inject(DeliveryService);

  delivery = signal<DeliveryItem | undefined>(undefined);

  form = this.fb.group({
    entries: this.fb.array([]),
    numberOfBirds: [0],
    ratePerKg: [0, Validators.required],
    cashReceived: [0]
  });

  totalCages = computed(() => {
    return this.entries.controls.reduce((sum, control) => sum + (Number(control.get('cages')?.value) || 0), 0);
  });

  totalLoadWt = computed(() => {
    return this.entries.controls.reduce((sum, control) => sum + (Number(control.get('loadWt')?.value) || 0), 0);
  });

  totalEmptyWt = computed(() => {
    return this.entries.controls.reduce((sum, control) => sum + (Number(control.get('emptyWt')?.value) || 0), 0);
  });

  birdsWeight = computed(() => {
    return this.totalLoadWt() - this.totalEmptyWt();
  });

  billingAmount = computed(() => {
    const rate = this.form.get('ratePerKg')?.value || 0;
    return this.birdsWeight() * rate;
  });

  balance = computed(() => {
    const cash = this.form.get('cashReceived')?.value || 0;
    return this.billingAmount() - cash;
  });

  get entries() {
    return this.form.get('entries') as FormArray;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        const item = this.deliveryService.getDelivery(id);
        if (item) {
          this.delivery.set(item);
          // Initialize with one row if empty
          if (this.entries.length === 0) {
            this.addRow();
          }
        }
      }
    });

    // Subscribe to form value changes to trigger computed signals updates (since signals don't automatically track formgroup values without explicit connection)
    // Actually, signals computed works if it depends on other signals. Here I am reading form values which are not signals.
    // I need to use valueChanges.

    this.form.valueChanges.subscribe(() => {
      // This is a bit of a workaround to trigger signal re-evaluation if I were to use toSignal on the observable.
      // However, to keep it simple and performant, I'll essentially make the signals derived from a signal that updates on valueChanges.
      this.formUpdateSignal.set(Date.now());
    });
  }

  // Signal to drive computations
  private formUpdateSignal = signal(0);

  // Re-declare computeds to depend on the trigger signal
  stats = computed(() => {
    this.formUpdateSignal(); // dependency
    const entriesVal = this.form.getRawValue().entries as any[];
    const tCages = entriesVal.reduce((s, c) => s + (Number(c.cages) || 0), 0);
    const tLoad = entriesVal.reduce((s, c) => s + (Number(c.loadWt) || 0), 0);
    const tEmpty = entriesVal.reduce((s, c) => s + (Number(c.emptyWt) || 0), 0);
    const bWeight = tLoad - tEmpty;
    const rate = this.form.get('ratePerKg')?.value || 0;
    const billAmt = bWeight * rate;
    const cash = this.form.get('cashReceived')?.value || 0;
    const bal = billAmt - cash;

    return { totalCages: tCages, totalLoadWt: tLoad, totalEmptyWt: tEmpty, birdsWeight: bWeight, billingAmount: billAmt, balance: bal };
  });


  addRow() {
    const row = this.fb.group({
      cages: [''],
      loadWt: [''],
      emptyWt: ['']
    });
    this.entries.push(row);
    this.formUpdateSignal.set(Date.now());
  }

  deleteRow(index: number) {
    this.entries.removeAt(index);
    this.formUpdateSignal.set(Date.now());
  }

  goBack() {
    window.history.back();
  }

  confirmDelivery() {
    if (this.form.valid && this.delivery()) {
      const stats = this.stats();
      const receiptData = {
        entries: this.form.value.entries as any,
        totalBirdsWeight: stats.birdsWeight,
        numberOfBirds: this.form.value.numberOfBirds || 0,
        ratePerKg: this.form.value.ratePerKg || 0,
        billingAmount: stats.billingAmount,
        cashReceived: this.form.value.cashReceived || 0,
        balance: stats.balance
      };
      console.log(receiptData);
      // this.deliveryService.updateDelivery(this.delivery()!.id, receiptData);
      // this.router.navigate(['/delivery-list']);
    }
  }
}
