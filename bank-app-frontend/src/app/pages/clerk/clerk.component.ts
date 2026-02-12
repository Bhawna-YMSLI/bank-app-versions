import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HeaderComponent } from '../../layout/header.component';
import { BankApiService } from '../../core/bank-api.service';
import { Transaction } from '../../shared/models/types';
import { toUserMessage } from '../../shared/utils/error-message';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent],
  templateUrl: './clerk.component.html',
  styleUrl: './clerk.component.scss'
})
export class ClerkComponent {
  history: Transaction[] = [];
  error = '';
  success = '';

  readonly txnForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required],
    amount: [0.01, [Validators.required, Validators.min(0.01)]]
  });

  readonly historyForm = this.fb.nonNullable.group({
    accountNumber: ['', Validators.required]
  });

  constructor(private fb: FormBuilder, private api: BankApiService) {}

  deposit(): void {
    if (this.txnForm.invalid) {
      this.txnForm.markAllAsTouched();
      return;
    }

    this.api.deposit(this.txnForm.getRawValue()).subscribe({
      next: () => {
        this.success = 'Deposit completed successfully.';
        this.error = '';
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
