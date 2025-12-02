export interface User {
  id: string; 
  name: string; 
  email: string; 
  role: 'admin' | 'client'; 
  phone?: string;
  address?: string;
}

///Respuesta Backend
export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}


/// Tipado de entrada de datos con POST register
export interface RegisterData extends LoginData {
  name: string;
  phone?: string;
}