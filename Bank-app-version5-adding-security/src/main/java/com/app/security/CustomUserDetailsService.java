package com.app.security;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.app.repo.UserDao;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserDao userDao;

	public CustomUserDetailsService(UserDao userDao) {
		this.userDao = userDao;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		com.app.entities.User user = userDao.findByUsername(username)
				.orElseThrow(() -> new UsernameNotFoundException("User with username '" + username + "' not found"));

		return new User(user.getUsername(), user.getPassword(), user.isActive(), true, true, true,
				java.util.List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name())));
	}
}