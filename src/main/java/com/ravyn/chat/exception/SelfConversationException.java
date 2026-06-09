package com.ravyn.chat.exception;

public class SelfConversationException extends RuntimeException{
    public SelfConversationException(){
        super("User cannot create conversation with itself");
    }
}
