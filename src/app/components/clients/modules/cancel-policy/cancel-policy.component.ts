import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientapiService } from '../../clientapi.service';

@Component({
  selector: 'app-cancel-policy',
  standalone:true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cancel-policy.component.html',
  styleUrl: './cancel-policy.component.css'
})
export class CancelPolicyComponent {

   policyId: string = '';
  loading: boolean = false;
  error: string | null = null;
  success: boolean = false;
 constructor(private policyService: ClientapiService) {}

  cancelPolicy(): void {
    if (!this.policyId) {
      this.error = 'Por favor ingrese el ID de la póliza';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = false;

    this.policyService.requestPolicyCancellation(this.policyId).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        this.policyId = ''; // Limpiar el campo después de éxito
        setTimeout(() => this.success = false, 3000); // Ocultar mensaje después de 3 segundos
      },
      error: (err) => {
        // Mostrar el mensaje de error del backend si está disponible
        this.error = err.error?.message || 'Error al cancelar la póliza. Por favor intente nuevamente.';
        this.loading = false;
      }
    });
  }
}
