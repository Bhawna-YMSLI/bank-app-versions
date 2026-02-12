package com.app.repo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.app.entities.User;
import com.app.enums.Role;

public interface UserDao extends JpaRepository<User, Long> {

	List<User> findByRole(Role role);

	Optional<User> findByUsername(String username);

	boolean existsByUsername(String username);
}
