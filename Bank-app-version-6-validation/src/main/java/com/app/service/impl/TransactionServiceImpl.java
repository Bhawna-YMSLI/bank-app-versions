package com.app.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.transaction.TransactionHistoryDto;
import com.app.entities.Account;
import com.app.entities.Transaction;
import com.app.enums.TransactionStatus;
import com.app.enums.TransactionType;
import com.app.exception.BankAccountNotFoundException;
import com.app.exception.InsufficientBalanceException;
import com.app.exception.InvalidTransactionStateException;
import com.app.exception.TransactionNotFoundException;
import com.app.mapper.TransactionMapper;
import com.app.repo.AccountDao;
import com.app.repo.TransactionDao;
import com.app.service.TransactionService;

@Service
@Transactional
public class TransactionServiceImpl implements TransactionService {

	private final TransactionDao transactionDao;
	private final AccountDao accountDao;

	TransactionServiceImpl(TransactionDao transactionDao, AccountDao accountDao) {
		this.transactionDao = transactionDao;
		this.accountDao = accountDao;
	}

	@Override
	public void deposit(String accountNumber, BigDecimal amount, String performedBy) {

		Account account = accountDao.findByAccountNumberAndIsDeletedFalse(accountNumber).orElseThrow(
				() -> new BankAccountNotFoundException("Bank with account number: " + accountNumber + " not found"));

		account.credit(amount);

		// create transaction

		Transaction txn = new Transaction(account, amount, TransactionType.CREDIT, TransactionStatus.COMPLETED,
				performedBy);
		txn.setTransactionId("TX" + UUID.randomUUID().toString().replace("-", "").substring(0, 8));

		transactionDao.save(txn);

	}

	@Override
	public void withdraw(String accountNumber, BigDecimal amount, String performedBy) {
		Account account = accountDao.findByAccountNumberAndIsDeletedFalse(accountNumber).orElseThrow(
				() -> new BankAccountNotFoundException("Bank with account number: " + accountNumber + " not found"));

		if (account.getBalance().compareTo(amount) < 0) {
			throw new InsufficientBalanceException("Insufficient balance ");
		}

		TransactionStatus status;

		if (amount.compareTo(new BigDecimal("200000")) > 0) {
			status = TransactionStatus.PENDING;
		} else {
			status = TransactionStatus.COMPLETED;
			account.debit(amount);

		}

		Transaction txn = new Transaction(account, amount, TransactionType.DEBIT, status, performedBy);
		txn.setTransactionId("TX" + UUID.randomUUID().toString().replace("-", "").substring(0, 8));

		transactionDao.save(txn);
	}

	@Override
	public List<TransactionHistoryDto> getAllTransactionsForAccount(String accountNumber) {

		if (!accountDao.existsByAccountNumber(accountNumber)) {
			throw new BankAccountNotFoundException("Bank with account number: " + accountNumber + " not found");
		}

		return transactionDao.findByAccount_AccountNumber(accountNumber).stream()
				.map(TransactionMapper::toTransactionHistoryDto).toList();
	}

	@Override
	public TransactionHistoryDto getByTransactionId(String transactionId) {
		Transaction transaction = transactionDao.findByTransactionId(transactionId)
				.orElseThrow(() -> new TransactionNotFoundException(
						"Transaction with transaction id : " + transactionId + " not found"));
		return TransactionMapper.toTransactionHistoryDto(transaction);

	}

	@Override
	public void approveTransaction(String transactionId, String approvedBy) {
		Transaction transaction = transactionDao.findByTransactionId(transactionId)
				.orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

		if (transaction.getTransactionStatus() != TransactionStatus.PENDING) {

			throw new InvalidTransactionStateException("Only pending transactions can be approved");
		}

		Account account = transaction.getAccount();

		if (account.getBalance().compareTo(transaction.getAmount()) < 0) {

			throw new InsufficientBalanceException("Insufficient balance at approval time");
		}
		account.debit(transaction.getAmount());

		transaction.setTransactionStatus(TransactionStatus.COMPLETED);
		transaction.setApprovedByManagerId(approvedBy);
	}

	@Override
	public void rejectTransaction(String transactionId, String approvedBy) {
		Transaction transaction = transactionDao.findByTransactionId(transactionId)
				.orElseThrow(() -> new TransactionNotFoundException("Transaction not found"));

		if (transaction.getTransactionStatus() != TransactionStatus.PENDING) {

			throw new InvalidTransactionStateException("Only pending transactions can be rejected");
		}

		transaction.setTransactionStatus(TransactionStatus.REJECTED);
		transaction.setApprovedByManagerId(approvedBy);
	}

	@Override
	public List<TransactionHistoryDto> getAllPendingTransactions() {
		return transactionDao.findByTransactionStatus(TransactionStatus.PENDING).stream()
				.map(TransactionMapper::toTransactionHistoryDto).toList();
	}

}
