import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { PoliciesmanagementComponent } from './components/admin/features/policies/policiesmanagement.component';
export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: 'customers',
        loadComponent: () => import('./components/admin/features/customers/customers.component').then(m => m.CustomersComponent)
      },
       {
        path: 'policies',
        loadComponent: () => import('./components/admin/features/policies/policiesmanagement.component').then(m => m.PoliciesmanagementComponent)
      }
    ]
  },
  { 
    path: 'client', 
    loadComponent: () => import('./components/clients/client.component').then(m => m.ClientComponent) 
  },
  { 
    path: '**', 
    redirectTo: 'login'  // Manejo de rutas no encontradas
  }
];
