import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../layout/header.component';
import { BankApiService } from '../../core/bank-api.service';
import { Account, Transaction } from '../../shared/models/types';
import { toUserMessage } from '../../shared/utils/error-message';

type ClerkSection = 'cash' | 'accountLookup' | 'transactionLookup' | 'history' | 'accounts';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './clerk.component.html',
  styleUrl: './clerk.component.scss'
})
export class ClerkComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  accounts: Account[] = [];
  history: Transaction[] = [];
  selectedAccount: Account | null = null;
  selectedTransaction: Transaction | null = null;
  error = '';
  success = '';
  activeSection: ClerkSection = 'cash';

  private setError(error: unknown, fallback: string): void {
    this.error = toUserMessage(error, fallback);
    this.success = '';
  }

  private setSuccess(message: string): void {
    this.success = message;
    this.error = '';
  }

  setSection(section: ClerkSection): void {
    this.activeSection = section;
  }

  private setError(error: unknown, fallback: string): void {
    this.error = toUserMessage(error, fallback);
    this.success = '';
  }

  private setSuccess(message: string): void {
    this.success = message;
    this.error = '';
  }

  readonly depositForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required],
    amount: [0.01, [Validators.required, Validators.min(0.01)]]
  });

  readonly withdrawForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required],
    amount: [0.01, [Validators.required, Validators.min(0.01)]]
  });

  readonly historyForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required]
  });

  readonly accountLookupForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required]
  });

  readonly transactionLookupForm = this.fb.nonNullable.group({
    transactionId: ['', Validators.required]
  });

  constructor(private api: BankApiService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.api.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error: unknown) => {
        this.setError(error, 'Unable to load accounts list.');
      }
    });
  }

  lookupAccount(): void {
    if (this.accountLookupForm.invalid) {
      this.accountLookupForm.markAllAsTouched();
      return;
    }

    const { accountNumber } = this.accountLookupForm.getRawValue();
    this.api.getAccountByNumber(accountNumber).subscribe({
      next: (account) => {
        this.selectedAccount = account;
        this.success = '';
      },
      error: (error: unknown) => {
        this.selectedAccount = null;
        this.setError(error, 'Unable to load account details.');
      }
    });
  }

  deposit(): void {
    if (this.depositForm.invalid) {
      this.depositForm.markAllAsTouched();
      return;
    }

    this.api.deposit(this.depositForm.getRawValue()).subscribe({
      next: () => {
        this.setSuccess('Deposit completed successfully.');
        this.loadAccounts();
      },
      error: (error: unknown) => {
        this.setError(error, 'Deposit failed. Check details and try again.');
      }
    });
  }

  withdraw(): void {
    if (this.withdrawForm.invalid) {
      this.withdrawForm.markAllAsTouched();
      return;
    }

    this.api.withdraw(this.withdrawForm.getRawValue()).subscribe({
      next: () => {
        this.setSuccess('Withdrawal request submitted. Approval may be required.');
      },
      error: (error: unknown) => {
        this.setError(error, 'Withdrawal failed. Please verify balance and account.');
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
        this.success = '';
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

    this.api.getTransactionsByAccount(this.historyForm.getRawValue().accountNumber).subscribe({
      next: (transactions) => {
        this.history = transactions;
        this.success = '';
      },
      error: (error: unknown) => {
        this.setError(error, 'Unable to fetch transaction history.');
      }
    });
  }
}
