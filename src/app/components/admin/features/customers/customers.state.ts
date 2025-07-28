// src/app/components/admin/features/customers/customers.state.ts
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CustomersService } from './customers.service';
import { Customer } from '../../../../shared/customer.model';
import { tap } from 'rxjs/operators';

// Acciones (mejor en archivo aparte customers.actions.ts)
export class LoadCustomers {
  static readonly type = '[Admin] Load Customers';
}

export class AddCustomer {
  static readonly type = '[Admin] Add Customer';
  constructor(public payload: Customer) {}
}

export class UpdateCustomer {
  static readonly type = '[Admin] Update Customer';
  constructor(public payload: Customer) {}
}

export class DeleteCustomer {
  static readonly type = '[Admin] Delete Customer';
  constructor(public id: string) {}
}

// Modelo del estado
interface CustomersStateModel {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

// Estado NGXS (¡Decorador @State correcto!)
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

  // Selectores
  @Selector()
  static customers(state: CustomersStateModel): Customer[] {
    return state.customers;
  }

  @Selector()
  static loading(state: CustomersStateModel): boolean {
    return state.loading;
  }

  // Acciones
  @Action(LoadCustomers)
  loadCustomers(ctx: StateContext<CustomersStateModel>) {
    ctx.patchState({ loading: true });
    return this.customersService.getCustomers().pipe(
      tap({
        next: (customers) => ctx.patchState({ customers, loading: false }),
        error: (err) => ctx.patchState({ error: err.message, loading: false })
      })
    );
  }

  @Action(AddCustomer)
  addCustomer(ctx: StateContext<CustomersStateModel>, action: AddCustomer) {
    ctx.patchState({ loading: true });
    return this.customersService.addCustomer(action.payload).pipe(
      tap({
        next: () => ctx.dispatch(new LoadCustomers()), // Recarga la lista
        error: (err) => ctx.patchState({ error: err.message, loading: false })
      })
    );
  }
}