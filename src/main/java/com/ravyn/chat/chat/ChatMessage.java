package com.ravyn.chat.chat;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ChatMessage {
    private Long conversationId;
    private Long senderId;
    private String content;
    private MessageType type;

    public ChatMessage() {
    }

    public ChatMessage(Long conversationId, Long senderId, String content, MessageType type) {
        this.conversationId = conversationId;
        this.senderId = senderId;
        this.content = content;
        this.type = type;
    }

    public static ChatMessageBuilder builder() {
        return new ChatMessageBuilder();
    }

    public static class ChatMessageBuilder {

        private Long conversationId;
        private Long senderId;
        private String content;
        private MessageType type;

        public ChatMessageBuilder conversationId(Long conversationId) {
            this.conversationId = conversationId;
            return this;
        }

        public ChatMessageBuilder senderId(Long senderId) {
            this.senderId = senderId;
            return this;
        }

        public ChatMessageBuilder content(String content) {
            this.content = content;
            return this;
        }

        public ChatMessageBuilder type(MessageType type) {
            this.type = type;
            return this;
        }

        public ChatMessage build() {
            return new ChatMessage(conversationId, senderId, content, type);
        }
    }
}