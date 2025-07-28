import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    console.log(`[Interceptor] Petición a: ${request.url}`);
    console.log(`[Interceptor] Token disponible: ${!!token}`);

    if (token) {
      console.log('[Interceptor] Añadiendo token JWT a los headers');
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq).pipe(
        tap({
          next: (event) => console.log('[Interceptor] Petición exitosa'),
          error: (err) => console.error('[Interceptor] Error en petición:', err)
        })
      );
    }

    return next.handle(request);
  }
}