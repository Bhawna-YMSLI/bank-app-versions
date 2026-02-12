package com.app.dto.user;

import com.app.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserResponseDto {
	private String username;
	private Role role;
	private boolean isActive ;
}
