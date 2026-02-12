package com.app.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.transaction.DepositDto;
import com.app.dto.transaction.TransactionHistoryDto;
import com.app.dto.transaction.WithdrawDto;
import com.app.service.TransactionService;

@RestController
@RequestMapping(path = "v5/transactions")
public class TransactionController {
	private final TransactionService transactionService;

	public TransactionController(TransactionService transactionService) {
		this.transactionService = transactionService;
	}

	@PutMapping("/deposit")
	@PreAuthorize("hasAnyRole('CLERK','MANAGER')")
	public ResponseEntity<Void> deposit(@RequestBody DepositDto depositDto, Authentication authentication) {

		transactionService.deposit(depositDto.getAccountNumber(), depositDto.getAmount(), authentication.getName());

		return ResponseEntity.noContent().build();
	}

	@PutMapping("/withdraw")
	@PreAuthorize("hasAnyRole('CLERK','MANAGER')")
	public ResponseEntity<Void> withdraw(@RequestBody WithdrawDto withdrawDto, Authentication authentication) {

		transactionService.withdraw(withdrawDto.getAccountNumber(), withdrawDto.getAmount(), authentication.getName());

		return ResponseEntity.noContent().build();
	}

	@GetMapping("/account/{accountNumber}/history")
	@PreAuthorize("hasAnyRole('CLERK','MANAGER')")
	public ResponseEntity<List<TransactionHistoryDto>> getAllTransactionsForAccount(
			@PathVariable String accountNumber) {
		return ResponseEntity.ok(transactionService.getAllTransactionsForAccount(accountNumber));

	}

	@GetMapping("/{transactionId}")
	@PreAuthorize("hasAnyRole('CLERK','MANAGER')")
	public ResponseEntity<TransactionHistoryDto> getByTransactionId(@PathVariable String transactionId) {

		return ResponseEntity.ok(transactionService.getByTransactionId(transactionId));
	}

	@PutMapping("/{transactionId}/approve")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<Void> approve(@PathVariable String transactionId) {
		transactionService.approveTransaction(transactionId, "approved by");
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{transactionId}/reject")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<Void> reject(@PathVariable String transactionId) {
		transactionService.rejectTransaction(transactionId, "approved by");
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/pending")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<List<TransactionHistoryDto>> getAllPendingTransactions() {
		return ResponseEntity.ok(transactionService.getAllPendingTransactions());
	}

}
