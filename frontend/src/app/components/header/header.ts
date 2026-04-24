import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onLogout() {
    this.isSidebarOpen = false; // Close the sidebar on logout
    this.authService.logout();
  }

  constructor(public authService: AuthService) {}
}
