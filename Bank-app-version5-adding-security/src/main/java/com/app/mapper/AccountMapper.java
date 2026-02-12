package com.app.mapper;

import com.app.dto.account.AccountRequestDto;
import com.app.dto.account.AccountResponseDto;
import com.app.entities.Account;

public class AccountMapper {

	private AccountMapper() {
		// prevent object creation
	}

	// Request DTO → Entity
	public static Account toEntity(AccountRequestDto dto) {
		if (dto == null) {
			return null;
		}

		Account account = new Account(dto.getName(), dto.getBalance());

		return account;
	}

	// Entity → Response DTO
	public static AccountResponseDto toResponseDto(Account account) {
		if (account == null) {
			return null;
		}

		return new AccountResponseDto(account.getAccountNumber(), account.getName(), account.getBalance());
	}
}
