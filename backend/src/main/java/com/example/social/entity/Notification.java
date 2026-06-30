package com.example.social.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Notification {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "recipient_id")
    private User recipient;
    @ManyToOne @JoinColumn(name = "actor_id")
    private User actor;
    @Column(nullable = false, length = 40)
    private String type;
    @Column(nullable = false, length = 300)
    private String message;
    @Column(name = "post_id")
    private Long postId;
    @Column(name = "is_read", nullable = false)
    private boolean read;
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
