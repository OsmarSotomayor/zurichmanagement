export interface Policy {
  id: string;
  type: PolicyType;
  startDate: Date | string;
  expirationDate: Date | string;
  amount: number;
  state: PolicyState;
  clientIdentificator: number;
  clientName?: string; // Opcional para mostrar
}

export enum PolicyType {
  Auto = 'Automóvil',
  Life = 'Vida',
  Health = 'Salud',
  Home = 'Hogar'
}

export enum PolicyState {
  Active = 'Active',
  Cancelled = 'Cancelled'
}

// Para filtros
export interface PolicyFilter {
  type?: PolicyType;
  state?: PolicyState;
  startDateFrom?: Date | string;
  expirationDateFrom?: Date | string;
}

// Para creación
export interface CreatePolicyDto {
  type: PolicyType;
  startDate: Date | string;
  expirationDate: Date | string;
  amount: number;
  state: PolicyState;
  clientIdentificator: number;
}