package com.example.social.controller;

import com.example.social.dto.ActivityLogResponse;
import com.example.social.dto.UserResponse;
import com.example.social.entity.User;
import com.example.social.service.ActivityLogService;
import com.example.social.service.AuthService;
import com.example.social.service.UserService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final AuthService authService;
    private final UserService userService;
    private final ActivityLogService activityLogService;

    public AdminDashboardController(AuthService authService, UserService userService, ActivityLogService activityLogService) {
        this.authService = authService;
        this.userService = userService;
        this.activityLogService = activityLogService;
    }

    @GetMapping("/users")
    public List<UserResponse> listUsers() {
        authService.requireAdmin();
        return userService.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/activity")
    public List<ActivityLogResponse> recentActivity() {
        authService.requireAdmin();
        return activityLogService.recent();
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getAvatarUrl(),
                u.getBio(),
                userService.resolveUserType(u),
                u.getLastSeenAt(),
                userService.isOnline(u)
        );
    }
}