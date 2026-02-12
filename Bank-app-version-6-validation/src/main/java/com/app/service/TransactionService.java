package com.app.service;

import java.math.BigDecimal;
import java.util.List;

import com.app.dto.transaction.TransactionHistoryDto;

public interface TransactionService {

	public void deposit(String accountNumber, BigDecimal amount, String performedBy);

	public void withdraw(String accountNumber, BigDecimal amount, String performedBy);

	public List<TransactionHistoryDto> getAllTransactionsForAccount(String accountNumber);

	public TransactionHistoryDto getByTransactionId(String transactionId);

	public void approveTransaction(String transactionId, String approvedBy);

	public void rejectTransaction(String transactionId, String approvedBy);

	public List<TransactionHistoryDto> getAllPendingTransactions();

}
