import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-purchase',
  imports: [CommonModule],
  templateUrl: './purchase.html',
  styleUrl: './purchase.scss',
})
export class Purchase {
  private router = inject(Router);

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

  goBack() {
    window.history.back();
  }

  markAsPurchased() {
    console.log('Marked as purchased');
    this.router.navigate(['/delivery-list']);
  }
}
