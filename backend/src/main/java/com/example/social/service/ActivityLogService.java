package com.example.social.service;

import com.example.social.dto.ActivityLogResponse;
import com.example.social.entity.ActivityLog;
import com.example.social.entity.User;
import com.example.social.repository.ActivityLogRepository;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ActivityLogService {

    private final ActivityLogRepository activityLogRepository;
    private final UserService userService;

    public ActivityLogService(ActivityLogRepository activityLogRepository, UserService userService) {
        this.activityLogRepository = activityLogRepository;
        this.userService = userService;
    }

    @Transactional
    public void record(User user, String actionType, String targetType, Long targetId, String details) {
        activityLogRepository.save(ActivityLog.builder()
                .user(user)
                .actionType(actionType)
                .targetType(targetType)
                .targetId(targetId)
                .details(details)
                .createdAt(LocalDateTime.now())
                .build());
    }

    @Transactional(readOnly = true)
    public List<ActivityLogResponse> recent() {
        return activityLogRepository.findTop30ByOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    private ActivityLogResponse toResponse(ActivityLog log) {
        User user = log.getUser();
        return new ActivityLogResponse(
                log.getId(),
                user.getId(),
                user.getUsername(),
                user.getAvatarUrl(),
                userService.resolveUserType(user),
                log.getActionType(),
                log.getTargetType(),
                log.getTargetId(),
                log.getDetails(),
                log.getCreatedAt()
        );
    }
}