import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DataService, Order } from './data.service';

@Component({
  selector: 'app-orders',
  imports: [CommonModule],
  template: `
    <main class="container py-5">
      <div class="section-heading"><span class="eyebrow">Cliente</span><h1>Monitoreo de compras</h1></div>
      <div class="panel">
        <ng-container *ngIf="visibleOrders.length; else noOrders">
          <div class="cart-row" *ngFor="let order of visibleOrders">
            <div><strong>{{ order.id }}</strong><br><span>{{ order.date }} | {{ order.status }}</span></div>
            <div><div *ngFor="let item of order.items">{{ item.qty }} x {{ item.name }}</div></div>
            <strong>{{ data.format(order.total) }}</strong>
          </div>
        </ng-container>
        <ng-template #noOrders><p class="mb-0">Aun no tienes compras registradas.</p></ng-template>
      </div>
    </main>
  `
})
export class OrdersComponent {
  constructor(public data: DataService) {}

  get visibleOrders(): Order[] {
    return this.data.orders.filter((order) => order.email === this.data.session?.email);
  }
}
