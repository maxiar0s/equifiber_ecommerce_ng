import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { DataService, User } from './data.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  template: `
    <main class="container py-5" *ngIf="user">
      <form class="panel profile-panel" #profileForm="ngForm" [class.was-validated]="profileForm.submitted" novalidate (ngSubmit)="save(profileForm)">
        <span class="eyebrow">Cuenta</span><h1>Modificacion de perfil</h1>
        <div class="row g-3">
          <div class="col-12 col-md-6"><label class="form-label" for="profileName">Nombre</label><input class="form-control" id="profileName" name="name" [(ngModel)]="user.name" required minlength="3"><div class="invalid-feedback">Minimo 3 caracteres.</div></div>
          <div class="col-12 col-md-6"><label class="form-label" for="profilePhone">Telefono</label><input class="form-control" id="profilePhone" name="phone" [(ngModel)]="user.phone" required pattern="^\\+?56?\\s?9\\s?\\d{4}\\s?\\d{4}$"><div class="invalid-feedback">Telefono invalido.</div></div>
          <div class="col-12"><label class="form-label" for="profileAddress">Direccion principal</label><input class="form-control" id="profileAddress" name="address" [(ngModel)]="user.address" required minlength="8"><div class="invalid-feedback">Ingresa una direccion valida.</div></div>
          <div class="col-12"><label class="form-label" for="profileHorse">Caballo / centro asociado</label><input class="form-control" id="profileHorse" name="horse" [(ngModel)]="user.horse" required minlength="2"><div class="invalid-feedback">Campo obligatorio.</div></div>
        </div>
        <button class="btn btn-forest mt-4" type="submit">Guardar cambios</button>
        <div class="alert alert-success mt-3" *ngIf="success">Perfil actualizado.</div>
      </form>
    </main>
  `
})
export class ProfileComponent {
  user?: User;
  success = false;

  constructor(private data: DataService) {
    this.user = data.users.find((item) => item.email === data.session?.email);
  }

  save(form: NgForm): void {
    this.success = false;
    if (!form.valid) return;
    this.data.persistUsers();
    this.success = true;
  }
}
