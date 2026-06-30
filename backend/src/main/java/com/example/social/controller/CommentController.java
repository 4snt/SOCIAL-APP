package com.example.social.controller;

import com.example.social.dto.CommentResponse;
import com.example.social.dto.CreateCommentRequest;
import com.example.social.entity.User;
import com.example.social.service.ActivityLogService;
import com.example.social.service.AuthService;
import com.example.social.service.CommentService;
import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CommentController {
    private final CommentService commentService;
    private final AuthService authService;
    private final ActivityLogService activityLogService;

    public CommentController(CommentService commentService, AuthService authService, ActivityLogService activityLogService) {
        this.commentService = commentService;
        this.authService = authService;
        this.activityLogService = activityLogService;
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
        User currentUser = authService.requireCurrentUser();
        commentService.delete(commentId, currentUser.getId(), currentUser instanceof com.example.social.entity.AdminUser);
        activityLogService.record(currentUser, "DELETE_COMMENT", "COMMENT", commentId, "Excluiu um comentário");
    }
}
