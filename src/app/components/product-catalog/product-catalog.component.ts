import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../services/data.service';

@Component({
  selector: 'app-product-catalog',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="row g-4" *ngIf="products.length > 0; else loading">
      <div class="col-12 col-md-6 col-xl-4" *ngFor="let product of products">
        <article class="product-card">
          <div class="product-visual"><span>EF</span><div class="stock-pill">Stock {{ product.stock }}</div></div>
          <h3>{{ product.name }}</h3>
          <p>{{ product.desc }}</p>
          <div class="d-flex justify-content-between align-items-center gap-3 mt-3">
            <div class="price">{{ formatPrice(product.price) }}</div>
            <div class="d-flex gap-3">
              <a class="btn btn-outline-dark" [routerLink]="['/producto', product.id]">Ver</a>
              <button class="btn btn-forest" type="button" [disabled]="product.stock === 0" (click)="add.emit(product.id)">Agregar</button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <ng-template #loading>
      <div class="panel text-center">
        <h3>Cargando productos desde JSON...</h3>
        <p class="mb-0">El catalogo se obtiene desde <code>public/data/products.json</code>.</p>
      </div>
    </ng-template>
  `
})
export class ProductCatalogComponent {
  @Input({ required: true }) products: Product[] = [];
  @Input({ required: true }) formatPrice!: (value: number) => string;
  @Output() add = new EventEmitter<string>();
}
