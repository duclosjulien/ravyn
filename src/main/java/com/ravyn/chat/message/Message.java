package com.ravyn.chat.message;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.Getter;

import java.time.Instant;

@Getter
@Entity
public class Message {
    @Id
    @GeneratedValue
    private Long id;

    private Long conversationId;
    private Long senderId;
    private String content;
    private Instant createdAt;

    protected Message(){}

    public Message(Long conversationId, Long senderId, String content) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.createdAt = Instant.now();
    }
}
