import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
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

  disableClerk(rawUsername: string) {
    const trimmed = rawUsername.trim();

    if (!trimmed) {
      return throwError(() => new Error('Username is required to disable clerk.'));
    }

    const username = encodeURIComponent(trimmed);

    const attempts: Array<() => Observable<void>> = [
      () => this.http.put<void>(`${this.baseUrl}/users/clerks/${username}/disable`, {}),
      () => this.http.patch<void>(`${this.baseUrl}/users/clerks/${username}/disable`, {}),
      () => this.http.post<void>(`${this.baseUrl}/users/clerks/${username}/disable`, {}),
      () => this.http.put<void>(`${this.baseUrl}/users/clerk/${username}/disable`, {}),
      () => this.http.patch<void>(`${this.baseUrl}/users/clerk/${username}/disable`, {}),
      () => this.http.post<void>(`${this.baseUrl}/users/clerk/${username}/disable`, {}),
      () => this.http.put<void>(`${this.baseUrl}/users/clerk/${username}/status`, { active: false }),
      () => this.http.patch<void>(`${this.baseUrl}/users/clerk/${username}/status`, { active: false }),
      () => this.http.put<void>(`${this.baseUrl}/users/clerks/${username}/status`, { active: false }),
      () => this.http.patch<void>(`${this.baseUrl}/users/clerks/${username}/status`, { active: false }),
      () => this.http.patch<void>(`${this.baseUrl}/users/clerks/${username}`, { active: false }),
      () => this.http.patch<void>(`${this.baseUrl}/users/clerks/${username}`, { isActive: false }),
      () => this.http.put<void>(`${this.baseUrl}/users/clerks/${username}`, { active: false }),
      () => this.http.put<void>(`${this.baseUrl}/users/clerks/${username}`, { isActive: false }),
      () => this.http.delete<void>(`${this.baseUrl}/users/clerks/${username}`)
    ];

    return this.tryDisableWithFallback(attempts, 0);
  }

  deposit(payload: TransactionRequest) {
    return this.http.put<void>(`${this.baseUrl}/transactions/deposit`, payload);
  }

  withdraw(payload: TransactionRequest) {
    return this.http.put<void>(`${this.baseUrl}/transactions/withdraw`, payload);
  }



  private tryDisableWithFallback(attempts: Array<() => Observable<void>>, index: number): Observable<void> {
    if (index >= attempts.length) {
      return throwError(() => new Error('No compatible disable clerk endpoint is available.'));
    }

    return attempts[index]().pipe(
      catchError((error) => {
        const status = (error as { status?: number })?.status;

        if (status === 401 || status === 403) {
          return throwError(() => error);
        }

        return this.tryDisableWithFallback(attempts, index + 1);
      })
    );
  }

  private toClerkUser(user: ClerkUserResponse): ClerkUser {
    const normalized = user as ClerkUserResponse;
    const normalizedStatus = normalized.status?.toLowerCase();

    const isActiveByStatus = normalizedStatus
      ? !['disabled', 'inactive', 'blocked'].includes(normalizedStatus)
      : undefined;

    const isActiveByDisabledFlag = normalized.disabled === undefined ? undefined : !normalized.disabled;

    return {
      username: user.username,
      role: user.role,
      active: normalized.active ?? normalized.isActive ?? normalized.enabled ?? isActiveByDisabledFlag ?? isActiveByStatus ?? false
    };
  }
}
