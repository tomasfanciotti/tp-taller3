export interface User {
  id: string;
  email: string;
  name: string;
  telegramNumber?: number;
  isDoctor: boolean;
}

export interface Session {
  isLoggedIn: boolean;
}
