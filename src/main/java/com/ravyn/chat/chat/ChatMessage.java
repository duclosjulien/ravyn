package com.ravyn.chat.chat;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ChatMessage {
    private Long conversationId;
    private Long senderId;
    private String content;

    public ChatMessage() {}

    public ChatMessage(Long conversationId, Long senderId, String content) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
    }

    public static ChatMessageBuilder builder() {
        return new ChatMessageBuilder();
    }

    public static class ChatMessageBuilder {
        private Long conversationId;
        private Long senderId;
        private String content;
    }

    public ChatMessage build() {
        return new ChatMessage(conversationId, senderId, content);
    }
}