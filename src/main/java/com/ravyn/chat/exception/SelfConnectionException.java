package com.ravyn.chat.exception;

public class SelfConnectionException extends RuntimeException {
    public SelfConnectionException() {
        super("User cannot create connection with itself");
    }
}
