package com.example.social.service;

import com.example.social.entity.AdminUser;
import com.example.social.entity.StudentsUser;
import com.example.social.entity.User;
import com.example.social.entity.UniversityUser;
import com.example.social.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<User> findAll() {
        return userRepository.findAll();
    }

    @Transactional
    public User touchPresence(User user) {
        user.setLastSeenAt(LocalDateTime.now());
        return userRepository.save(user);
    }

    public String resolveUserType(User user) {
        if (user instanceof AdminUser) {
            return "ADMIN";
        }
        if (user instanceof StudentsUser) {
            return "STUDENT";
        }
        if (user instanceof UniversityUser) {
            return "UNIVERSITY";
        }
        return "USER";
    }

    public boolean isOnline(User user) {
        if (user.getLastSeenAt() == null) {
            return false;
        }
        return user.getLastSeenAt().isAfter(LocalDateTime.now().minusMinutes(5));
    }
}
