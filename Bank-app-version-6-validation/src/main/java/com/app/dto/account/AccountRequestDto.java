package com.app.dto.account;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequestDto {
	@NotBlank(message = "{validation.account.name.required}")
	@Size(min = 2, max = 100, message = "{validation.account.name.size}")
	private String name;
	@NotNull(message = "{validation.balance.required}")
	@DecimalMin(value = "0.00", inclusive = true, message = "{validation.balance.nonNegative}")
	private BigDecimal balance;

}