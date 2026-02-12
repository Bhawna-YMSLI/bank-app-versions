package com.app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.account.AccountRequestDto;
import com.app.dto.account.AccountResponseDto;
import com.app.service.AccountService;

import jakarta.validation.Valid;

@RequestMapping(path = "v5/accounts")
@RestController
public class AccountController {
	private AccountService accountService;

	public AccountController(AccountService accountService) {
		this.accountService = accountService;
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('CLERK','MANAGER')")
	public List<AccountResponseDto> getAll() {
		return accountService.getAll();
	}

	@GetMapping(path = "/{accountNumber}")
	@PreAuthorize("hasAnyRole('CLERK','MANAGER')")
	public AccountResponseDto getByAccountNumber(@PathVariable(name = "accountNumber") String accountNumber) {
		return accountService.getByAccountNumber(accountNumber);
	}

	@PostMapping
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<AccountResponseDto> addAccount(@Valid @RequestBody AccountRequestDto accountDto) {
		AccountResponseDto saved = accountService.addAccount(accountDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@DeleteMapping(path = "/{accountNumber}")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<Void> deleteAccount(@PathVariable(name = "accountNumber") String accountNumber) {

		accountService.deleteAccount(accountNumber);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

	@PutMapping(path = "/{accountNumber}")
	@PreAuthorize("hasRole('MANAGER')")
	public ResponseEntity<AccountResponseDto> updateById(@PathVariable(name = "accountNumber") String accountNumber,
			@Valid @RequestBody AccountRequestDto accountDto) {

		AccountResponseDto updated = accountService.updateAccount(accountNumber, accountDto);
		return ResponseEntity.status(HttpStatus.OK).body(updated);
	}

}
