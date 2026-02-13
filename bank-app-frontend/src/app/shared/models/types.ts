export type Role = 'MANAGER' | 'CLERK';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: Role;
}

export interface Account {
  accountNumber: string;
  name: string;
  balance: number;
}

export interface AccountRequest {
  name: string;
  balance: number;
}

export interface ClerkUserResponse {
  username: string;
  role: Role;
  isActive?: boolean;
  active?: boolean;
}

export interface ClerkUser {
  username: string;
  role: Role;
  active: boolean;
}

export interface CreateClerkRequest {
  username: string;
  password: string;
}

export interface Transaction {
  transactionId: string;
  accountNumber: string;
  transactionType: string;
  amount: number;
  createdAt: string;
  status: string;
  performedBy: string;
  approvedBy: string | null;
}

export interface TransactionRequest {
  accountNumber: string;
  amount: number;
}
