import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DataService, Product } from '../../services/data.service';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container py-5">
      <article class="row g-4 align-items-stretch" *ngIf="product; else notFound">
        <div class="col-12 col-lg-6"><div class="product-visual detail-visual h-100"><span>EF</span><div class="stock-pill">Stock {{ product.stock }}</div></div></div>
        <div class="col-12 col-lg-6"><div class="panel h-100">
          <span class="eyebrow">Detalle dinamico</span><h1>{{ product.name }}</h1><p>{{ product.desc }}</p>
          <div class="price mt-3">{{ data.format(product.price) }}</div>
          <button class="btn btn-forest btn-lg mt-4" type="button" [disabled]="product.stock === 0" (click)="data.addToCart(product.id)">Agregar al carrito</button>
          <a class="btn btn-outline-dark btn-lg mt-4 ms-2" routerLink="/tienda">Volver a tienda</a>
        </div></div>
      </article>
      <ng-template #notFound><div class="panel"><h1>Producto no encontrado</h1><a routerLink="/tienda">Volver a tienda</a></div></ng-template>
    </main>
  `
})
export class ProductDetailComponent {
  product?: Product;

  constructor(route: ActivatedRoute, public data: DataService) {
    const id = route.snapshot.paramMap.get('id');
    this.product = data.products.find((item) => item.id === id);
  }
}
