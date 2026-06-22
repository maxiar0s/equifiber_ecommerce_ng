import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Product } from './data.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="container py-5">
      <div class="section-heading"><span class="eyebrow">Administrador</span><h1>Mantenedores Equi-Fiber</h1><p>Gestion de productos, inventario, clientes y usuarios.</p></div>
      <div class="row g-4">
        <div class="col-12 col-xl-4">
          <form class="panel" [formGroup]="productForm" [class.was-validated]="submitted" novalidate (ngSubmit)="save()">
            <h3>Producto</h3>
            <div class="mb-3"><label class="form-label" for="productName">Nombre</label><input class="form-control" id="productName" formControlName="name"><div class="invalid-feedback">Minimo 4 caracteres.</div></div>
            <div class="mb-3"><label class="form-label" for="productPrice">Precio CLP</label><input type="number" class="form-control" id="productPrice" formControlName="price"><div class="invalid-feedback">Precio minimo $1.000.</div></div>
            <div class="mb-3"><label class="form-label" for="productStock">Stock</label><input type="number" class="form-control" id="productStock" formControlName="stock"><div class="invalid-feedback">Stock no puede ser negativo.</div></div>
            <div class="mb-3"><label class="form-label" for="productDesc">Descripcion</label><textarea class="form-control" id="productDesc" formControlName="desc"></textarea><div class="invalid-feedback">Describe el producto.</div></div>
            <div class="d-flex gap-2"><button class="btn btn-forest flex-fill" type="submit">Guardar producto</button><button class="btn btn-outline-dark flex-fill" type="button" (click)="clear()">Limpiar</button></div>
          </form>
        </div>
        <div class="col-12 col-xl-8">
          <div class="panel table-responsive">
            <h3>Productos e inventario</h3>
            <table class="table align-middle"><thead><tr><th>Producto</th><th>Precio</th><th>Stock</th><th>Acciones</th></tr></thead><tbody>
              <tr *ngFor="let product of data.products"><td>{{ product.name }}</td><td>{{ data.format(product.price) }}</td><td>{{ product.stock }}</td><td><button class="btn btn-sm btn-outline-dark" type="button" (click)="edit(product)">Editar</button> <button class="btn btn-sm btn-outline-danger" type="button" (click)="remove(product.id)">Eliminar</button></td></tr>
            </tbody></table>
          </div>
          <div class="panel table-responsive mt-4">
            <h3>Usuarios registrados</h3>
            <table class="table align-middle"><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Telefono</th></tr></thead><tbody>
              <tr *ngFor="let user of data.users"><td>{{ user.name }}</td><td>{{ user.email }}</td><td>{{ user.role }}</td><td>{{ user.phone }}</td></tr>
            </tbody></table>
          </div>
        </div>
      </div>
    </main>
  `
})
export class AdminComponent {
  draft: Product = this.emptyProduct();
  productForm: FormGroup;
  submitted = false;

  constructor(public data: DataService, private fb: FormBuilder) {
    this.productForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      price: [1000, [Validators.required, Validators.min(1000)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      desc: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  edit(product: Product): void {
    this.draft = { ...product };
    this.submitted = false;
    this.productForm.reset({ name: product.name, price: product.price, stock: product.stock, desc: product.desc });
  }

  remove(id: string): void {
    this.data.products = this.data.products.filter((product) => product.id !== id);
    this.data.cart = this.data.cart.filter((item) => item.id !== id);
    this.data.persistProducts();
    this.data.persistCart();
  }

  save(): void {
    this.submitted = true;
    if (this.productForm.invalid) return;
    const value = this.productForm.getRawValue();
    const product = { ...value, id: this.draft.id || `prod-${Date.now()}`, price: Number(value.price), stock: Number(value.stock) };
    const index = this.data.products.findIndex((item) => item.id === product.id);
    if (index >= 0) this.data.products[index] = product;
    else this.data.products.push(product);
    this.data.persistProducts();
    this.clear();
  }

  clear(): void {
    this.submitted = false;
    this.draft = this.emptyProduct();
    this.productForm.reset({ name: '', price: 1000, stock: 0, desc: '' });
  }

  private emptyProduct(): Product {
    return { id: '', name: '', price: 1000, stock: 0, desc: '' };
  }
}
