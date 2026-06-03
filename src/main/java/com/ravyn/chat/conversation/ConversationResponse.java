package com.ravyn.chat.conversation;

import lombok.Getter;

@Getter
public class ConversationResponse {
    private Long id;
    private Long otherUserId;
    private String otherUsername;

    public ConversationResponse(Long id, Long otherUserId, String otherUsername) {
        this.id = id;
        this.otherUserId = otherUserId;
        this.otherUsername = otherUsername;
    }
}
