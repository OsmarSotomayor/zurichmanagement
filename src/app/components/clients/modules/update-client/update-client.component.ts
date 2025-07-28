import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientapiService } from '../../clientapi.service';

@Component({
  selector: 'app-update-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.css']
})
export class UpdateClientComponent {
  clientIdentificator: string = '';
  addres: string = '';
  phoneNumber: string = '';
  loading: boolean = false;
  error: string | null = null;
  success: boolean = false;
  step: 'identificator' | 'form' = 'identificator';

  constructor(private clientService: ClientapiService) {}

  verifyIdentificator(): void {
    if (!this.clientIdentificator) {
      this.error = 'Por favor ingrese su número de identificador';
      return;
    }

    // Validar que sea un número
    if (isNaN(Number(this.clientIdentificator))) {
      this.error = 'El identificador debe ser un número válido';
      return;
    }

    this.step = 'form';
    this.error = null;
  }

  updateClientData(): void {
    if (!this.addres || !this.phoneNumber) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.loading = true;
    this.error = null;
    this.success = false;

    const data = {
      addres: this.addres,
      phoneNumber: this.phoneNumber
    };

    this.clientService.updateClientData(Number(this.clientIdentificator), data).subscribe({
      next: () => {
        this.success = true;
        this.loading = false;
        setTimeout(() => {
          this.success = false;
          this.step = 'identificator';
          this.addres = '';
          this.phoneNumber = '';
        }, 3000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Error al actualizar los datos. Por favor intente nuevamente.';
        this.loading = false;
      }
    });
  }

  backToIdentificator(): void {
    this.step = 'identificator';
    this.error = null;
  }
}