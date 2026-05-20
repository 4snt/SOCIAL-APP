package com.example.social.service;

import com.example.social.entity.User;
import com.example.social.repository.UserRepository;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
            return Optional.empty();
        }
        String principal = auth.getName();
        if (principal == null || principal.isBlank() || "anonymousUser".equals(principal)) {
            return Optional.empty();
        }
        return userRepository.findByEmail(principal);
    }

    public Long getCurrentUserIdOrNull() {
        return getCurrentUser().map(User::getId).orElse(null);
    }

    public User requireCurrentUser() {
        return getCurrentUser()
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.UNAUTHORIZED, "Não autenticado"));
    }
}
