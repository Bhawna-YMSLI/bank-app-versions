package com.app.service;

import java.util.List;

import com.app.dto.account.AccountRequestDto;
import com.app.dto.account.AccountResponseDto;

public interface AccountService {
	public List<AccountResponseDto> getAll();

	public AccountResponseDto getByAccountNumber(String accountNumber);

	public AccountResponseDto addAccount(AccountRequestDto account);

	public AccountResponseDto deleteAccount(String accountNumber);

	public AccountResponseDto updateAccount(String accountNumber, AccountRequestDto accountDto);

}
