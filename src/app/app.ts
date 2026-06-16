import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  menuOpen = false;

  constructor(public data: DataService) {}

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {
    this.data.logout();
    this.closeMenu();
  }
}
