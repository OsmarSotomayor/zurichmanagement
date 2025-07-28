import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Policy, PolicyType, PolicyFilter, CreatePolicyDto } from '../../shared/policy.model';

@Injectable({
  providedIn: 'root'
})
export class ClientapiService {
  private baseUrl = 'https://zurichpolicyservice-aqdyh7fhhkhfhreq.centralus-01.azurewebsites.net/api';
  constructor(private http: HttpClient) { }
// Obtener todas las pólizas de un cliente
  getClientPolicies(clientIdentificator: number): Observable<Policy[]> {
    const url = `${this.baseUrl}/policy/identificador-cliente/${clientIdentificator}`;
    return this.http.get<Policy[]>(url);
  }

  // Filtrar pólizas
  filterPolicies(clientIdentificator: number, filter: PolicyFilter): Observable<Policy[]> {
    const url = `${this.baseUrl}/policy/identificador-cliente/${clientIdentificator}`;
    return this.http.get<Policy[]>(url, { params: this.createFilterParams(filter) });
  }

  // Solicitar cancelación de póliza
  requestPolicyCancellation(policyId: string): Observable<any> {
    const url = `${this.baseUrl}/policy/${policyId.toUpperCase()}/cancelar`;
    return this.http.patch(url, {});
  }

  // Actualizar datos del cliente
  updateClientData(clientIdentificator: number, data: { addres: string, phoneNumber: string }): Observable<any> {
    const url = `${this.baseUrl}/clientes/${clientIdentificator}/actualizar-datos`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.patch(url, data, { headers });
  }

  // Método privado para crear parámetros de filtro
  private createFilterParams(filter: PolicyFilter): { [param: string]: string } {
    const params: { [param: string]: string } = {};

    if (filter.type) params['type'] = filter.type.toString();
    if (filter.state) params['state'] = filter.state.toString();
    if (filter.startDateFrom) params['startDateFrom'] = new Date(filter.startDateFrom).toISOString();
    if (filter.expirationDateFrom) params['expirationDateFrom'] = new Date(filter.expirationDateFrom).toISOString();

    return params;
  }

}
