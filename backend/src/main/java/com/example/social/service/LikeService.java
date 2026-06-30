package com.example.social.service;

import com.example.social.entity.Like;
import com.example.social.entity.Post;
import com.example.social.entity.User;
import com.example.social.repository.LikeRepository;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
public class LikeService {
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final PostRepository postRepository;
    private final NotificationService notificationService;
    public LikeService(LikeRepository likeRepository, UserRepository userRepository, PostRepository postRepository, NotificationService notificationService) {
        this.likeRepository = likeRepository; this.userRepository = userRepository; this.postRepository = postRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public long like(Long postId, Long userId) {
        if (!likeRepository.existsByUserIdAndPostId(userId, postId)) {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            Post post = postRepository.findById(postId).orElseThrow(() -> new RuntimeException("Post não encontrado"));
            likeRepository.save(Like.builder().user(user).post(post).createdAt(LocalDateTime.now()).build());
            notificationService.notify(post.getUser(), user, "NEW_LIKE", "@" + user.getUsername() + " apoiou sua demanda", postId);
        }
        return likeRepository.countByPostId(postId);
    }

    @Transactional
    public long unlike(Long postId, Long userId) {
        likeRepository.deleteByUserIdAndPostId(userId, postId);
        return likeRepository.countByPostId(postId);
    }
}
