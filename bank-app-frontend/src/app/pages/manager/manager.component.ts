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
  selectedAccount: Account | null = null;
  selectedTransaction: Transaction | null = null;
  error = '';
  success = '';
  loading = false;

  get activeClerksCount(): number {
    return this.clerks.filter((clerk) => clerk.active).length;
  }

  readonly accountForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    balance: [0, [Validators.required, Validators.min(0)]]
  });

  readonly accountSearchForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required]
  });

  readonly accountUpdateForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required],
    name: ['', [Validators.required, Validators.minLength(2)]],
    balance: [0, [Validators.required, Validators.min(0)]]
  });

  readonly accountDeleteForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required]
  });

  readonly clerkForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  readonly historyForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required]
  });

  readonly transactionLookupForm = this.fb.nonNullable.group({
    transactionId: ['', Validators.required]
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

  searchAccount(): void {
    if (this.accountSearchForm.invalid) {
      this.accountSearchForm.markAllAsTouched();
      return;
    }

    const { accountNumber } = this.accountSearchForm.getRawValue();
    this.api.getAccountByNumber(accountNumber).subscribe({
      next: (account) => {
        this.selectedAccount = account;
        this.success = `Account ${account.accountNumber} loaded.`;
        this.error = '';
      },
      error: (error: unknown) => {
        this.selectedAccount = null;
        this.error = toUserMessage(error, 'Unable to load account details.');
      }
    });
  }

  updateAccount(): void {
    if (this.accountUpdateForm.invalid) {
      this.accountUpdateForm.markAllAsTouched();
      return;
    }

    const { accountNumber, name, balance } = this.accountUpdateForm.getRawValue();
    this.api.updateAccount(accountNumber, { name, balance }).subscribe({
      next: () => {
        this.success = 'Account updated successfully.';
        this.error = '';
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to update account.');
      }
    });
  }

  deleteAccount(): void {
    if (this.accountDeleteForm.invalid) {
      this.accountDeleteForm.markAllAsTouched();
      return;
    }

    const { accountNumber } = this.accountDeleteForm.getRawValue();
    this.api.deleteAccount(accountNumber).subscribe({
      next: () => {
        this.success = `Account ${accountNumber} deleted successfully.`;
        this.error = '';
        this.accountDeleteForm.reset({ accountNumber: '' });
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to delete account.');
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
        this.error = '';
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
        this.error = '';
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to reject withdrawal.');
      }
    });
  }

  lookupTransactionById(): void {
    if (this.transactionLookupForm.invalid) {
      this.transactionLookupForm.markAllAsTouched();
      return;
    }

    const { transactionId } = this.transactionLookupForm.getRawValue();
    this.api.getTransactionById(transactionId).subscribe({
      next: (transaction) => {
        this.selectedTransaction = transaction;
        this.success = `Transaction ${transactionId} loaded.`;
        this.error = '';
      },
      error: (error: unknown) => {
        this.selectedTransaction = null;
        this.error = toUserMessage(error, 'Unable to load transaction details.');
      }
    });
  }

  loadHistory(): void {
    if (this.historyForm.invalid) {
      this.historyForm.markAllAsTouched();
      return;
    }

    const { accountNumber } = this.historyForm.getRawValue();
    this.api.getTransactionsByAccount(accountNumber).subscribe({
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
