import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ClientapiService } from '../../clientapi.service';
import { Policy, PolicyType, PolicyState } from '../../../../shared/policy.model';

@Component({
  selector: 'app-policies-list',
  standalone:true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './policies-list.component.html',
  styleUrl: './policies-list.component.css'
})
export class PoliciesListComponent {
policies: Policy[] = [];
  filteredPolicies: Policy[] = [];
  loading = false;
  error: string | null = null;
  activeTab: 'active' | 'cancelled' = 'active';
  
  cancellingPolicyId: string | null = null;
  cancellationError: string | null = null;
  cancellationSuccess = false;

  // Campo para el identificador del cliente
  clientIdentificator: string = '';
  
  // Filtros
  policyTypes = Object.values(PolicyType);
  selectedType: PolicyType | '' = '';
  showFilters = false;
  submitted = false;

  constructor(private policyService: ClientapiService) {}

  loadPolicies(): void {
    if (!this.clientIdentificator) {
      this.error = 'Por favor ingrese su identificador de cliente';
      return;
    }

    const identificator = Number(this.clientIdentificator);
    if (isNaN(identificator)) {
      this.error = 'El identificador debe ser un número válido';
      return;
    }

    this.loading = true;
    this.error = null;
    this.submitted = true;

    this.policyService.getClientPolicies(identificator).subscribe({
      next: (policies) => {
        this.policies = policies;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las pólizas. Verifique su identificador e intente nuevamente.';
        this.loading = false;
        console.error('Error loading policies:', err);
      }
    });
  }

  applyFilters(): void {
    let result = this.policies;
    
    // Filtro por estado
    result = result.filter(policy => 
      this.activeTab === 'active' 
        ? policy.state === PolicyState.Active 
        : policy.state === PolicyState.Cancelled
    );
    
    // Filtro por tipo
    if (this.selectedType) {
      result = result.filter(policy => policy.type === this.selectedType);
    }
    
    this.filteredPolicies = result;
  }

  setActiveTab(tab: 'active' | 'cancelled'): void {
    this.activeTab = tab;
    this.applyFilters();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) {
      this.selectedType = '';
      this.applyFilters();
    }
  }

  resetForm(): void {
    this.submitted = false;
    this.policies = [];
    this.clientIdentificator = '';
  }

  //cancelar poliza 
    requestCancellation(policyId: string): void {
    if (!this.clientIdentificator) {
      this.error = 'Identificador de cliente no disponible';
      return;
    }

    this.cancellingPolicyId = policyId;
    this.cancellationError = null;
    this.cancellationSuccess = false;

    this.policyService.requestPolicyCancellation(policyId).subscribe({
      next: () => {
        // Actualizamos el estado de la póliza localmente
        const policy = this.policies.find(p => p.id === policyId);
        if (policy) {
          policy.state = PolicyState.Cancelled;
          this.applyFilters(); // Re-filtramos para actualizar la vista
        }
        this.cancellationSuccess = true;
        this.cancellingPolicyId = null;
        
        // Ocultamos el mensaje de éxito después de 3 segundos
        setTimeout(() => this.cancellationSuccess = false, 3000);
      },
      error: (err) => {
        this.cancellationError = 'Error al cancelar la póliza. Por favor intente nuevamente.';
        this.cancellingPolicyId = null;
        console.error('Error cancelling policy:', err);
      }
    });
  }
}
