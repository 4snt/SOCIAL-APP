package com.example.social.controller;

import com.example.social.dto.ActivityLogResponse;
import com.example.social.dto.UserResponse;
import com.example.social.dto.PostResponse;
import com.example.social.dto.UpdatePostStatusRequest;
import com.example.social.entity.User;
import com.example.social.service.ActivityLogService;
import com.example.social.service.AuthService;
import com.example.social.service.UserService;
import com.example.social.service.PostService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {

    private final AuthService authService;
    private final UserService userService;
    private final ActivityLogService activityLogService;
    private final PostService postService;
    private final com.example.social.service.NotificationService notificationService;

    public AdminDashboardController(AuthService authService, UserService userService, ActivityLogService activityLogService, PostService postService, com.example.social.service.NotificationService notificationService) {
        this.authService = authService;
        this.userService = userService;
        this.activityLogService = activityLogService;
        this.postService = postService;
        this.notificationService = notificationService;
    }

    @PutMapping("/posts/{postId}/status")
    public PostResponse updatePostStatus(@PathVariable Long postId, @RequestBody UpdatePostStatusRequest request) {
        User admin = authService.requireAdmin();
        PostResponse updated = postService.updateStatus(postId, request.status(), admin.getId());
        userService.findById(updated.userId()).ifPresent(owner -> notificationService.notify(owner, admin, "STATUS_CHANGED", "Situação da sua demanda alterada para " + updated.status(), postId));
        activityLogService.record(admin, "UPDATE_POST_STATUS", "POST", postId, "Situação alterada para " + updated.status());
        return updated;
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
