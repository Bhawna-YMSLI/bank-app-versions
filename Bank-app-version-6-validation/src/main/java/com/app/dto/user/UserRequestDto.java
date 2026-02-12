package com.app.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;

@Getter
public class UserRequestDto {
	@NotBlank(message = "{validation.username.required}")
	@Size(min = 3, max = 50, message = "{validation.username.size}")
	private String username;

	@NotBlank(message = "{validation.password.required}")
	@Size(min = 8, max = 100, message = "{validation.password.size}")
	private String password;
}
