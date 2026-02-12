package com.app.entities;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;

@Getter
@Entity
@Table(name = "account")
public class Account {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Getter(AccessLevel.NONE)
	private Long id;

	@Column(nullable = false, unique = true, updatable = false, length = 36)
	private String accountNumber;

	private String name;

	private BigDecimal balance;

	private boolean isDeleted = false;

	@OneToMany(mappedBy = "account", fetch = FetchType.LAZY)
	List<Transaction> transactions = new ArrayList<>();

	public Account() {

	}

	public Account(String name, BigDecimal balance) {

		this.name = name;
		this.balance = balance;
	}

	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}

	public void setName(String name) {
		this.name = name;
	}

	public void setAccountNumber(String accountNumber) {
		this.accountNumber = accountNumber;
	}

	public void credit(BigDecimal amount) {
		this.balance = this.balance.add(amount);
	}

	public void debit(BigDecimal amount) {
		this.balance = this.balance.subtract(amount);
	}

	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

}
