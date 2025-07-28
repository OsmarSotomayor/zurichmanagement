import { Injectable } from '@angular/core';
import { Customer } from '../../../../shared/customer.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private baseUrl = 'https://zurichpolicyservice-aqdyh7fhhkhfhreq.centralus-01.azurewebsites.net/api/clientes';

  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Customer[]> {
  return this.http.get<any[]>(this.baseUrl).pipe(
    map(apiCustomers => apiCustomers.map(c => ({
      identificationNumber: c.identificationNumber,
      fullName: c.fullName,
      email: c.email,
      phoneNumber: c.phoneNumber
    })))
  );
}
  addCustomer(customer: Customer): Observable<any> {
    return this.http.post(this.baseUrl, {
      fullName: customer.fullName,
      email: customer.email,
      phoneNumber: customer.phoneNumber,
      addres: customer.address || 'string' // Asignamos 'string' si address es undefined
    });
  }

  updateCustomer(id: string, customer: Customer): Observable<any> {
  return this.http.put(`${this.baseUrl}/${id}`, {
    fullName: customer.fullName,  
    email: customer.email,
    phoneNumber: customer.phoneNumber,  
    addres: customer.address || 'string'
  });
}

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}