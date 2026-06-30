package com.example.social.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "posts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Post {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;
    @JdbcTypeCode(SqlTypes.VARBINARY)
    @Column(name = "image_data")
    private byte[] imageData;
    @Column(length = 100)
    private String imageFileName;
    @Column(length = 50)
    private String imageContentType;
    @Column(nullable = false, length = 1000)
    private String description;
    @Column(nullable = false)
    private LocalDateTime createdAt;
    @Column(nullable = false)
    private String status;

    @Column(length = 40)
    private String categoria;
    private Double latitude;
    private Double longitude;
    @Column(name = "location_name", length = 150)
    private String locationName;


}
