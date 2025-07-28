import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../../shared/customer.model';
import { CustomersService } from './customers.service';
import { Observable, of, catchError, finalize, map } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})

export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  error: string | null = null;
  router: any;
  editingCustomer: Customer | null = null;
  newCustomer: Customer | null = null;

  constructor(private customersService: CustomersService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.error = null;
    
    this.customersService.getCustomers().pipe(
      map(apiCustomers => this.mapApiCustomers(apiCustomers)),
      catchError(error => {
        this.error = 'Error al cargar clientes';
        console.error('Error loading customers:', error);
        return of([]);
      }),
      finalize(() => this.loading = false)
    ).subscribe(customers => {
      this.customers = customers;
    });
  }

  deleteCustomer(identificationNumber: string): void {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.loading = true;
      
      this.customersService.deleteCustomer(identificationNumber).pipe(
        catchError(error => {
          this.error = 'Error al eliminar cliente';
          console.error('Error deleting customer:', error);
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
          this.loadCustomers(); 
        })
      ).subscribe();
    }
  }

  private mapApiCustomers(apiCustomers: any[]): Customer[] {
    return apiCustomers.map(customer => ({
      identificationNumber: customer.identificationNumber,
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
    }));
  }
  
   startEdit(customer: Customer): void {
    this.editingCustomer = { ...customer }; 
  }

   saveEdit(): void {
    if (this.editingCustomer) {
      this.loading = true;
      this.customersService.updateCustomer(
        this.editingCustomer.identificationNumber, 
        this.editingCustomer
      ).pipe(
        catchError(error => {
          this.error = 'Error al actualizar cliente';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
          this.editingCustomer = null;
          this.loadCustomers(); 
        })
      ).subscribe();
    }
  }

   cancelEdit(): void {
    this.editingCustomer = null;
  }

  //agregar nuevo cliente 

   startAdd(): void {
    this.newCustomer = {
      identificationNumber: '',
      fullName: '',
      email: '',
      phoneNumber: '',
      address: ''
    };
  }

  saveNew(): void {
    if (this.newCustomer) {
      this.loading = true;
      this.customersService.addCustomer(this.newCustomer).pipe(
        catchError(error => {
          this.error = 'Error al crear cliente';
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
          this.newCustomer = null;
          this.loadCustomers(); 
        })
      ).subscribe();
    }
  }

  cancelAdd(): void {
    this.newCustomer = null;
  }
  
}