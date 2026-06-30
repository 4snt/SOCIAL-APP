package com.example.social.dto;

import java.time.LocalDateTime;

public record CommentResponse(
        Long id,
        Long userId,
        String username,
        String avatarUrl,
        String userType,
        boolean authorOnline,
        String content,
        LocalDateTime createdAt
) {}
