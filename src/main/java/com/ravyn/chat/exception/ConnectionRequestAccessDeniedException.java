package com.ravyn.chat.exception;

public class ConnectionRequestAccessDeniedException extends RuntimeException {
    public ConnectionRequestAccessDeniedException() {
        super("Connection request access denied.");
    }
}
