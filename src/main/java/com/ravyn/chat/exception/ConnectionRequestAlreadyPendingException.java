package com.ravyn.chat.exception;

public class ConnectionRequestAlreadyPendingException extends RuntimeException {
    public ConnectionRequestAlreadyPendingException() {
        super("Connection request is already pending.");
    }
}
