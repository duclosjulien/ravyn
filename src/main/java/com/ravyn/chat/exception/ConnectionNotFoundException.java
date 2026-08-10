package com.ravyn.chat.exception;

public class ConnectionNotFoundException extends RuntimeException {
    public ConnectionNotFoundException() {
        super("Connection not found.");
    }
}
