export interface Customer {
  id?: string;        // Número de identificación (10 dígitos)
  name: string;       // Se mapea a fullName en la API
  email: string;      // Igual
  phone: string;      // Se mapea a phoneNumber
  address?: string;   // Se mapea a addres (opcional)
}