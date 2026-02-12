package com.app.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.user.UserRequestDto;
import com.app.dto.user.UserResponseDto;
import com.app.service.UserService;

import jakarta.validation.Valid;

@RequestMapping(path = "v5/users")
@RestController
@PreAuthorize("hasRole('MANAGER')")
public class UserController {
	private final UserService userService;

	UserController(UserService userService) {
		this.userService = userService;
	}

	@PostMapping(path = "/clerk")
	ResponseEntity<UserResponseDto> createClerk(@Valid @RequestBody UserRequestDto userRequestDto) {
		UserResponseDto saved = userService.createClerk(userRequestDto);
		return ResponseEntity.status(HttpStatus.CREATED).body(saved);
	}

	@GetMapping("/clerks")
	ResponseEntity<List<UserResponseDto>> getAllClerks() {

		List<UserResponseDto> clerks = userService.getAllClerks();
		return ResponseEntity.ok(clerks);
	}

	@PutMapping(path = "/clerks/{username}/disable")
	ResponseEntity<Void> disableClerk(@PathVariable String username) {
		userService.disableClerk(username);
		return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
	}

}
