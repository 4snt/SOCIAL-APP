package com.example.social;

import com.example.social.entity.Post;
import com.example.social.entity.User;
import com.example.social.repository.LikeRepository;
import com.example.social.repository.PostRepository;
import com.example.social.repository.UserRepository;
import com.example.social.repository.ActivityLogRepository;
import com.example.social.repository.NotificationRepository;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.notNullValue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class ApiEndpointsTest {

    @LocalServerPort
    private int port;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private ActivityLogRepository activityLogRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User gabriel;
    private User maria;
    private Post gabrielPost;
    
    private static final byte[] DUMMY_IMAGE_BYTES = new byte[]{
        (byte) 0xFF, (byte) 0xD8, (byte) 0xFF, (byte) 0xE0, // JPEG magic number
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        (byte) 0xFF, (byte) 0xD9 // JPEG end marker
    };

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;

        notificationRepository.deleteAll();
        activityLogRepository.deleteAll();
        likeRepository.deleteAll();
        postRepository.deleteAll();
        userRepository.deleteAll();

        gabriel = userRepository.save(User.builder()
                .username("gabriel")
                .email("gabriel@email.com")
                .password(passwordEncoder.encode("123"))
                .build());

        maria = userRepository.save(User.builder()
                .username("maria")
                .email("maria@email.com")
                .password(passwordEncoder.encode("123"))
                .build());

        gabrielPost = postRepository.save(Post.builder()
                .user(gabriel)
                .imageData(DUMMY_IMAGE_BYTES)
                .imageFileName("gabriel.jpg")
                .imageContentType("image/jpeg")
                .description("Post do Gabriel")
                .createdAt(LocalDateTime.now())
                .status("CONCLUIDA")
                .build());

        postRepository.save(Post.builder()
                .user(maria)
                .imageData(DUMMY_IMAGE_BYTES)
                .imageFileName("maria.jpg")
                .imageContentType("image/jpeg")
                .description("Post da Maria")
                .createdAt(LocalDateTime.now())
                .status("CONCLUIDA")
                .build());
    }

    private String loginSession(String email, String password) {
        return given()
                .contentType(ContentType.JSON)
                .body(Map.of("email", email, "password", password))
        .when()
                .post("/api/auth/login")
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .extract()
                .cookie("JSESSIONID");
    }

    @Test
    void shouldRegisterUser() {
        given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                        "username", "joao",
                        "email", "joao@email.com",
                        "password", "123456"
                ))
        .when()
                .post("/api/auth/register")
        .then()
                .statusCode(200)
                .body("id", notNullValue())
                .body("username", equalTo("joao"))
                .body("email", equalTo("joao@email.com"));
    }

    @Test
    void shouldLoginSuccessfully() {
        given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                        "email", "gabriel@email.com",
                        "password", "123"
                ))
        .when()
                .post("/api/auth/login")
        .then()
                .statusCode(200)
                .body("success", equalTo(true))
                .body("user.id", equalTo(gabriel.getId().intValue()))
                .body("user.email", equalTo("gabriel@email.com"));
    }

    @Test
    void shouldRejectInvalidLogin() {
        given()
                .contentType(ContentType.JSON)
                .body(Map.of(
                        "email", "gabriel@email.com",
                        "password", "senha-errada"
                ))
        .when()
                .post("/api/auth/login")
        .then()
                .statusCode(200)
                .body("success", equalTo(false))
                .body("message", equalTo("Credenciais inválidas"));
    }

    @Test
    void shouldListAllPosts() {
        given()
        .when()
                .get("/api/posts")
        .then()
                .statusCode(200)
                .body("$", hasSize(2))
                .body("[0].id", notNullValue())
                .body("[0].username", notNullValue());
    }

    @Test
    void shouldFilterPostsByUser() {
        given()
                .queryParam("userId", gabriel.getId())
        .when()
                .get("/api/posts")
        .then()
                .statusCode(200)
                .body("$", hasSize(1))
                .body("[0].id", equalTo(gabrielPost.getId().intValue()))
                .body("[0].username", equalTo("gabriel"))
                .body("[0].description", equalTo("Post do Gabriel"));
    }

    @Test
    void shouldCreatePost() {
        String session = loginSession("gabriel@email.com", "123");
        given()
                .cookie("JSESSIONID", session)
                .multiPart("image", "test.jpg", DUMMY_IMAGE_BYTES, "image/jpeg")
                .multiPart("description", "Novo post de teste")
        .when()
                .post("/api/posts")
        .then()
                .statusCode(200)
                .body("id", notNullValue())
                .body("username", equalTo("gabriel"))
                .body("imageUrl", notNullValue())
                .body("description", equalTo("Novo post de teste"))
                .body("likeCount", equalTo(0));
    }

    @Test
    void shouldLikePost() {
        String session = loginSession("maria@email.com", "123");
        given()
                .cookie("JSESSIONID", session)
        .when()
                .post("/api/posts/{postId}/like", gabrielPost.getId())
        .then()
                .statusCode(200)
                .body("likes", greaterThanOrEqualTo(1));
    }

    @Test
    void shouldUnlikePost() {
        String session = loginSession("maria@email.com", "123");
        given()
                .cookie("JSESSIONID", session)
        .when()
                .post("/api/posts/{postId}/like", gabrielPost.getId())
        .then()
                .statusCode(200);

        given()
                .cookie("JSESSIONID", session)
        .when()
                .delete("/api/posts/{postId}/like", gabrielPost.getId())
        .then()
                .statusCode(200)
                .body("likes", equalTo(0));
    }
}
