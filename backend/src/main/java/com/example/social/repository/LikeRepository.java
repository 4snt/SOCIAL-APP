package com.example.social.repository;
import com.example.social.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
public interface LikeRepository extends JpaRepository<Like, Long> {
    long countByPostId(Long postId);
    boolean existsByUserIdAndPostId(Long userId, Long postId);
    void deleteByUserIdAndPostId(Long userId, Long postId);
    void deleteByPostId(Long postId);
}
