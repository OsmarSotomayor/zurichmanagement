import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/pages/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone:true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

   private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit(): void {
    this.checkAdminRole();
  }

  private checkAdminRole(): void {
    if (this.authService.getRole() !== 'Admin') {
      this.router.navigate(['/login']); // Redirige si no es admin
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
