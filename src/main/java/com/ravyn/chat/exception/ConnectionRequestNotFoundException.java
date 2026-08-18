package com.ravyn.chat.exception;

public class ConnectionRequestNotFoundException extends RuntimeException {
    public ConnectionRequestNotFoundException(Long connectionId) {
        super("Connection not found: " + connectionId);
    }
}
