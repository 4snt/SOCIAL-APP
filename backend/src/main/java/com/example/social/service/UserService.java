package com.example.social.service;

import com.example.social.entity.AdminUser;
import com.example.social.entity.User;
import com.example.social.repository.UserRepository;
import java.util.ArrayList;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + email));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>()
        );
    }

    public AdminUser findAdminById(Long adminId) {
        User user = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin user not found"));
        if (!(user instanceof AdminUser admin)) {
            throw new RuntimeException("Usuário não é administrador");
        }
        return admin;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public AdminUser createAdmin(AdminUser admin) {
        return userRepository.save(admin);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
