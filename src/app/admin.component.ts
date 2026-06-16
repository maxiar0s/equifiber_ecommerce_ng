import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DataService, Product } from './data.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container py-5">
      <div class="section-heading"><span class="eyebrow">Administrador</span><h1>Mantenedores Equi-Fiber</h1><p>Gestion de productos, inventario, clientes y usuarios.</p></div>
      <div class="row g-4">
        <div class="col-12 col-xl-4">
          <form class="panel" #productForm="ngForm" [class.was-validated]="productForm.submitted" novalidate (ngSubmit)="save(productForm)">
            <h3>Producto</h3>
            <div class="mb-3"><label class="form-label" for="productName">Nombre</label><input class="form-control" id="productName" name="name" [(ngModel)]="draft.name" required minlength="4"><div class="invalid-feedback">Minimo 4 caracteres.</div></div>
            <div class="mb-3"><label class="form-label" for="productPrice">Precio CLP</label><input type="number" class="form-control" id="productPrice" name="price" [(ngModel)]="draft.price" required min="1000"><div class="invalid-feedback">Precio minimo $1.000.</div></div>
            <div class="mb-3"><label class="form-label" for="productStock">Stock</label><input type="number" class="form-control" id="productStock" name="stock" [(ngModel)]="draft.stock" required min="0"><div class="invalid-feedback">Stock no puede ser negativo.</div></div>
            <div class="mb-3"><label class="form-label" for="productDesc">Descripcion</label><textarea class="form-control" id="productDesc" name="desc" [(ngModel)]="draft.desc" required minlength="10"></textarea><div class="invalid-feedback">Describe el producto.</div></div>
            <button class="btn btn-forest w-100" type="submit">Guardar producto</button>
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

  constructor(public data: DataService) {}

  edit(product: Product): void {
    this.draft = { ...product };
  }

  remove(id: string): void {
    this.data.products = this.data.products.filter((product) => product.id !== id);
    this.data.cart = this.data.cart.filter((item) => item.id !== id);
    this.data.persistProducts();
    this.data.persistCart();
  }

  save(form: NgForm): void {
    if (!form.valid) return;
    const product = { ...this.draft, id: this.draft.id || `prod-${Date.now()}`, price: Number(this.draft.price), stock: Number(this.draft.stock) };
    const index = this.data.products.findIndex((item) => item.id === product.id);
    if (index >= 0) this.data.products[index] = product;
    else this.data.products.push(product);
    this.data.persistProducts();
    this.draft = this.emptyProduct();
    form.resetForm(this.draft);
  }

  private emptyProduct(): Product {
    return { id: '', name: '', price: 1000, stock: 0, desc: '' };
  }
}
