package com.example.social.repository;
import com.example.social.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import  java.util.List;
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p JOIN FETCH p.user")
    List<Post> findAllWithUser();

    @Query("SELECT p FROM Post p JOIN FETCH p.user WHERE p.user.id = :userId")
    List<Post> findByUserId(Long userId);

    void deleteById(Long id);
}
