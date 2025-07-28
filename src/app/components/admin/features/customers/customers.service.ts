import { Injectable } from '@angular/core';
import { Customer } from '../../../../shared/customer.model';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
 private apiUrl = 'https://tu-api.com/customers';

  constructor(private http: HttpClient) { }

   getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl);
  }

  addCustomer(customer: Customer): Observable<void> {
    return this.http.post<void>(this.apiUrl, customer);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
