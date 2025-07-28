import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css'
})
export class ClientComponent {


}
