package com.app.service.impl;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.dto.user.UserRequestDto;
import com.app.dto.user.UserResponseDto;
import com.app.entities.User;
import com.app.enums.Role;
import com.app.exception.UserAlreadyExistsException;
import com.app.exception.UserNotFoundException;
import com.app.mapper.UserMapper;
import com.app.repo.UserDao;
import com.app.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {
	private final UserDao userDao;
	private final PasswordEncoder passwordEncoder;

	UserServiceImpl(UserDao userDao, PasswordEncoder passwordEncoder) {
		this.userDao = userDao;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public UserResponseDto createClerk(UserRequestDto userRequestDto) {
		boolean usernameExists = userDao.existsByUsername(userRequestDto.getUsername());
		if (usernameExists) {
			throw new UserAlreadyExistsException(
					"User with username '" + userRequestDto.getUsername() + "' already exists");
		}
		String encodedPassword = passwordEncoder.encode(userRequestDto.getPassword());
		User user = userDao.save(UserMapper.toEntity(userRequestDto, encodedPassword, Role.CLERK));
		return UserMapper.toResponseDto(user);
	}

	@Override
	public List<UserResponseDto> getAllClerks() {
		return userDao.findByRole(Role.CLERK).stream().map(UserMapper::toResponseDto).toList();
	}

	@Override
	public void disableClerk(String username) {
		User user = userDao.findByUsername(username)
				.orElseThrow(() -> new UserNotFoundException("Clerk with username '" + username + "' does not exist"));

		user.setActive(false);
		userDao.save(user);
	}

}
