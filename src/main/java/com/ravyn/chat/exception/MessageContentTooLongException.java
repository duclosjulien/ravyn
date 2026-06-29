package com.ravyn.chat.exception;

public class MessageContentTooLongException extends RuntimeException {
    public MessageContentTooLongException(int maxMessageContentLength) {
        super("Message content cannot exceed " + maxMessageContentLength + " characters.");
    }
}
