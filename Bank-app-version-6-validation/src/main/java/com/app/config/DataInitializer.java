package com.app.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.app.entities.User;
import com.app.enums.Role;
import com.app.repo.UserDao;

@Configuration
public class DataInitializer {

	@Bean
	CommandLineRunner ensureDefaultManager(UserDao userDao, PasswordEncoder passwordEncoder,
			@Value("${app.bootstrap.manager.username:manager}") String managerUsername,
			@Value("${app.bootstrap.manager.password:manager123}") String managerPassword) {
		return args -> {
			if (!userDao.existsByUsername(managerUsername)) {
				userDao.save(new User(managerUsername, passwordEncoder.encode(managerPassword), Role.MANAGER));
			}
		};
	}
}