package com.app.dto.auth;

import com.app.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponseDto {
	private String token;
	private String username;
	private Role role;
}