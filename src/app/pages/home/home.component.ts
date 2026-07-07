import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <main>
      <section class="hero-wrap">
        <div class="container">
          <div class="row align-items-center g-5 min-vh-75">
            <div class="col-12 col-lg-7">
              <span class="eyebrow">Snacks funcionales para equinos</span>
              <h1 class="display-3 hero-title">Premios saludables para caballos, sin azucar anadida.</h1>
              <p class="lead hero-copy">Equi-Fiber combina avena integral, zanahoria fresca, alfalfa, linaza, aceite de canola y vitamina E en un snack alto en fibra pensado para complementar el bienestar digestivo.</p>
              <div class="d-flex flex-column flex-sm-row gap-3 mt-4">
                <a class="btn btn-forest btn-lg" routerLink="/producto/bolsa-120">Comprar bolsa 120 g</a>
                <a class="btn btn-outline-dark btn-lg" routerLink="/registro">Crear cuenta</a>
              </div>
            </div>
            <div class="col-12 col-lg-5">
              <div class="product-orbit">
                <div class="bag-card"><span class="bag-label">Equi-Fiber</span><strong>6 snacks</strong><small>120 g | Alto en fibra</small><div class="bag-price">$2.990</div></div>
                <div class="orbit-note note-a">Sin melaza</div><div class="orbit-note note-b">Con linaza</div><div class="orbit-note note-c">Vitamina E</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section class="container py-5">
        <div class="row g-4">
          <div class="col-12 col-md-4" *ngFor="let feature of data.homeContent.features">
            <article class="feature-card" [class.featured]="feature.featured"><span>{{ feature.number }}</span><h3>{{ feature.title }}</h3><p>{{ feature.description }}</p></article>
          </div>
        </div>
      </section>
      <section class="container pb-5">
        <div class="row g-4 align-items-stretch">
          <div class="col-12 col-lg-6"><div class="story-panel h-100"><h2>Para centros ecuestres, equinoterapia y duenos responsables.</h2><p>El canal principal de Equi-Fiber es venta online con despacho, facilitando la compra recurrente para cuidadores, jinetes y centros que buscan una opcion practica y saludable.</p></div></div>
          <div class="col-12 col-lg-6"><div class="row g-3 h-100">
            <div class="col-6" *ngFor="let metric of data.homeContent.metrics"><div class="metric-box"><strong>{{ metric.value }}</strong><span>{{ metric.label }}</span></div></div>
          </div></div>
        </div>
      </section>
    </main>
  `
})
export class HomeComponent {
  constructor(public data: DataService) {}
}
