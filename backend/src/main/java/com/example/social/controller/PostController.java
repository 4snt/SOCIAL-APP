package com.example.social.controller;

import com.example.social.dto.CreatePostRequest;
import com.example.social.dto.PostResponse;
import com.example.social.entity.Post;
import com.example.social.entity.User;
import com.example.social.service.ActivityLogService;
import com.example.social.service.AuthService;
import com.example.social.service.PostService;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final AuthService authService;
    private final ActivityLogService activityLogService;

    public PostController(PostService postService, AuthService authService, ActivityLogService activityLogService) {
        this.postService = postService;
        this.authService = authService;
        this.activityLogService = activityLogService;
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

    @GetMapping("/{postId}/image")
    public ResponseEntity<byte[]> getImage(@PathVariable Long postId) {
        Post post = postService.getPostWithImage(postId);
        
        if (post.getImageData() == null || post.getImageData().length == 0) {
            return ResponseEntity.notFound().build();
        }
        
        String fileName = post.getImageFileName() != null ? post.getImageFileName() : "image";
        String contentType = post.getImageContentType() != null
                ? post.getImageContentType()
                : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + fileName + "\"")
                .contentType(MediaType.parseMediaType(contentType))
                .body(post.getImageData());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public PostResponse create(
            @RequestParam(name = "image") MultipartFile image,
            @RequestParam(name = "description") String description
    ) throws IOException {
        CreatePostRequest request = new CreatePostRequest(image, description);
        Long userId = authService.requireCurrentUser().getId();
        return postService.create(request, userId);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(@PathVariable Long postId) {
        User currentUser = authService.requireCurrentUser();
        postService.delete(postId, currentUser.getId(), currentUser instanceof com.example.social.entity.AdminUser);
        activityLogService.record(currentUser, "DELETE_POST", "POST", postId, "Excluiu uma demanda");
        return ResponseEntity.noContent().build();
    }
}
