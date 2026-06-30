package com.example.social.dto;

public record UserResponse(
        Long id,
        String username,
        String email,
        String avatarUrl,
        String bio,
        String userType
) {}
