package com.app.dto.account;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class AccountResponseDto {

	private String accountNumber;
	private String name;
	private BigDecimal balance;

}
