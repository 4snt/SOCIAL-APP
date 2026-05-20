package com.example.social.controller;

import com.example.social.dto.CommentResponse;
import com.example.social.dto.CreateCommentRequest;
import com.example.social.service.AuthService;
import com.example.social.service.CommentService;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class CommentController {
    private final CommentService commentService;
    private final AuthService authService;

    public CommentController(CommentService commentService, AuthService authService) {
        this.commentService = commentService;
        this.authService = authService;
    }

    @GetMapping("/posts/{postId}/comments")
    public List<CommentResponse> list(@PathVariable Long postId) {
        return commentService.findByPostId(postId);
    }

    @PostMapping("/posts/{postId}/comments")
    public CommentResponse create(@PathVariable Long postId, @RequestBody CreateCommentRequest request) {
        Long userId = authService.requireCurrentUser().getId();
        return commentService.create(postId, request, userId);
    }

    @DeleteMapping("/comments/{commentId}")
    public void delete(@PathVariable Long commentId) {
        Long userId = authService.requireCurrentUser().getId();
        commentService.delete(commentId, userId);
    }
}
