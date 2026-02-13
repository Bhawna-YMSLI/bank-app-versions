import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  private readonly fb = inject(FormBuilder);
  accounts: Account[] = [];
  clerks: ClerkUser[] = [];
  pendingTransactions: Transaction[] = [];
  history: Transaction[] = [];
  selectedAccount: Account | null = null;
  selectedTransaction: Transaction | null = null;
  error = '';
  success = '';
  loading = false;
  readonly disablingClerks = new Set<string>();

  private setError(error: unknown, fallback: string): void {
    this.error = toUserMessage(error, fallback);
    this.success = '';
  }

  private setSuccess(message: string): void {
    this.success = message;
    this.error = '';
  }

  private getClerkKey(username: string): string {
    return username.trim().toLowerCase();
  }

  isClerkBeingDisabled(username: string): boolean {
    return this.disablingClerks.has(this.getClerkKey(username));
  }

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

  constructor(private api: BankApiService) {}

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
        this.setError(error, 'Unable to load dashboard data.');
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
        this.setSuccess('Account created successfully.');
        this.accountForm.reset({ name: '', balance: 0 });
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.setError(error, 'Unable to create account.');
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
        this.setSuccess(`Account ${account.accountNumber} loaded.`);
      },
      error: (error: unknown) => {
        this.selectedAccount = null;
        this.setError(error, 'Unable to load account details.');
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
        this.setSuccess('Account updated successfully.');
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.setError(error, 'Unable to update account.');
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
        this.setSuccess(`Account ${accountNumber} deleted successfully.`);
        this.accountDeleteForm.reset({ accountNumber: '' });
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.setError(error, 'Unable to delete account.');
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
        this.setSuccess('Clerk created successfully.');
        this.clerkForm.reset({ username: '', password: '' });
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.setError(error, 'Unable to create clerk.');
      }
    });
  }

  disableClerk(username: string): void {
    const normalizedUsername = username.trim();
    const clerkKey = this.getClerkKey(normalizedUsername);

    if (!clerkKey || this.disablingClerks.has(clerkKey)) {
      return;
    }

    this.disablingClerks.add(clerkKey);

    this.api.disableClerk(normalizedUsername)
      .pipe(
        switchMap(() => {
          this.clerks = this.clerks.map((clerk) =>
            this.getClerkKey(clerk.username) === clerkKey ? { ...clerk, active: false } : clerk
          );
          return this.api.getClerks();
        }),
        finalize(() => this.disablingClerks.delete(clerkKey))
      )
      .subscribe({
        next: (clerks) => {
          const updatedClerk = clerks.find((clerk) => this.getClerkKey(clerk.username) === clerkKey);

          if (updatedClerk) {
            this.clerks = clerks.map((clerk) =>
              this.getClerkKey(clerk.username) === clerkKey ? { ...clerk, active: false } : clerk
            );
          }

          this.setSuccess(`Clerk ${normalizedUsername} disabled successfully.`);
        },
        error: (error: unknown) => {
          this.setError(error, 'Unable to disable clerk.');
        }
      });
  }

  approve(transactionId: string): void {
    this.api.approveWithdrawal(transactionId).subscribe({
      next: () => {
        this.setSuccess('Withdrawal approved.');
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.setError(error, 'Unable to approve withdrawal.');
      }
    });
  }

  reject(transactionId: string): void {
    this.api.rejectWithdrawal(transactionId).subscribe({
      next: () => {
        this.setSuccess('Withdrawal rejected.');
        this.refreshAll();
      },
      error: (error: unknown) => {
        this.setError(error, 'Unable to reject withdrawal.');
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
        this.setSuccess(`Transaction ${transactionId} loaded.`);
      },
      error: (error: unknown) => {
        this.selectedTransaction = null;
        this.setError(error, 'Unable to load transaction details.');
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
        this.setError(error, 'Unable to fetch transaction history.');
      }
    });
  }
}
