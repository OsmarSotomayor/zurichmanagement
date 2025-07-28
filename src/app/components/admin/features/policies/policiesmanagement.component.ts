import { Component, OnInit } from '@angular/core';
import { PolicyService } from './policy.service';
import { Policy, PolicyFilter, PolicyState, PolicyType, CreatePolicyDto } from '../../../../shared/policy.model';
import { Customer } from '../../../../shared/customer.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-policiesmanagement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './policiesmanagement.component.html',
  styleUrl: './policiesmanagement.component.css'
})
export class PoliciesmanagementComponent implements OnInit {
  policies: Policy[] = [];
  customers: Customer[] = [];
  filter: PolicyFilter = {};
  newPolicy: CreatePolicyDto = {
    type: PolicyType.Auto,
    startDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    amount: 0,
    state: PolicyState.Active,
    clientIdentificator: 0
  };
  customerSearch = {
    name: '',
    email: '',
    identificador: ''
  };

  policyTypes: PolicyType[] = [PolicyType.Life, PolicyType.Auto, PolicyType.Health, PolicyType.Home];
  policyStates: PolicyState[] = [PolicyState.Active, PolicyState.Cancelled];

  showCreateForm = false;
  isLoading = false;
  errorMessage = '';

  constructor(private policyService: PolicyService) {}

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.isLoading = true;
    this.policyService.filterPolicies(this.filter).subscribe({
      next: (policies) => {
        this.policies = policies;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar las pólizas';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  //crear la poliza
  createPolicy(): void {
    if (!this.newPolicy.clientIdentificator) {
      this.errorMessage = 'Debe seleccionar un cliente';
      return;
    }

    this.isLoading = true;
    this.policyService.createPolicy(this.newPolicy).subscribe({
      next: (createdPolicy) => {
        this.policies = [...this.policies, createdPolicy];
        this.resetNewPolicyForm();
        this.showCreateForm = false;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al crear la póliza';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  selectCustomer(customer: Customer): void {
    this.newPolicy.clientIdentificator = Number(customer.identificationNumber);
    this.customerSearch.name = customer.fullName;
    this.customers = [];
  }

  resetNewPolicyForm(): void {
    this.newPolicy = {
      type: PolicyType.Auto,
      startDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      amount: 0,
      state: PolicyState.Active,
      clientIdentificator: 0
    };
    this.customerSearch = {
      name: '',
      email: '',
      identificador: ''
    };
    this.customers = [];
  }

  onFilterChange(): void {
    this.loadPolicies();
  }

  resetFilter(): void {
    this.filter = {};
    this.loadPolicies();
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.resetNewPolicyForm();
    }
  }


  //filtro de clientes
  searchCustomers(): void {
  this.isLoading = true;
  this.errorMessage = '';
  
  // Convertir el identificador a número solo si tiene valor
  const identificador = this.customerSearch.identificador ? 
                       Number(this.customerSearch.identificador) : 
                       undefined;

  this.policyService.filterCustomers(
    this.customerSearch.name || undefined,
    this.customerSearch.email || undefined,
    identificador
  ).subscribe({
    next: (customers) => {
      this.customers = customers;
      if (customers.length === 0) {
        this.errorMessage = 'No se encontraron clientes con los criterios de búsqueda';
      }
      this.isLoading = false;
    },
    error: (error) => {
      this.errorMessage = 'Error al buscar clientes. Por favor intente nuevamente.';
      this.isLoading = false;
      console.error('Error searching customers:', error);
    }
  });
}

showCustomerSearch = false;

toggleCustomerSearch(): void {
  this.showCustomerSearch = !this.showCustomerSearch;
  if (!this.showCustomerSearch) {
    this.clearCustomerSearch();
  }
}


// Método para limpiar la búsqueda de clientes
clearCustomerSearch(): void {
  this.customerSearch = { name: '', email: '', identificador: '' };
  this.customers = [];
  this.newPolicy.clientIdentificator = 0;
}


}
