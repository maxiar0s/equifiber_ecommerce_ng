import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  desc: string;
}

export interface User {
  name: string;
  rut: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  address: string;
  horse: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  email: string;
  date: string;
  items: CartItem[];
  total: number;
  status: string;
}

export interface Session {
  email: string;
  role: string;
}

export interface HomeFeature {
  number: string;
  title: string;
  description: string;
  featured: boolean;
}

export interface HomeMetric {
  value: string;
  label: string;
}

export interface HomeContent {
  features: HomeFeature[];
  metrics: HomeMetric[];
}

/**
 * Centraliza los datos simulados de Equi-Fiber desde archivos JSON y localStorage.
 * Permite demostrar autenticacion por roles, carrito, inventario y compras sin backend real.
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  products = this.load<Product[]>('products', []);
  users = this.load<User[]>('users', []);
  cart = this.load<CartItem[]>('cart', []);
  orders = this.load<Order[]>('orders', []);
  session = this.load<Session | null>('session', null);
  homeContent: HomeContent = { features: [], metrics: [] };
  loadingJson = this.products.length === 0 || this.users.length === 0;

  readonly currency = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

  constructor(private router: Router, private http: HttpClient) {
    this.loadJsonData();
  }

  get cartCount(): number {
    return this.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  get cartTotal(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  format(value: number): string {
    return this.currency.format(value);
  }

  /** Agrega un producto al carrito respetando el stock disponible. */
  addToCart(id: string): void {
    const product = this.products.find((item) => item.id === id);
    if (!product || product.stock === 0) return;
    const existing = this.cart.find((item) => item.id === id);
    if (existing && existing.qty < product.stock) existing.qty += 1;
    else if (!existing) this.cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
    this.persistCart();
  }

  changeQty(id: string, delta: number): void {
    const item = this.cart.find((candidate) => candidate.id === id);
    const product = this.products.find((candidate) => candidate.id === id);
    if (!item) return;
    if (delta > 0 && product && item.qty >= product.stock) return;
    item.qty += delta;
    if (item.qty <= 0) this.cart = this.cart.filter((candidate) => candidate.id !== id);
    this.persistCart();
  }

  /** Valida credenciales locales y redirige segun el rol del usuario. */
  login(email: string, password: string): boolean {
    const found = this.users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password);
    if (!found) return false;
    this.session = { email: found.email, role: found.role };
    this.persistSession();
    this.router.navigateByUrl(found.role === 'admin' ? '/admin' : '/tienda');
    return true;
  }

  register(user: User): boolean {
    if (this.users.some((item) => item.email.toLowerCase() === user.email.toLowerCase())) return false;
    this.users.push(user);
    this.persistUsers();
    return true;
  }

  logout(): void {
    this.session = null;
    this.persistSession();
    this.router.navigateByUrl('/inicio');
  }

  /** Crea una orden con pago simulado, descuenta inventario y vacia el carrito. */
  createOrder(): void {
    if (!this.session || this.cart.length === 0) return;
    this.orders.unshift({
      id: `EQ-${Date.now()}`,
      email: this.session.email,
      date: new Date().toLocaleDateString('es-CL'),
      items: this.cart.map((item) => ({ ...item })),
      total: this.cartTotal,
      status: 'Pago simulado exitoso'
    });
    this.cart.forEach((item) => {
      const product = this.products.find((candidate) => candidate.id === item.id);
      if (product) product.stock = Math.max(0, product.stock - item.qty);
    });
    this.cart = [];
    this.persistOrders();
    this.persistProducts();
    this.persistCart();
  }

  persistProducts(): void { this.save('products', this.products); }
  persistUsers(): void { this.save('users', this.users); }
  persistCart(): void { this.save('cart', this.cart); }
  persistOrders(): void { this.save('orders', this.orders); }
  persistSession(): void { this.save('session', this.session); }

  private load<T>(key: string, fallback: T): T {
    const saved = localStorage.getItem(`equifiber_${key}`);
    return saved ? JSON.parse(saved) as T : fallback;
  }

  private save(key: string, value: unknown): void {
    localStorage.setItem(`equifiber_${key}`, JSON.stringify(value));
  }

  private loadJsonData(): void {
    if (this.products.length === 0) {
      this.http.get<Product[]>('/data/products.json').subscribe((products) => {
        this.products = products;
        this.persistProducts();
        this.loadingJson = false;
      });
    }

    if (this.users.length === 0) {
      this.http.get<User[]>('/data/users.json').subscribe((users) => {
        this.users = users;
        this.persistUsers();
        this.loadingJson = false;
      });
    }

    this.http.get<HomeContent>('/data/home-content.json').subscribe((content) => {
      this.homeContent = content;
    });
  }
}
