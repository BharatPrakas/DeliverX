import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeliveryService } from '../../core/services/delivery';

@Component({
  selector: 'app-delivery-list',
  imports: [CommonModule],
  templateUrl: './delivery-list.html',
  styleUrl: './delivery-list.scss',
})
export class DeliveryList {
  private deliveryService = inject(DeliveryService);
  private router = inject(Router);

  items = this.deliveryService.items;
  stats = this.deliveryService.stats;

  goBack() {
    window.history.back();
  }

  onDeliver(id: number) {
    this.router.navigate(['/delivery-receipt'], { queryParams: { id } });
  }

  proceedNext() {
    this.router.navigate(['/expenses']);
  }
}
