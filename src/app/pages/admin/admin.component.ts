import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Product, User } from '../../services/data.service';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <main class="container py-5">
      <div class="section-heading"><span class="eyebrow">Administrador</span><h1>Mantenedores Equi-Fiber</h1><p>Gestion de productos, inventario, clientes y usuarios.</p></div>
      <div class="row g-4">
        <div class="col-12 col-xl-4">
          <form class="panel" [formGroup]="productForm" novalidate (ngSubmit)="save()">
            <h3>Producto</h3>
            <div class="mb-3"><label class="form-label" for="productName">Nombre</label><input class="form-control" id="productName" formControlName="name" [class.is-invalid]="invalid('name')" [class.is-valid]="valid('name')"><div class="invalid-feedback">Minimo 4 caracteres.</div></div>
            <div class="mb-3"><label class="form-label" for="productPrice">Precio CLP</label><input type="number" class="form-control" id="productPrice" formControlName="price" [class.is-invalid]="invalid('price')" [class.is-valid]="valid('price')"><div class="invalid-feedback">Precio minimo $1.000.</div></div>
            <div class="mb-3"><label class="form-label" for="productStock">Stock</label><input type="number" class="form-control" id="productStock" formControlName="stock" [class.is-invalid]="invalid('stock')" [class.is-valid]="valid('stock')"><div class="invalid-feedback">Stock no puede ser negativo.</div></div>
            <div class="mb-3"><label class="form-label" for="productDesc">Descripcion</label><textarea class="form-control" id="productDesc" formControlName="desc" [class.is-invalid]="invalid('desc')" [class.is-valid]="valid('desc')"></textarea><div class="invalid-feedback">Describe el producto con al menos 10 caracteres.</div></div>
            <div class="d-flex gap-2"><button class="btn btn-forest flex-fill" type="submit">Guardar producto</button><button class="btn btn-outline-dark flex-fill" type="button" (click)="clear()">Limpiar</button></div>
            <div class="alert alert-danger mt-3" *ngIf="submitted && productForm.invalid">Completa todos los campos requeridos antes de guardar.</div>
            <div class="alert alert-success mt-3" *ngIf="success">Producto guardado correctamente en Firebase.</div>
            <div class="alert alert-danger mt-3" *ngIf="apiError">Firebase no pudo completar la operacion.</div>
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
            <table class="table align-middle"><thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Telefono</th><th>Acciones</th></tr></thead><tbody>
              <tr *ngFor="let user of data.users"><td>{{ user.name }}</td><td>{{ user.email }}</td><td>{{ user.role }}</td><td>{{ user.phone }}</td><td><button class="btn btn-sm btn-outline-dark me-1" type="button" [disabled]="!canManageUser(user.email)" (click)="editUser(user)">Editar</button><button class="btn btn-sm btn-outline-danger" type="button" [disabled]="!canManageUser(user.email)" (click)="removeUser(user.email)">Eliminar</button></td></tr>
            </tbody></table>
            <form class="mt-4" *ngIf="selectedUserEmail" [formGroup]="userForm" novalidate (ngSubmit)="saveUser()">
              <h4>Editar usuario</h4>
              <p class="mb-3"><strong>{{ selectedUserEmail }}</strong></p>
              <div class="row g-3">
                <div class="col-12 col-lg-4"><label class="form-label" for="userName">Nombre</label><input class="form-control" id="userName" formControlName="name" [class.is-invalid]="invalidUser('name')"><div class="invalid-feedback">Minimo 3 caracteres.</div></div>
                <div class="col-12 col-lg-4"><label class="form-label" for="userRole">Rol</label><select class="form-select" id="userRole" formControlName="role" [class.is-invalid]="invalidUser('role')"><option value="cliente">Cliente</option><option value="centro">Centro ecuestre</option></select><div class="invalid-feedback">Selecciona un rol.</div></div>
                <div class="col-12 col-lg-4"><label class="form-label" for="userPhone">Telefono</label><input class="form-control" id="userPhone" formControlName="phone" [class.is-invalid]="invalidUser('phone')"><div class="invalid-feedback">Telefono chileno invalido.</div></div>
              </div>
              <div class="d-flex gap-2 mt-3"><button class="btn btn-forest" type="submit">Guardar usuario</button><button class="btn btn-outline-dark" type="button" (click)="clearUser()">Cancelar</button></div>
              <div class="alert alert-danger mt-3" *ngIf="userSubmitted && userForm.invalid">Revisa los campos del usuario.</div>
              <div class="alert alert-success mt-3" *ngIf="userSuccess">Usuario actualizado correctamente.</div>
              <div class="alert alert-danger mt-3" *ngIf="userApiError">Firebase no pudo completar la operacion del usuario.</div>
            </form>
          </div>
        </div>
      </div>
    </main>
  `
})
export class AdminComponent {
  draft: Product = this.emptyProduct();
  productForm: FormGroup;
  userForm: FormGroup;
  submitted = false;
  success = false;
  apiError = false;
  userSubmitted = false;
  userSuccess = false;
  userApiError = false;
  selectedUserEmail = '';

  constructor(public data: DataService, private fb: FormBuilder) {
    this.productForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(4)]],
      price: [1000, [Validators.required, Validators.min(1000)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      desc: ['', [Validators.required, Validators.minLength(10)]]
    });
    this.userForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      role: ['cliente', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+?56?\s?9\s?\d{4}\s?\d{4}$/)]]
    });
  }

  edit(product: Product): void {
    this.draft = { ...product };
    this.submitted = false;
    this.success = false;
    this.productForm.reset({ name: product.name, price: product.price, stock: product.stock, desc: product.desc });
  }

  remove(id: string): void {
    this.apiError = false;
    this.data.deleteProduct(id).subscribe({
      error: () => this.apiError = true
    });
  }

  canManageUser(email: string): boolean {
    const normalizedEmail = email.toLowerCase();
    return normalizedEmail !== 'admin@equifiber.cl' && normalizedEmail !== this.data.session?.email.toLowerCase();
  }

  removeUser(email: string): void {
    if (!this.canManageUser(email)) return;
    const user = this.data.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
    if (!user) return;
    this.userApiError = false;
    this.data.deleteUser(user).subscribe({
      next: () => {
        this.data.users = this.data.users.filter((item) => item.email.toLowerCase() !== email.toLowerCase());
        if (this.selectedUserEmail.toLowerCase() === email.toLowerCase()) this.clearUser();
      },
      error: () => this.userApiError = true
    });
  }

  editUser(user: User): void {
    if (!this.canManageUser(user.email)) return;
    this.selectedUserEmail = user.email;
    this.userSubmitted = false;
    this.userSuccess = false;
    this.userApiError = false;
    this.userForm.reset({ name: user.name, role: user.role, phone: user.phone });
  }

  saveUser(): void {
    this.userSubmitted = true;
    this.userSuccess = false;
    this.userApiError = false;
    if (!this.selectedUserEmail || this.userForm.invalid) return;
    const user = this.data.users.find((item) => item.email.toLowerCase() === this.selectedUserEmail.toLowerCase());
    if (!user) return;
    Object.assign(user, this.userForm.getRawValue());
    this.data.saveUser(user).subscribe({
      next: () => {
        this.userSuccess = true;
        this.userSubmitted = false;
      },
      error: () => this.userApiError = true
    });
  }

  clearUser(): void {
    this.selectedUserEmail = '';
    this.userSubmitted = false;
    this.userSuccess = false;
    this.userApiError = false;
    this.userForm.reset({ name: '', role: 'cliente', phone: '' });
  }

  save(): void {
    this.submitted = true;
    this.success = false;
    this.apiError = false;
    if (this.productForm.invalid) return;
    const value = this.productForm.getRawValue();
    const payload = { ...value, price: Number(value.price), stock: Number(value.stock) };
    const request = this.draft.id
      ? this.data.updateProduct({ ...payload, id: this.draft.id })
      : this.data.createProduct(payload);

    request.subscribe({
      next: () => {
        this.success = true;
        this.submitted = false;
        this.draft = this.emptyProduct();
        this.productForm.reset({ name: '', price: 1000, stock: 0, desc: '' });
      },
      error: () => this.apiError = true
    });
  }

  clear(): void {
    this.submitted = false;
    this.success = false;
    this.apiError = false;
    this.draft = this.emptyProduct();
    this.productForm.reset({ name: '', price: 1000, stock: 0, desc: '' });
  }

  invalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && this.submitted && control.invalid;
  }

  valid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!control && this.submitted && control.valid;
  }

  invalidUser(controlName: string): boolean {
    const control = this.userForm.get(controlName);
    return !!control && this.userSubmitted && control.invalid;
  }

  private emptyProduct(): Product {
    return { id: '', name: '', price: 1000, stock: 0, desc: '' };
  }
}
