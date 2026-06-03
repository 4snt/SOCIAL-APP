package com.example.social.dto;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;


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
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime createdAt,
        String status

) {}
