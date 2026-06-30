package com.example.social.controller;

import com.example.social.dto.LoginRequest;
import com.example.social.dto.UserResponse;
import com.example.social.entity.User;
import com.example.social.service.AuthService;
import com.example.social.service.ActivityLogService;
import com.example.social.service.UserService;
import jakarta.servlet.http.HttpSession;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final AuthService authService;
    private final ActivityLogService activityLogService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UserService userService,
            AuthService authService,
            ActivityLogService activityLogService
    ) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.authService = authService;
        this.activityLogService = activityLogService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest request, HttpSession session) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password())
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
            session.setAttribute(
                    HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                    SecurityContextHolder.getContext()
            );
            User user = userService.findByEmail(request.email())
                    .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
                userService.touchPresence(user);
                activityLogService.record(user, "LOGIN", "AUTH", null, "Entrou no sistema");
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "user", toResponse(user)
            ));
        } catch (AuthenticationException e) {
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "Credenciais inválidas"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Erro ao processar login"
            ));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpSession session) {
        authService.getCurrentUser().ifPresent(user -> {
            userService.touchPresence(user);
            activityLogService.record(user, "LOGOUT", "AUTH", null, "Saiu do sistema");
        });
        session.invalidate();
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logout realizado"));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        return authService.getCurrentUser()
                .map(user -> {
                    User touched = userService.touchPresence(user);
                    return ResponseEntity.ok(toResponse(touched));
                })
                .orElse(ResponseEntity.status(401).build());
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(
                u.getId(),
                u.getUsername(),
                u.getEmail(),
                u.getAvatarUrl(),
                u.getBio(),
                userService.resolveUserType(u),
                u.getLastSeenAt(),
                userService.isOnline(u)
        );
    }
}
