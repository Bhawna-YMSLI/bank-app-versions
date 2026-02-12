package com.app.entities;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.app.enums.TransactionStatus;
import com.app.enums.TransactionType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "transactions")
public class Transaction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true, updatable = false, length = 36)
	private String transactionId;

	@Column(nullable = false, updatable = false)
	private BigDecimal amount;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(nullable = false, updatable = false)
	@Enumerated(EnumType.STRING)
	private TransactionType transactionType;

	@Enumerated(EnumType.STRING)
	private TransactionStatus transactionStatus;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "account_id")
	Account account;

	@Column(nullable = false, updatable = false)
	private String performedByClerkId;

	@Column
	private String approvedByManagerId;

	// for JPA only
	protected Transaction() {
	}

	public Transaction(Account account, BigDecimal amount, TransactionType transactionType,
			TransactionStatus transactionStatus, String performedByClerkId) {

		this.account = account;
		this.amount = amount;
		this.transactionType = transactionType;
		this.transactionStatus = transactionStatus;
		this.performedByClerkId = performedByClerkId;
		this.createdAt = LocalDateTime.now();
	}

	public String getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(String transactionId) {
		this.transactionId = transactionId;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public TransactionType getTransactionType() {
		return transactionType;
	}

	public TransactionStatus getTransactionStatus() {
		return transactionStatus;
	}

	public String getPerformedByClerkId() {
		return performedByClerkId;
	}

	public void setPerformedByClerkId(String performedByClerkId) {
		this.performedByClerkId = performedByClerkId;
	}

	public String getApprovedByManagerId() {
		return approvedByManagerId;
	}

	public void setApprovedByManagerId(String approvedByManagerId) {
		this.approvedByManagerId = approvedByManagerId;
	}

	public void setTransactionStatus(TransactionStatus transactionStatus) {
		this.transactionStatus = transactionStatus;
	}

}
