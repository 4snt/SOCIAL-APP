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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

@Service
public class PostService {
    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "PENDENTE", "ABERTA", "EM_ANDAMENTO", "CONCLUIDA", "CANCELADA"
    );
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final ActivityLogService activityLogService;

    public PostService(PostRepository postRepository, UserRepository userRepository,
                       LikeRepository likeRepository, CommentRepository commentRepository,
                       ActivityLogService activityLogService) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.likeRepository = likeRepository;
        this.commentRepository = commentRepository;
        this.activityLogService = activityLogService;
    }

    public PostResponse create(CreatePostRequest request, Long userId) throws IOException {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        MultipartFile imageFile = request.image();
        
        // Validar arquivo
        String contentType = null;
        byte[] imageData = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            contentType = imageFile.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                throw new IllegalArgumentException("Apenas arquivos de imagem são permitidos");
            }
            imageData = imageFile.getBytes();
        }
        
        Post saved = postRepository.save(Post.builder()
                .user(user)
                .imageData(imageData)
                .imageFileName(imageFile == null ? null : imageFile.getOriginalFilename())
                .imageContentType(contentType)
                .description(request.description())
                .createdAt(LocalDateTime.now())
                .status("PENDENTE")
                .categoria(request.categoria())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .locationName(request.locationName())
                .build());
        activityLogService.record(user, "CREATE_POST", "POST", saved.getId(), request.description());
        return toResponse(saved, userId);
    }

    public List<PostResponse> findPosts(Long userId, String sortBy, String direction, Long currentUserId) {
        List<Post> posts = (userId != null)
                ? postRepository.findByUserId(userId)
                : postRepository.findAllWithUser();

        Comparator<PostResponse> comparator = switch (sortBy) {
            case "username" -> Comparator.comparing(PostResponse::username, String.CASE_INSENSITIVE_ORDER);
            case "likes" -> Comparator.comparingLong(PostResponse::likeCount);
            case "attention" -> Comparator.comparingLong(post -> post.likeCount() + (post.commentCount() * 2));
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

    @Transactional
    public void delete(Long postId, Long currentUserId, boolean isAdmin) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        if (!isAdmin && !post.getUser().getId().equals(currentUserId)) {
            throw new RuntimeException("Você não pode apagar este post");
        }

        likeRepository.deleteByPostId(postId);
        commentRepository.deleteByPostId(postId);
        postRepository.delete(post);
    }

    public byte[] getImageData(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        return post.getImageData();
    }

    public Post getPostWithImage(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
    }

    @Transactional
    public PostResponse updateStatus(Long postId, String status, Long currentUserId) {
        if (status == null || !ALLOWED_STATUSES.contains(status.toUpperCase())) {
            throw new IllegalArgumentException("Situação de demanda inválida");
        }
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post não encontrado"));
        post.setStatus(status.toUpperCase());
        return toResponse(postRepository.save(post), currentUserId);
    }

    private PostResponse toResponse(Post post, Long currentUserId) {
        boolean liked = currentUserId != null &&
                likeRepository.existsByUserIdAndPostId(currentUserId, post.getId());
        
        // Converter imagem para base64 se existir
        String imageUrl = null;
        if (post.getImageData() != null && post.getImageData().length > 0) {
            String base64Image = Base64.getEncoder().encodeToString(post.getImageData());
            imageUrl = "data:" + post.getImageContentType() + ";base64," + base64Image;
        }
        
        return new PostResponse(
                post.getId(),
                post.getUser().getId(),
                post.getUser().getUsername(),
                post.getUser().getAvatarUrl(),
                resolveUserType(post.getUser()),
                isOnline(post.getUser()),
                imageUrl,
                post.getDescription(),
                likeRepository.countByPostId(post.getId()),
                commentRepository.countByPostId(post.getId()),
                liked,
                post.getCreatedAt(),
                post.getStatus(),
                post.getCategoria(),
                post.getLatitude(),
                post.getLongitude(),
                post.getLocationName()
        );
    }

    private String resolveUserType(User user) {
        if (user instanceof com.example.social.entity.AdminUser) return "ADMIN";
        if (user instanceof com.example.social.entity.UniversityUser) return "UNIVERSITY";
        if (user instanceof com.example.social.entity.StudentsUser) return "STUDENT";
        return "USER";
    }

    private boolean isOnline(User user) {
        return user.getLastSeenAt() != null && user.getLastSeenAt().isAfter(LocalDateTime.now().minusMinutes(5));
    }
}
