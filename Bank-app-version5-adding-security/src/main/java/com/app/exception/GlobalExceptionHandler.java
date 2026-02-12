package com.app.exception;

import java.time.Instant;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(BankAccountNotFoundException.class)
	public ResponseEntity<ProblemDetail> handleAccountNotFound(BankAccountNotFoundException ex) {

		ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
		problem.setTitle("Account Not Found");
		problem.setDetail(ex.getMessage());
		problem.setProperty("timestamp", Instant.now());
		problem.setProperty("errorCode", "ACCOUNT_NOT_FOUND");

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
	}

	// 2️ Insufficient balance
	@ExceptionHandler(InsufficientBalanceException.class)
	public ResponseEntity<ProblemDetail> handleInsufficientBalance(InsufficientBalanceException ex) {

		ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
		problem.setTitle("Insufficient Balance");
		problem.setDetail(ex.getMessage());
		problem.setProperty("timestamp", Instant.now());
		problem.setProperty("errorCode", "INSUFFICIENT_BALANCE");

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
	}

	// 3️ Transaction not found
	@ExceptionHandler(TransactionNotFoundException.class)
	public ResponseEntity<ProblemDetail> handleTransactionNotFound(TransactionNotFoundException ex) {

		ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
		problem.setTitle("Transaction Not Found");
		problem.setDetail(ex.getMessage());
		problem.setProperty("timestamp", Instant.now());
		problem.setProperty("errorCode", "TRANSACTION_NOT_FOUND");

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
	}

	@ExceptionHandler(UserNotFoundException.class)
	public ResponseEntity<ProblemDetail> handleUserNotFound(UserNotFoundException ex) {

		ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
		problem.setTitle("User Not Found");
		problem.setDetail(ex.getMessage());
		problem.setProperty("timestamp", Instant.now());

		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(problem);
	}

	@ExceptionHandler(UserAlreadyExistsException.class)
	public ResponseEntity<ProblemDetail> handleUserAlreadyExists(UserAlreadyExistsException ex) {

		ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.CONFLICT);

		problem.setTitle("User Already Exists");
		problem.setDetail(ex.getMessage());
		problem.setProperty("timestamp", Instant.now());

		return ResponseEntity.status(HttpStatus.CONFLICT).body(problem);
	}

	@ExceptionHandler(InvalidTransactionStateException.class)
	public ResponseEntity<ProblemDetail> handleInvalidTransactionState(InvalidTransactionStateException ex) {

		ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);

		problem.setTitle("Invalid Transaction State");
		problem.setDetail(ex.getMessage());
		problem.setProperty("timestamp", Instant.now());
		problem.setProperty("errorCode", "INVALID_TRANSACTION_STATE");

		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(problem);
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<ProblemDetail> handleBadCredentials(BadCredentialsException ex) {

		ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.UNAUTHORIZED);
		problem.setTitle("Authentication Failed");
		problem.setDetail("Invalid username or password");
		problem.setProperty("timestamp", Instant.now());

		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(problem);
	}

}
