package com.app.dto.transaction;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DepositDto {

	@NotBlank(message = "{validation.account.number.required}")
	String accountNumber;

	@NotNull(message = "{validation.amount.required}")
	@DecimalMin(value = "0.01", inclusive = true, message = "{validation.amount.positive}")
	BigDecimal amount;

}
