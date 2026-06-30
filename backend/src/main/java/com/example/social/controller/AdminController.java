package com.example.social.controller;

import com.example.social.entity.AdminUser;
import com.example.social.service.UserService;
import com.example.social.service.AuthService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {
    private final UserService userService;
    private final AuthService authService;

    public AdminController(UserService userService, AuthService authService) {
        this.userService = userService;
        this.authService = authService;
    }

    @GetMapping("/admin")
    public AdminUser adminEndpoint(Long adminId) {
        authService.requireAdmin();
        return userService.findAdminById(adminId);
    }

    @PostMapping("/admin/create")
    public AdminUser createAdmin(@RequestBody AdminUser admin) {
        authService.requireAdmin();
        return userService.createAdmin(admin);
    }
}
