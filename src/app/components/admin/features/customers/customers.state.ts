import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { Customer } from '../../../../shared/customer.model';
import { CustomersService } from './customers.service';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

// Acciones
export class LoadCustomers {
  static readonly type = '[Admin] Load Customers';
}

export class AddCustomer {
  static readonly type = '[Admin] Add Customer';
  constructor(public payload: Customer) {}
}

export class UpdateCustomer {
  static readonly type = '[Admin] Update Customer';
  constructor(public id: string, public payload: Customer) {}
}

export class DeleteCustomer {
  static readonly type = '[Admin] Delete Customer';
  constructor(public id: string) {} // ID = Número de identificación (10 dígitos)
}

// Modelo del estado
interface CustomersStateModel {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

@State<CustomersStateModel>({
  name: 'customers',
  defaults: {
    customers: [],
    loading: false,
    error: null
  }
})
@Injectable()
export class CustomersState {
  constructor(private customersService: CustomersService) {}

  // SELECTORS
  @Selector()
  static customers(state: CustomersStateModel): Customer[] {
    return state.customers;
  }

  @Selector()
  static loading(state: CustomersStateModel): boolean {
    return state.loading;
  }

  // ACTIONS
  @Action(LoadCustomers)
  loadCustomers(ctx: StateContext<CustomersStateModel>) {
    ctx.patchState({ loading: true, error: null });
    return this.customersService.getCustomers().pipe(
      tap(customers => {
        ctx.patchState({ customers, loading: false });
      }),
      catchError(error => {
        ctx.patchState({ error: 'Error al cargar clientes', loading: false });
        return of();
      })
    );
  }

  @Action(AddCustomer)
  addCustomer(ctx: StateContext<CustomersStateModel>, action: AddCustomer) {
    ctx.patchState({ loading: true });
    return this.customersService.addCustomer(action.payload).pipe(
      tap(() => {
        ctx.dispatch(new LoadCustomers()); // Recarga la lista después de añadir
      }),
      catchError(error => {
        ctx.patchState({ error: 'Error al agregar cliente', loading: false });
        return of();
      })
    );
  }

  @Action(UpdateCustomer)
  updateCustomer(ctx: StateContext<CustomersStateModel>, action: UpdateCustomer) {
    ctx.patchState({ loading: true });
    return this.customersService.updateCustomer(action.id, action.payload).pipe(
      tap(() => {
        ctx.dispatch(new LoadCustomers()); // Recarga la lista después de actualizar
      }),
      catchError(error => {
        ctx.patchState({ error: 'Error al actualizar cliente', loading: false });
        return of();
      })
    );
  }

  @Action(DeleteCustomer)
  deleteCustomer(ctx: StateContext<CustomersStateModel>, action: DeleteCustomer) {
    ctx.patchState({ loading: true });
    return this.customersService.deleteCustomer(action.id).pipe(
      tap(() => {
        ctx.dispatch(new LoadCustomers()); // Recarga la lista después de eliminar
      }),
      catchError(error => {
        ctx.patchState({ error: 'Error al eliminar cliente', loading: false });
        return of();
      })
    );
  }
}