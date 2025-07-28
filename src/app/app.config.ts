import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CustomersState } from './components/admin/features/customers/customers.state';

export const appConfig: ApplicationConfig = {
  providers: [
    // Configuración básica de Angular
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Router
    provideRouter(routes),
    
    // HttpClient configurado para usar interceptores DI
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    
    // Registro del interceptor como provider tradicional
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Importante para múltiples interceptores
    },
    
  ]
};