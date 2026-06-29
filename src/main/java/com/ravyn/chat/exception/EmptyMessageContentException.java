package com.ravyn.chat.exception;

public class EmptyMessageContentException extends RuntimeException{
    public EmptyMessageContentException(){
        super("Message content cannot be blank");
    }
}
