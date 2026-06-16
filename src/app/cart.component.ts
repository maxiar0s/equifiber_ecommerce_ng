import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container py-5">
      <div class="section-heading"><span class="eyebrow">Compra</span><h1>Carrito y pago simulado</h1></div>
      <div class="row g-4">
        <div class="col-12 col-lg-7">
          <div class="panel">
            <ng-container *ngIf="data.cart.length; else emptyCart">
              <div class="cart-row" *ngFor="let item of data.cart">
                <div><strong>{{ item.name }}</strong><br><span>{{ data.format(item.price) }} c/u</span></div>
                <div class="btn-group" role="group" aria-label="Cantidad">
                  <button class="btn btn-outline-dark" type="button" (click)="data.changeQty(item.id, -1)">-</button>
                  <button class="btn btn-outline-dark" type="button" disabled>{{ item.qty }}</button>
                  <button class="btn btn-outline-dark" type="button" (click)="data.changeQty(item.id, 1)">+</button>
                </div>
                <strong>{{ data.format(item.price * item.qty) }}</strong>
              </div>
            </ng-container>
            <ng-template #emptyCart><p class="mb-0">Tu carrito esta vacio. Agrega productos desde la tienda.</p></ng-template>
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <form class="panel" #checkoutForm="ngForm" [class.was-validated]="checkoutForm.submitted" novalidate (ngSubmit)="checkout(checkoutForm)">
            <h3>Datos de despacho</h3>
            <div class="mb-3"><label class="form-label" for="shippingName">Nombre receptor</label><input class="form-control" id="shippingName" name="shippingName" [(ngModel)]="shipping.name" required minlength="3"><div class="invalid-feedback">Ingresa al menos 3 caracteres.</div></div>
            <div class="mb-3"><label class="form-label" for="shippingAddress">Direccion</label><input class="form-control" id="shippingAddress" name="shippingAddress" [(ngModel)]="shipping.address" required minlength="8"><div class="invalid-feedback">Ingresa una direccion valida.</div></div>
            <div class="mb-3"><label class="form-label" for="shippingCity">Comuna / ciudad</label><input class="form-control" id="shippingCity" name="shippingCity" [(ngModel)]="shipping.city" required minlength="3"><div class="invalid-feedback">Campo obligatorio.</div></div>
            <div class="mb-3"><label class="form-label" for="paymentMethod">Metodo de pago</label><select class="form-select" id="paymentMethod" name="paymentMethod" [(ngModel)]="shipping.payment" required><option value="">Selecciona...</option><option>Transferencia simulada</option><option>Tarjeta simulada</option></select><div class="invalid-feedback">Selecciona un metodo.</div></div>
            <div class="total-line"><span>Total</span><strong>{{ data.format(data.cartTotal) }}</strong></div>
            <button class="btn btn-forest w-100 mt-3" type="submit">Confirmar pago simulado</button>
            <div class="alert alert-success mt-3" *ngIf="success">Pago realizado con exito. Tu compra quedo registrada.</div>
            <div class="alert alert-danger mt-3" *ngIf="checkoutForm.submitted && data.cart.length === 0">Agrega productos antes de pagar.</div>
          </form>
        </div>
      </div>
    </main>
  `
})
export class CartComponent {
  shipping = { name: '', address: '', city: '', payment: '' };
  success = false;

  constructor(public data: DataService, private router: Router) {}

  checkout(form: NgForm): void {
    this.success = false;
    if (!form.valid || this.data.cart.length === 0) return;
    if (!this.data.session) {
      this.router.navigateByUrl('/login');
      return;
    }
    this.data.createOrder();
    this.success = true;
    form.resetForm({ name: '', address: '', city: '', payment: '' });
  }
}
