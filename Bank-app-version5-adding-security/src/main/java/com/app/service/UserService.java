package com.app.service;

import java.util.List;

import com.app.dto.user.UserRequestDto;
import com.app.dto.user.UserResponseDto;

public interface UserService {
	UserResponseDto createClerk(UserRequestDto userRequestDto);

	List<UserResponseDto> getAllClerks();

	public void disableClerk(String username);

}
