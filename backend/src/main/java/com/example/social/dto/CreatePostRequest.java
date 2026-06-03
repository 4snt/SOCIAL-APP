package com.example.social.dto;

import org.springframework.web.multipart.MultipartFile;

public record CreatePostRequest(MultipartFile image, String description) {}
