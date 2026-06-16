import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-shop',
  imports: [CommonModule, RouterLink],
  template: `
    <main class="container py-5">
      <div class="section-heading"><span class="eyebrow">Tienda online</span><h1>Catalogo Equi-Fiber</h1><p>Compra snacks funcionales y simula el despacho para tu centro o caballo.</p></div>
      <div class="row g-4">
        <div class="col-12 col-md-6 col-xl-4" *ngFor="let product of data.products">
          <article class="product-card">
            <div class="product-visual"><span>EF</span><div class="stock-pill">Stock {{ product.stock }}</div></div>
            <h3>{{ product.name }}</h3>
            <p>{{ product.desc }}</p>
            <div class="d-flex justify-content-between align-items-center gap-3 mt-3">
              <div class="price">{{ data.format(product.price) }}</div>
              <div class="d-flex gap-3">
                <a class="btn btn-outline-dark" [routerLink]="['/producto', product.id]">Ver</a>
                <button class="btn btn-forest" type="button" [disabled]="product.stock === 0" (click)="data.addToCart(product.id)">Agregar</button>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>
  `
})
export class ShopComponent {
  constructor(public data: DataService) {}
}
