package com.ravyn.chat.exception;

public class ConnectionRequestAlreadyResolvedException extends RuntimeException {
    public ConnectionRequestAlreadyResolvedException() {
        super("The connection request has already been resolved.");
    }
}
