export interface Customer {
  identificationNumber: string;  // Cambia id por identificationNumber
  fullName: string;              // Cambia name por fullName
  email: string;
  phoneNumber: string;           // Cambia phone por phoneNumber
  address?: string;  // Se mapea a addres (opcional)
}