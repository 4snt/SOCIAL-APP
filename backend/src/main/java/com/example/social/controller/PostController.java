package com.example.social.controller;

import com.example.social.dto.CreatePostRequest;
import com.example.social.dto.PostResponse;
import com.example.social.service.AuthService;
import com.example.social.service.PostService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostController {
    private final PostService postService;
    private final AuthService authService;

    public PostController(PostService postService, AuthService authService) {
        this.postService = postService;
        this.authService = authService;
    }

    @GetMapping
    public List<PostResponse> findPosts(
            @RequestParam(required = false) Long userId,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction,
            @RequestParam(required = false) Long currentUserId
    ) {
        Long viewerId = currentUserId != null ? currentUserId : authService.getCurrentUserIdOrNull();
        return postService.findPosts(userId, sortBy, direction, viewerId);
    }

    @GetMapping("/{postId}")
    public PostResponse findById(
            @PathVariable Long postId,
            @RequestParam(required = false) Long currentUserId
    ) {
        Long viewerId = currentUserId != null ? currentUserId : authService.getCurrentUserIdOrNull();
        return postService.findById(postId, viewerId);
    }

    @PostMapping
    public PostResponse create(@RequestBody CreatePostRequest request) {
        Long userId = authService.requireCurrentUser().getId();
        return postService.create(request, userId);
    }
}
