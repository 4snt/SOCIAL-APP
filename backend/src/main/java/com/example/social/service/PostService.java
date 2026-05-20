package com.example.social.service;

import com.example.social.dto.CreatePostRequest;
import com.example.social.dto.PostResponse;
import com.example.social.entity.Post;
import com.example.social.entity.User;
import com.example.social.repository.CommentRepository;
import com.example.social.repository.LikeRepository;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository,
                       LikeRepository likeRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
    }

    public PostResponse create(CreatePostRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        Post saved = postRepository.save(Post.builder()
                .user(user)
                .imageUrl(request.imageUrl())
                .description(request.description())
                .createdAt(LocalDateTime.now())
                .build());
        return toResponse(saved, userId);
    }

    public List<PostResponse> findPosts(Long userId, String sortBy, String direction, Long currentUserId) {
        List<Post> posts = (userId != null)
                ? postRepository.findByUserId(userId)
                : postRepository.findAllWithUser();

        Comparator<PostResponse> comparator = switch (sortBy) {
            case "username" -> Comparator.comparing(PostResponse::username, String.CASE_INSENSITIVE_ORDER);
            case "likes" -> Comparator.comparingLong(PostResponse::likeCount);
            default -> Comparator.comparing(PostResponse::createdAt);
        };
        if ("desc".equalsIgnoreCase(direction)) {
            comparator = comparator.reversed();
        }

        return posts.stream()
                .map(post -> toResponse(post, currentUserId))
                .sorted(comparator)
                .toList();
    }

    public PostResponse findById(Long postId, Long currentUserId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        return toResponse(post, currentUserId);
    }

    private PostResponse toResponse(Post post, Long currentUserId) {
        boolean liked = currentUserId != null &&
                likeRepository.existsByUserIdAndPostId(currentUserId, post.getId());
        return new PostResponse(
                post.getId(),
                post.getUser().getId(),
                post.getUser().getUsername(),
                post.getUser().getAvatarUrl(),
                post.getImageUrl(),
                post.getDescription(),
                likeRepository.countByPostId(post.getId()),
                commentRepository.countByPostId(post.getId()),
                liked,
                post.getCreatedAt()
        );
    }
}
