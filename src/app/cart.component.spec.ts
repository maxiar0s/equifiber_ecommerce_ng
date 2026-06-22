import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CartComponent } from './cart.component';
import { DataService } from './data.service';

describe('CartComponent', () => {
  it('allows checkout data without a shipping address', () => {
    const data = {
      cart: [{ id: 'bolsa-120', name: 'Equi-Fiber Bolsa 120 g', price: 2990, qty: 1 }],
      session: { email: 'cliente@correo.cl', role: 'cliente' },
      cartTotal: 2990,
      format: (value: number) => `$${value}`,
      changeQty: () => undefined,
      createOrder: () => undefined
    } as unknown as DataService;
    const router = { navigateByUrl: jasmine.createSpy('navigateByUrl') } as unknown as Router;
    const component = new CartComponent(data, router, new FormBuilder());

    component.checkoutForm.setValue({
      name: 'Maria Perez',
      address: '',
      city: 'Santiago',
      payment: 'Transferencia simulada'
    });

    expect(component.checkoutForm.valid).toBeTrue();
  });
});
