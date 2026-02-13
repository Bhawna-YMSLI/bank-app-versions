import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../layout/header.component';
import { BankApiService } from '../../core/bank-api.service';
import { Account, Transaction } from '../../shared/models/types';
import { toUserMessage } from '../../shared/utils/error-message';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './clerk.component.html',
  styleUrl: './clerk.component.scss'
})
export class ClerkComponent implements OnInit {
  accounts: Account[] = [];
  history: Transaction[] = [];
  selectedAccount: Account | null = null;
  selectedTransaction: Transaction | null = null;
  error = '';
  success = '';

  readonly txnForm = this.fb.nonNullable.group({
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

  constructor(private fb: FormBuilder, private api: BankApiService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.api.getAccounts().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Unable to load accounts list.');
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
        this.error = '';
      },
      error: (error: unknown) => {
        this.selectedAccount = null;
        this.error = toUserMessage(error, 'Unable to load account details.');
      }
    });
  }

  deposit(): void {
    if (this.txnForm.invalid) {
      this.txnForm.markAllAsTouched();
      return;
    }

    this.api.deposit(this.txnForm.getRawValue()).subscribe({
      next: () => {
        this.success = 'Deposit completed successfully.';
        this.error = '';
        this.loadAccounts();
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Deposit failed. Check details and try again.');
      }
    });
  }

  withdraw(): void {
    if (this.txnForm.invalid) {
      this.txnForm.markAllAsTouched();
      return;
    }

    this.api.withdraw(this.txnForm.getRawValue()).subscribe({
      next: () => {
        this.success = 'Withdrawal request submitted. Approval may be required.';
        this.error = '';
      },
      error: (error: unknown) => {
        this.error = toUserMessage(error, 'Withdrawal failed. Please verify balance and account.');
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
