package com.app.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.Transaction;
import com.app.enums.TransactionStatus;

public interface TransactionDao extends JpaRepository<Transaction, Long> {
	Optional<Transaction> findByTransactionId(String transactionId);

	List<Transaction> findByAccount_AccountNumber(String accountNumber);

	List<Transaction> findByTransactionStatus(TransactionStatus transactionStatus);

}
