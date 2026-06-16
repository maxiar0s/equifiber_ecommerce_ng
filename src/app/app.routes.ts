import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { adminGuard, authGuard } from './auth.guard';
import { CartComponent } from './cart.component';
import { ForgotComponent } from './forgot.component';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login.component';
import { OrdersComponent } from './orders.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProfileComponent } from './profile.component';
import { RegisterComponent } from './register.component';
import { ShopComponent } from './shop.component';

export const routes: Routes = [
  { path: 'inicio', component: HomeComponent },
  { path: 'tienda', component: ShopComponent },
  { path: 'producto/:id', component: ProductDetailComponent },
  { path: 'carrito', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'recuperar', component: ForgotComponent },
  { path: 'perfil', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'compras', component: OrdersComponent, canActivate: [authGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: '**', redirectTo: 'inicio' }
];
