package com.ravyn.chat.message;

import lombok.Getter;

import java.time.Instant;

@Getter
public class MessageResponse {
    private Long id;
    private Long conversationId;
    private Long senderId;
    private String senderUsername;
    private String content;
    private Instant createdAt;

    public MessageResponse(Long id, Long conversationId, Long senderId, String senderUsername, String content, Instant createdAt) {
        this.id = id;
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.createdAt = createdAt;
    }
}
