package com.app.dto.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.app.enums.TransactionStatus;
import com.app.enums.TransactionType;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public class TransactionHistoryDto {
	private String transactionId;
	private String accountNumber;
	private TransactionType transactionType;
	private BigDecimal amount;
	private LocalDateTime createdAt;
	private TransactionStatus status;
	private String performedBy;
	private String approvedBy;

}
