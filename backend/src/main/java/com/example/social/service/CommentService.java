package com.example.social.service;

import com.example.social.dto.CommentResponse;
import com.example.social.dto.CreateCommentRequest;
import com.example.social.entity.Comment;
import com.example.social.entity.Post;
import com.example.social.entity.User;
import com.example.social.repository.CommentRepository;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    public List<CommentResponse> findByPostId(Long postId) {
        return commentRepository.findByPostIdWithUser(postId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public CommentResponse create(Long postId, CreateCommentRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        Comment saved = commentRepository.save(Comment.builder()
                .user(user)
                .post(post)
                .content(request.content())
                .createdAt(LocalDateTime.now())
                .build());
        return toResponse(saved);
    }

    @Transactional
    public void delete(Long commentId, Long userId, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comentário não encontrado"));
        if (!isAdmin && !comment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Você não pode apagar este comentário");
        }
        commentRepository.delete(comment);
    }

    private CommentResponse toResponse(Comment c) {
        return new CommentResponse(
                c.getId(),
                c.getUser().getId(),
                c.getUser().getUsername(),
                c.getUser().getAvatarUrl(),
                c.getContent(),
                c.getCreatedAt()
        );
    }
}
