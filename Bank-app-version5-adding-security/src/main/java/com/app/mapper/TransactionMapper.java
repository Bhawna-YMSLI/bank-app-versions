package com.app.mapper;

import com.app.dto.transaction.TransactionHistoryDto;
import com.app.entities.Transaction;

public class TransactionMapper {

	// Entity → Response DTO
	public static TransactionHistoryDto toTransactionHistoryDto(Transaction transaction) {
		if (transaction == null) {
			return null;
		}

		return new TransactionHistoryDto(transaction.getTransactionId(), transaction.getAccount().getAccountNumber(),
				transaction.getTransactionType(), transaction.getAmount(), transaction.getCreatedAt(),
				transaction.getTransactionStatus(), transaction.getPerformedByClerkId(),
				transaction.getApprovedByManagerId());

	}
}
