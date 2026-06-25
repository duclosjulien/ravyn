package com.ravyn.chat.conversation;

import lombok.Getter;

import java.time.Instant;

@Getter
public class ConversationResponse {
    private Long id;
    private Long otherUserId;
    private String otherUsername;
    private String lastMessageContent;
    private Instant lastMessageCreatedat;

    public ConversationResponse(Long id, Long otherUserId, String otherUsername, String lastMessageContent, Instant lastMessageCreatedat) {
        this.id = id;
        this.otherUserId = otherUserId;
        this.otherUsername = otherUsername;
        this.lastMessageContent = lastMessageContent;
        this.lastMessageCreatedat = lastMessageCreatedat;
    }
}
