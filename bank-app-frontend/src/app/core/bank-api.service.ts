import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  Account,
  AccountRequest,
  ClerkUser,
  ClerkUserResponse,
  CreateClerkRequest,
  Transaction,
  TransactionRequest
} from '../shared/models/types';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BankApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  getAccounts() {
    return this.http.get<Account[]>(`${this.baseUrl}/accounts`);
  }

  getAccountByNumber(accountNumber: string) {
    return this.http.get<Account>(`${this.baseUrl}/accounts/${accountNumber}`);
  }

  createAccount(payload: AccountRequest) {
    return this.http.post<Account>(`${this.baseUrl}/accounts`, payload);
  }

  updateAccount(accountNumber: string, payload: AccountRequest) {
    return this.http.put<Account>(`${this.baseUrl}/accounts/${accountNumber}`, payload);
  }

  deleteAccount(accountNumber: string) {
    return this.http.delete<void>(`${this.baseUrl}/accounts/${accountNumber}`);
  }

  getPendingTransactions() {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions/pending`);
  }

  getTransactionById(transactionId: string) {
    return this.http.get<Transaction>(`${this.baseUrl}/transactions/${transactionId}`);
  }

  approveWithdrawal(transactionId: string) {
    return this.http.put<void>(`${this.baseUrl}/transactions/${transactionId}/approve`, {});
  }

  rejectWithdrawal(transactionId: string) {
    return this.http.put<void>(`${this.baseUrl}/transactions/${transactionId}/reject`, {});
  }

  getTransactionsByAccount(accountNumber: string) {
    return this.http.get<Transaction[]>(`${this.baseUrl}/transactions/account/${accountNumber}/history`);
  }

  createClerk(payload: CreateClerkRequest) {
    return this.http.post<ClerkUserResponse>(`${this.baseUrl}/users/clerk`, payload).pipe(
      map((user) => this.toClerkUser(user))
    );
  }

  getClerks() {
    return this.http.get<ClerkUserResponse[]>(`${this.baseUrl}/users/clerks`).pipe(
      map((users) => users.map((user) => this.toClerkUser(user)))
    );
  }

  disableClerk(username: string) {
    return this.http.put<void>(`${this.baseUrl}/users/clerks/${username}/disable`, {});
  }

  deposit(payload: TransactionRequest) {
    return this.http.put<void>(`${this.baseUrl}/transactions/deposit`, payload);
  }

  withdraw(payload: TransactionRequest) {
    return this.http.put<void>(`${this.baseUrl}/transactions/withdraw`, payload);
  }

  private toClerkUser(user: ClerkUserResponse): ClerkUser {
    const normalized = user as ClerkUserResponse & { active?: boolean };

    return {
      username: user.username,
      role: user.role,
      active: normalized.active ?? user.isActive ?? false
    };
  }
}
