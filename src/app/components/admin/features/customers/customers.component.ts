import { Component, OnInit } from '@angular/core';
import { Customer } from '../../../../shared/customer.model';
import { CustomersService } from './customers.service';
import { Observable, of, catchError, finalize } from 'rxjs';

@Component({
  selector: 'app-customers',
  standalone: true,
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: Customer[] = [];
  loading = false;
  error: string | null = null;

  constructor(private customersService: CustomersService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.loading = true;
    this.error = null;
    
    this.customersService.getCustomers().pipe(
      catchError(error => {
        this.error = 'Error al cargar clientes';
        console.error('Error loading customers:', error);
        return of([]); // Retorna un array vacío para que la interfaz no se rompa
      }),
      finalize(() => this.loading = false)
    ).subscribe(customers => {
      this.customers = customers;
    });
  }

  deleteCustomer(id: string) {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      this.loading = true;
      
      this.customersService.deleteCustomer(id).pipe(
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
}