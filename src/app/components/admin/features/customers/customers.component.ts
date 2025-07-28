import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../../shared/customer.model';
import { CustomersService } from './customers.service';
import { Observable, of, catchError, finalize, map } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  error: string | null = null;

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
          this.loadCustomers(); // Recargar la lista después de eliminar
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
      // address: customer.address // Descomenta si necesitas este campo
    }));
  }
}