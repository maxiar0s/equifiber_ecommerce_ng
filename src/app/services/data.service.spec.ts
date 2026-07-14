/// <reference types="jasmine" />

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { DataService, Product, User } from './data.service';

describe('DataService Firebase products', () => {
  let service: DataService;
  let http: HttpTestingController;
  const productsUrl = `${environment.firebaseDatabaseUrl}/products`;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Router, useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') } }
      ]
    });

    service = TestBed.inject(DataService);
    http = TestBed.inject(HttpTestingController);

    const productsRequest = http.expectOne(`${productsUrl}.json`);
    expect(productsRequest.request.method).toBe('GET');
    productsRequest.flush({
      existing: { name: 'Existing product', price: 1000, stock: 2, desc: 'Existing product description' }
    });
    http.expectOne(`${environment.firebaseDatabaseUrl}/users.json`).flush({});
    http.expectOne('/data/home-content.json').flush({ features: [], metrics: [] });
  });

  afterEach(() => http.verify());

  it('loads products with GET', () => {
    expect(service.products).toEqual([
      { id: 'existing', name: 'Existing product', price: 1000, stock: 2, desc: 'Existing product description' }
    ]);
  });

  it('creates a product with POST', () => {
    const product = { name: 'New product', price: 2000, stock: 4, desc: 'New product description' };

    service.createProduct(product).subscribe((created) => expect(created.id).toBe('firebase-key'));

    const request = http.expectOne(`${productsUrl}.json`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(product);
    request.flush({ name: 'firebase-key' });
    expect(service.products.some((item) => item.id === 'firebase-key')).toBeTrue();
  });

  it('updates a product with PUT', () => {
    const product: Product = { id: 'existing', name: 'Updated product', price: 3000, stock: 6, desc: 'Updated product description' };

    service.updateProduct(product).subscribe();

    const request = http.expectOne(`${productsUrl}/existing.json`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ name: product.name, price: product.price, stock: product.stock, desc: product.desc });
    request.flush(request.request.body);
    expect(service.products[0]).toEqual(product);
  });

  it('deletes a product with DELETE', () => {
    service.deleteProduct('existing').subscribe();

    const request = http.expectOne(`${productsUrl}/existing.json`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
    expect(service.products).toEqual([]);
  });

  it('saves a demonstration user in Firebase', () => {
    const user: User = { name: 'Maria Perez', rut: '12345678-9', email: 'maria@correo.cl', phone: '+56 9 1234 5678', role: 'cliente', password: 'Clave123', address: '', horse: 'Relampago' };

    service.saveUser(user).subscribe();

    const request = http.expectOne(`${environment.firebaseDatabaseUrl}/users/12345678-9.json`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(user);
    request.flush(user);
  });

  it('deletes a user profile from Firebase', () => {
    const user: User = { name: 'Maria Perez', rut: '12345678-9', email: 'maria@correo.cl', phone: '+56 9 1234 5678', role: 'cliente', password: 'Clave123', address: '', horse: 'Relampago' };

    service.deleteUser(user).subscribe();

    const request = http.expectOne(`${environment.firebaseDatabaseUrl}/users/12345678-9.json`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
