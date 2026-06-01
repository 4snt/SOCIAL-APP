package com.example.social.dto;

import java.time.LocalDateTime;


public record PostResponse(
        Long id,
        Long userId,
        String username,
        String avatarUrl,
        String imageUrl,
        String description,
        long likeCount,
        long commentCount,
        boolean likedByMe,
        LocalDateTime createdAt,
        String status

) {}
