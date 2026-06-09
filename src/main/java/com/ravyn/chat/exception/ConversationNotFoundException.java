package com.ravyn.chat.exception;

public class ConversationNotFoundException extends RuntimeException {
    public ConversationNotFoundException(Long conversationId) {
        super("Conversation not found: " + conversationId);
    }
}
