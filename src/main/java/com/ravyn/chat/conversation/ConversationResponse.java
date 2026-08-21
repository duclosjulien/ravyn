package com.ravyn.chat.conversation;

import com.ravyn.chat.user.UserSummary;
import lombok.Getter;

import java.time.Instant;

@Getter
public class ConversationResponse {
    private Long id;
    private UserSummary otherUser;
    private String lastMessageContent;
    private Instant lastMessageCreatedAt;
    private Long lastMessageSenderId;
    private boolean needsAttention;

    public ConversationResponse(Long id, UserSummary otherUser, String lastMessageContent, Instant lastMessageCreatedAt, Long lastMessageSenderId, boolean needsAttention) {
        this.id = id;
        this.otherUser = otherUser;
        this.lastMessageContent = lastMessageContent;
        this.lastMessageCreatedAt = lastMessageCreatedAt;
        this.lastMessageSenderId = lastMessageSenderId;
        this.needsAttention = needsAttention;
    }
}
