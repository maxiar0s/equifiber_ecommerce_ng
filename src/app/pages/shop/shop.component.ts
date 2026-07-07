import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ProductCatalogComponent } from '../../components/product-catalog/product-catalog.component';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, ProductCatalogComponent],
  template: `
    <main class="container py-5">
      <div class="section-heading"><span class="eyebrow">Tienda online</span><h1>Catalogo Equi-Fiber</h1><p>Compra snacks funcionales y simula el despacho para tu centro o caballo.</p></div>
      <app-product-catalog [products]="data.products" [formatPrice]="formatPrice" (add)="data.addToCart($event)" />
    </main>
  `
})
export class ShopComponent {
  constructor(public data: DataService) {}

  formatPrice = (value: number): string => this.data.format(value);
}
