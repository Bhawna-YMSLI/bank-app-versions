package com.app.service.impl;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.account.AccountRequestDto;
import com.app.dto.account.AccountResponseDto;
import com.app.entities.Account;
import com.app.exception.BankAccountNotFoundException;
import com.app.mapper.AccountMapper;
import com.app.repo.AccountDao;
import com.app.service.AccountService;

@Service
@Transactional
public class AccountServiceImpl implements AccountService {
	private final AccountDao accountDao;

	public AccountServiceImpl(AccountDao accountDao) {
		this.accountDao = accountDao;
	}

	@Override
	public List<AccountResponseDto> getAll() {

		return accountDao.findByIsDeletedFalse().stream().map(AccountMapper::toResponseDto).toList();

	}

	@Override
	public AccountResponseDto getByAccountNumber(String accountNumber) {

		return accountDao.findByAccountNumberAndIsDeletedFalse(accountNumber).map(AccountMapper::toResponseDto)
				.orElseThrow(() -> new BankAccountNotFoundException(
						"Bank with account number: " + accountNumber + " not found"));

	}

	@Override
	public AccountResponseDto addAccount(AccountRequestDto dto) {
		Account account = AccountMapper.toEntity(dto);

		account.setAccountNumber("AC" + UUID.randomUUID().toString().replace("-", "").substring(0, 8));

		return AccountMapper.toResponseDto(accountDao.save(account));
	}

	@Override
	public AccountResponseDto deleteAccount(String accountNumber) {

		Account accountToDelete = accountDao.findByAccountNumberAndIsDeletedFalse(accountNumber).orElseThrow(
				() -> new BankAccountNotFoundException("Bank with account number: " + accountNumber + " not found"));

		accountToDelete.setDeleted(true);
		// accountDao.deleteByAccountNumber(accountNumber);

		return AccountMapper.toResponseDto(accountToDelete);

	}

	@Override
	public AccountResponseDto updateAccount(String accountNumber, AccountRequestDto accountDto) {

		Account accountToUpdate = accountDao.findByAccountNumberAndIsDeletedFalse(accountNumber).orElseThrow(
				() -> new BankAccountNotFoundException("Bank with account number: " + accountNumber + " not found"));

		accountToUpdate.setName(accountDto.getName());

		accountToUpdate.setBalance(accountDto.getBalance());

		Account updatedAccount = accountDao.save(accountToUpdate);

		return AccountMapper.toResponseDto(updatedAccount);
	}

}
