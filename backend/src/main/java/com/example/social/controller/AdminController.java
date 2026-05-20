package com.example.social.controller;

import com.example.social.entity.AdminUser;
import com.example.social.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {
    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public AdminUser adminEndpoint(Long adminId) {
        return userService.findAdminById(adminId);
    }

    @PostMapping("/admin/create")
    public AdminUser createAdmin(@RequestBody AdminUser admin) {
        return userService.createAdmin(admin);
    }
}
