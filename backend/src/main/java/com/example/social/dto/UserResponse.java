package com.example.social.dto;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String username,
        String email,
        String avatarUrl,
        String bio,
        String userType,
        LocalDateTime lastSeenAt,
        boolean online
) {}
