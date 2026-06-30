package com.example.social.dto;

import java.time.LocalDateTime;

public record NotificationResponse(Long id, String type, String message, Long postId,
                                   String actorUsername, boolean read, LocalDateTime createdAt) {}
