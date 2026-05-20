package com.example.social.controller;

import com.example.social.dto.UserResponse;
import com.example.social.entity.User;
import com.example.social.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/auth/register")
    public UserResponse register(@RequestBody User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userService.createUser(user);
        return toResponse(saved);
    }

    @GetMapping("/users/{id}")
    public UserResponse findById(@PathVariable Long id) {
        return userService.findById(id)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    @GetMapping("/users/by-username/{username}")
    public UserResponse findByUsername(@PathVariable String username) {
        return userService.findByUsername(username)
                .map(this::toResponse)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(u.getId(), u.getUsername(), u.getEmail(), u.getAvatarUrl(), u.getBio());
    }
}
