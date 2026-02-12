package com.app.controller;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.dto.auth.LoginRequestDto;
import com.app.dto.auth.LoginResponseDto;
import com.app.repo.UserDao;
import com.app.security.JwtService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/v5/auth")
public class AuthController {

	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;
	private final UserDao userDao;

	public AuthController(AuthenticationManager authenticationManager, JwtService jwtService, UserDao userDao) {
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
		this.userDao = userDao;
	}

	@PostMapping("/login")
	public LoginResponseDto login(@Valid@RequestBody LoginRequestDto request) {
		Authentication authentication = authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

		User principal = (User) authentication.getPrincipal();
		String token = jwtService.generateToken(principal);

		com.app.entities.User appUser = userDao.findByUsername(principal.getUsername()).orElseThrow();
		return new LoginResponseDto(token, appUser.getUsername(), appUser.getRole());
	}
}