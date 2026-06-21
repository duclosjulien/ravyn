package com.ravyn.chat.exception;

public class ConversationAccessDeniedException extends RuntimeException{
    public ConversationAccessDeniedException(Long conversationId){
        super("Access denied to conversation " + conversationId);
    }
}
