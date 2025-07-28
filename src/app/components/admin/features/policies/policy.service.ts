// src/app/components/admin/features/policies/policy.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Policy, PolicyFilter, CreatePolicyDto, PolicyType, PolicyState} from '../../../../shared/policy.model';
import { Customer } from '../../../../shared/customer.model';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  private baseUrl = 'https://zurichpolicyservice-aqdyh7fhhkhfhreq.centralus-01.azurewebsites.net/api/policy';
  private baseUrlClients = 'https://zurichpolicyservice-aqdyh7fhhkhfhreq.centralus-01.azurewebsites.net/api/clientes/filter';

  constructor(private http: HttpClient) { }

//filter de policy
filterPolicies(filter: PolicyFilter): Observable<Policy[]> {
  let params = new HttpParams();

  // Construcción segura de parámetros
  if (filter.type) params = params.append('type', filter.type);
  if (filter.state) params = params.append('state', filter.state);
  if (filter.startDateFrom) {
    params = params.append('startDateFrom', 
      typeof filter.startDateFrom === 'string' ? 
      filter.startDateFrom : 
      filter.startDateFrom.toISOString());
  }
  if (filter.startDateTo) {
    params = params.append('startDateTo', 
      typeof filter.startDateTo === 'string' ? 
      filter.startDateTo : 
      filter.startDateTo.toISOString());
  }
  if (filter.expirationDateFrom) {
    params = params.append('expirationDateFrom', 
      typeof filter.expirationDateFrom === 'string' ? 
      filter.expirationDateFrom : 
      filter.expirationDateFrom.toISOString());
  }
  if (filter.expirationDateTo) {
    params = params.append('expirationDateTo', 
      typeof filter.expirationDateTo === 'string' ? 
      filter.expirationDateTo : 
      filter.expirationDateTo.toISOString());
  }


  return this.http.get<any[]>(`${this.baseUrl}/filter`, { params }).pipe(
    map((policies: any[]) => policies.map(policy => ({
      id: policy.id,
      type: policy.type as PolicyType,
      startDate: new Date(policy.startDate),
      expirationDate: new Date(policy.expirationDate),
      amount: parseFloat(policy.amount),
      state: policy.state as PolicyState,
      clientIdentificator: policy.clientIdentificator || policy.clientId,
      clientName: policy.clientName || ''
    }))),
    catchError(error => {
      console.error('Error filtering policies:', error);
      return of([]);
    })
  );
}

  createPolicy(policy: CreatePolicyDto): Observable<Policy> {
    return this.http.post<Policy>(this.baseUrl, policy);
  }

  
  // Método para filtrar clientes
  filterCustomers(name?: string, email?: string, identificador?: number): Observable<Customer[]> {
    let params = new HttpParams();

    // Agregar parámetros solo si tienen valor
    if (name) params = params.append('name', name);
    if (email) params = params.append('email', email);
    if (identificador) params = params.append('identificador', identificador.toString());

    return this.http.get<any[]>(this.baseUrlClients, { params }).pipe(
      map(apiCustomers => apiCustomers.map(c => this.mapCustomer(c))),
      catchError(error => {
        console.error('Error filtering customers:', error);
        return of([]); // Retorna array vacío en caso de error
      })
    );
  }

  private mapCustomer(apiCustomer: any): Customer {
    return {
      identificationNumber: apiCustomer.identificationNumber?.toString() || '',
      fullName: apiCustomer.fullName || '',
      email: apiCustomer.email || '',
      phoneNumber: apiCustomer.phoneNumber?.toString() || '',
      address: apiCustomer.address
    };
  }
}