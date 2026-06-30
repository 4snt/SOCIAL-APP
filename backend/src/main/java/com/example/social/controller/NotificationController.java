package com.example.social.controller;

import com.example.social.dto.NotificationResponse;
import com.example.social.entity.User;
import com.example.social.service.AuthService;
import com.example.social.service.NotificationService;
import java.util.List;
import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {
    private final AuthService authService;
    private final NotificationService notificationService;

    public NotificationController(AuthService authService, NotificationService notificationService) {
        this.authService = authService;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<NotificationResponse> list() {
        return notificationService.list(authService.requireCurrentUser().getId());
    }

    @GetMapping("/unread-count")
    public Map<String, Long> unreadCount() {
        return Map.of("count", notificationService.unreadCount(authService.requireCurrentUser().getId()));
    }

    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        User user = authService.requireCurrentUser();
        notificationService.markRead(id, user.getId());
    }
}
