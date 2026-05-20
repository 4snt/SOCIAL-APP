package com.example.social.controller;

import com.example.social.service.AuthService;
import com.example.social.service.LikeService;
import java.util.Map;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class LikeController {
    private final LikeService likeService;
    private final AuthService authService;

    public LikeController(LikeService likeService, AuthService authService) {
        this.likeService = likeService;
        this.authService = authService;
    }

    @PostMapping("/{postId}/like")
    public Map<String, Long> like(@PathVariable Long postId) {
        Long userId = authService.requireCurrentUser().getId();
        return Map.of("likes", likeService.like(postId, userId));
    }

    @DeleteMapping("/{postId}/like")
    public Map<String, Long> unlike(@PathVariable Long postId) {
        Long userId = authService.requireCurrentUser().getId();
        return Map.of("likes", likeService.unlike(postId, userId));
    }
}
