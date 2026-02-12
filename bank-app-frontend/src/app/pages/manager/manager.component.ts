import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { HeaderComponent } from '../../layout/header.component';
import { BankApiService } from '../../core/bank-api.service';
import { Account, ClerkUser, Transaction } from '../../shared/models/types';
import { toUserMessage } from '../../shared/utils/error-message';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss'
})
export class ManagerComponent implements OnInit {
  accounts: Account[] = [];
  clerks: ClerkUser[] = [];
  pendingTransactions: Transaction[] = [];
  history: Transaction[] = [];
  error = '';
  success = '';
  loading = false;

  readonly accountForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    balance: [0, [Validators.required, Validators.min(0)]]
  });

  readonly clerkForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  readonly historyForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private api: BankApiService) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.loading = true;
    this.error = '';

    forkJoin({
      accounts: this.api.getAccounts(),
      clerks: this.api.getClerks(),
      pendingTransactions: this.api.getPendingTransactions()
    }).subscribe({
      next: (response) => {
        this.accounts = response.accounts;
        this.clerks = response.clerks;
        this.pendingTransactions = response.pendingTransactions;
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to load dashboard data.');
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  createAccount(): void {
    if (this.accountForm.invalid) {
      this.accountForm.markAllAsTouched();
      return;
    }

    this.api.createAccount(this.accountForm.getRawValue()).subscribe({
      next: () => {
        this.success = 'Account created successfully.';
        this.error = '';
        this.accountForm.reset({ name: '', balance: 0 });
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to create account.');
      }
    });
  }

  createClerk(): void {
    if (this.clerkForm.invalid) {
      this.clerkForm.markAllAsTouched();
      return;
    }

    this.api.createClerk(this.clerkForm.getRawValue()).subscribe({
      next: () => {
        this.success = 'Clerk created successfully.';
        this.error = '';
        this.clerkForm.reset({ username: '', password: '' });
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to create clerk.');
      }
    });
  }

  disableClerk(username: string): void {
    this.api.disableClerk(username).subscribe({
      next: () => {
        this.success = 'Clerk disabled successfully.';
        this.error = '';
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to disable clerk.');
      }
    });
  }

  approve(transactionId: string): void {
    this.api.approveWithdrawal(transactionId).subscribe({
      next: () => {
        this.success = 'Withdrawal approved.';
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to approve withdrawal.');
      }
    });
  }

  reject(transactionId: string): void {
    this.api.rejectWithdrawal(transactionId).subscribe({
      next: () => {
        this.success = 'Withdrawal rejected.';
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to reject withdrawal.');
      }
    });
  }

  loadHistory(): void {
    if (this.historyForm.invalid) {
      this.historyForm.markAllAsTouched();
      return;
    }

    this.api.getTransactionsByAccount(this.historyForm.getRawValue().accountNumber).subscribe({
      next: (transactions) => {
        this.history = transactions;
        this.error = '';
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to fetch transaction history.');
      }
    });
  }
}
