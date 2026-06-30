package com.example.social.dto;

import java.time.LocalDateTime;

public record ActivityLogResponse(
        Long id,
        Long userId,
        String username,
        String avatarUrl,
        String userType,
        String actionType,
        String targetType,
        Long targetId,
        String details,
        LocalDateTime createdAt
) {}