package com.app.mapper;

import com.app.dto.user.UserRequestDto;
import com.app.dto.user.UserResponseDto;
import com.app.entities.User;
import com.app.enums.Role;

public class UserMapper {
	// DTO → Entity
	public static User toEntity(UserRequestDto dto, String encodedPassword, Role role) {
		return new User(dto.getUsername(), encodedPassword, role);
	}
	// Entity → DTO
	public static UserResponseDto toResponseDto(User user) {
		return new UserResponseDto(user.getUsername(), user.getRole(), user.isActive());
	}
}
