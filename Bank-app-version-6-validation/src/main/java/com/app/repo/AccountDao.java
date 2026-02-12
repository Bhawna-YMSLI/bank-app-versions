package com.app.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.Account;

public interface AccountDao extends JpaRepository<Account, Long> {
	Optional<Account> findByAccountNumberAndIsDeletedFalse(String accountNumber);

	boolean existsByAccountNumberAndIsDeletedFalse(String accountNumber);

	boolean existsByAccountNumber(String accountNumber);

	List<Account> findByIsDeletedFalse();
}
