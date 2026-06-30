package com.example.social.service;

import com.example.social.dto.NotificationResponse;
import com.example.social.entity.Notification;
import com.example.social.entity.User;
import com.example.social.repository.NotificationRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
public class NotificationService {
    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public void notify(User recipient, User actor, String type, String message, Long postId) {
        if (recipient == null || (actor != null && recipient.getId().equals(actor.getId()))) return;
        repository.save(Notification.builder().recipient(recipient).actor(actor).type(type)
                .message(message).postId(postId).read(false).createdAt(LocalDateTime.now()).build());
    }

    public List<NotificationResponse> list(Long userId) {
        return repository.findTop30ByRecipientIdOrderByCreatedAtDesc(userId).stream().map(this::toResponse).toList();
    }

    public long unreadCount(Long userId) {
        return repository.countByRecipientIdAndReadFalse(userId);
    }

    @Transactional
    public void markRead(Long id, Long userId) {
        Notification notification = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notificação não encontrada"));
        if (!notification.getRecipient().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Notificação pertence a outro usuário");
        }
        notification.setRead(true);
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(n.getId(), n.getType(), n.getMessage(), n.getPostId(),
                n.getActor() == null ? null : n.getActor().getUsername(), n.isRead(), n.getCreatedAt());
    }
}
