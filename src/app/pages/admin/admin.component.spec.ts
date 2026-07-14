/// <reference types="jasmine" />

import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import { AdminComponent } from './admin.component';
import { DataService, Product, User } from '../../services/data.service';

describe('AdminComponent', () => {
  let products: Product[];
  let users: User[];
  let component: AdminComponent;

  beforeEach(() => {
    products = [];
    users = [
      { name: 'Administrador', rut: '11111111-1', email: 'admin@equifiber.cl', phone: '+56 9 1111 1111', role: 'admin', password: 'Admin123!', address: '', horse: '' },
      { name: 'Cliente', rut: '12345678-9', email: 'cliente@correo.cl', phone: '+56 9 1234 5678', role: 'cliente', password: 'Clave123', address: '', horse: '' }
    ];
    const data = {
      products,
      users,
      cart: [],
      session: { email: 'admin@equifiber.cl', role: 'admin' },
      createProduct: jasmine.createSpy('createProduct').and.callFake((product: Omit<Product, 'id'>) => {
        const created = { ...product, id: 'firebase-id' };
        products.push(created);
        return of(created);
      }),
      updateProduct: jasmine.createSpy('updateProduct').and.callFake((product: Product) => of(product)),
      deleteProduct: jasmine.createSpy('deleteProduct').and.returnValue(of(undefined)),
      saveUser: jasmine.createSpy('saveUser').and.callFake((user: User) => of(user)),
      deleteUser: jasmine.createSpy('deleteUser').and.returnValue(of(undefined)),
      persistCart: jasmine.createSpy('persistCart'),
      format: (value: number) => `$${value}`
    } as unknown as DataService;

    component = new AdminComponent(data, new FormBuilder());
  });

  it('does not save a product without description', () => {
    component.productForm.setValue({
      name: 'Producto valido',
      price: 1000,
      stock: 10,
      desc: ''
    });

    component.save();

    expect(products.length).toBe(0);
    expect(component.productForm.invalid).toBeTrue();
  });

  it('adds a valid product to inventory', () => {
    component.productForm.setValue({
      name: 'Producto valido',
      price: 1500,
      stock: 10,
      desc: 'Descripcion valida del producto'
    });

    component.save();

    expect(products.length).toBe(1);
    expect(products[0].name).toBe('Producto valido');
    expect(component.success).toBeTrue();
  });

  it('removes a non-admin user', () => {
    component.removeUser('cliente@correo.cl');

    expect(component.data.users.length).toBe(1);
    expect(component.data.users[0].email).toBe('admin@equifiber.cl');
  });

  it('does not remove the main admin user', () => {
    component.removeUser('admin@equifiber.cl');

    expect(users.length).toBe(2);
  });

  it('updates a non-admin user profile from the admin panel', () => {
    component.editUser(users[1]);
    component.userForm.setValue({ name: 'Cliente Editado', role: 'centro', phone: '+56 9 8765 4321' });

    component.saveUser();

    expect(users[1].name).toBe('Cliente Editado');
    expect(users[1].role).toBe('centro');
    expect(component.userSuccess).toBeTrue();
  });
});
