export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  phone?: string;
  address?: string;
}

///Respuesta Backend al LOGIN
export interface LoginResponse {
  access_token: string;
  user: User;
}

/// Tipado de entrada de datos con POST REGISTER
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}
